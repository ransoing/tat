import { TranslateCompiler, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { environment } from '../environments/environment';
import { parseVersionString, IVersion, maxVersion, versionCmp } from './models/version';

interface ITranslationCache {
    version: IVersion;
    translation: any;
}

/** Attempts to load a language file from an external source, but falls back to a local source if it's not available */
export class FallbackTranslateHttpLoader implements TranslateLoader {

    constructor(
        private http: HttpClient,
        public externalPrefix: string,
        public localPrefix = '/assets/i18n/',
        public suffix = '.json',
        public timeoutMs = 2000
    ) {}

    private _indexedDbName = 'tat-i18n';

    /**
     * get translation file cached in indexedDB. In case of error, return a "null" translation file with a version of 0.0.0
     */
    private async _getCachedTranslation( key: string ): Promise<ITranslationCache> {
        return new Promise<ITranslationCache>( async (resolve,reject) => {
            try {
                const db = await this._openDb();
                const request = db.transaction( [this._indexedDbName], 'readwrite' ).objectStore( this._indexedDbName ).get( key );
                request.onerror = () => { throw '' };
                request.onsuccess = (e:any) => resolve( e.target.result );
            } catch( e ) {
                return {
                    version: '0.0.0',
                    translation: {}
                };
            }
        });
    }

    private async _setCachedTranslation( key: string, data: any ) {
        try {
            const db = await this._openDb();
            db.transaction( [this._indexedDbName], 'readwrite' ).objectStore( this._indexedDbName ).put( data, key );
        } catch( e ) {
            // silently fail.
        }
    }

    private _openDb(): Promise<any> {
        return new Promise( (resolve,reject) => {
            let request = window.indexedDB.open( this._indexedDbName, 1 );
            request.onerror = e => reject( e );
            request.onupgradeneeded = (e:any) => {
                const db = e.target.result;
                db.createObjectStore( this._indexedDbName ).onsuccess = () => resolve( db );
            };
            request.onsuccess = (e:any) => resolve( e.target.result );
        });
    }

    /** Gets translations file from somewhere, or from the local source */
    getTranslation( lang: string ): Observable<Object> {

        return new Observable( subscriber => {
            this._updateSubscriberWithTranslation( subscriber, lang );
        });
    }

    private async _updateSubscriberWithTranslation( subscriber: Subscriber<any>, lang: string ) {
        // set up an identifier for local storage
        const storageKey = `i18n_${lang}`;

        const loadLocalTranslations = async () => {
            // load the cached translations, or the ones packaged with the app; whichever is newer
            if ( versionCmp(cacheVer, appVer) > 0 ) {
                // use the cache
                subscriber.next( cache.translation );
            } else {
                // use the local files
                const result = await this.http.get( `${this.localPrefix}${lang}${this.suffix}` ).toPromise();
                subscriber.next( result );
            }
            subscriber.complete();
        };

        // find local versions
        const appVer = parseVersionString( environment.version ); // version of the resources that the app shipped with
        const cache = await this._getCachedTranslation( storageKey ) as ITranslationCache;
        const cacheVer = cache ? cache.version : parseVersionString('0.0.0');
        const maxLocalVer = maxVersion( cacheVer, appVer ); // version of the latest resources, saved locally

        // read the remote version
        let versionString;
        try {
            // versionString = await this.http.get( `${environment.externalResourcesURL}version` ).toPromise();
            versionString = await this._httpGetWithTimeout( `${environment.externalResourcesURL}version`, this.timeoutMs );
        } catch (e) {
            loadLocalTranslations();
            return;
        }

        const remoteVer = parseVersionString( versionString as string ); // version of remote resources

        if ( remoteVer.major === appVer.major && remoteVer.minor === appVer.minor && remoteVer.patch > maxLocalVer.patch ) {
            try {
                // the remote resources are compatible with this version of the app, and are newer. Use the remote version and cache it.
                const remoteTranslation = await this._httpGetWithTimeout( `${this.externalPrefix}${lang}${this.suffix}`, this.timeoutMs );
                this._setCachedTranslation( storageKey, {
                    version: remoteVer,
                    translation: remoteTranslation
                });
                subscriber.next( remoteTranslation );
                subscriber.complete();
            } catch (e) {
                loadLocalTranslations();
                return;
            }
        } else {
            loadLocalTranslations();
        }
    }

    private _httpGetWithTimeout( url: string, timeoutMs: number ): Promise<any> {
        return new Promise( (resolve, reject) => {
            // resolve or reject when the http promise finishes
            this.http.get( url ).toPromise().then( val => resolve(val) ).catch( e => reject(e) );
            // reject when the timeout finishes
            setTimeout( () => reject(new Error('Timeout while loading remote language files')), timeoutMs );
        });
    }
}


// from https://github.com/ngx-translate/core/issues/469
// this allows self-referential links within i18n json files
export class SelfReferentialCompiler extends TranslateCompiler {
    /*
    * Needed by ngx-translate
    */
    public compile(value: string, lang: string): string {
        return value;
    }

    /*
    * Triggered once from TranslateCompiler
    * Initiates recurive this.parseReferencePointers()
    * Returns modified translations object for ngx-translate to process
    */
    public compileTranslations(translations: any, lang: string) {
        this.parseReferencePointers(translations, translations);
        return translations;
    }

    /*
    * Triggered once from this.compileTranslations()
    * Recursively loops through an object,
    * replacing substrings that start with '@:' with the defined translation key
    * i.e. '@:GLOBALS.GREETING please log in' becomes 'Hello please log in' if GLOBALS.GREETING is defined in the json file as 'Hello'
    */
    private parseReferencePointers(currentTranslations, masterLanguageFile) {
        Object.keys(currentTranslations).forEach((key) => {
            if (currentTranslations[key] !== null && typeof currentTranslations[key] === 'object') {
                this.parseReferencePointers(currentTranslations[key], masterLanguageFile);
                return;
            }
            if (typeof currentTranslations[key] === 'string') {
                currentTranslations[key] = currentTranslations[key].replace(/@:(\S+)/g, (matches, key) => this.getDescendantPropertyValue(masterLanguageFile, key) );
            }
        });
    }

    /*
    * Takes a string representation of an objects dot notation
    * i.e. "APP_CORE.LABEL.LOCATION"
    * and returns the property value of the input objects property
    */
    private getDescendantPropertyValue(obj, desc) {
        var arr = desc.split(".");
        while(arr.length && (obj = obj[arr.shift()]));
        return obj;
    }

}
