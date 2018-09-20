// from https://github.com/ngx-translate/core/issues/469
// this allows self-referential links within i18n json files

import { TranslateCompiler } from '@ngx-translate/core';

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
                currentTranslations[key] = currentTranslations[key].replace(/@:(\S+)/, (matches, key) => this.getDescendantPropertyValue(masterLanguageFile, key) );
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
