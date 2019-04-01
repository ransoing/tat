import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * When changing any of these settings, you must subsequently call saveSettings() to apply it to permanent storage.
 */

export interface IUserSettings {
  language: 'en' | 'es',
  notifications: {
    preEventSurveyReminder: boolean, // reminds user to fill out the pre-event survey, before an event (doesn't apply to Truck Stop volunteers)
    reportReminder: boolean, // reminds user to fill out either post-outreach reports or post-event reports (depends on the volunteer type)
    upcomingEvents: boolean // reminds user about upcoming TAT outreach events (doesn't apply to Truck Stop volunteers)
  }
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService implements IUserSettings {

  public language: IUserSettings['language'];
  public notifications: IUserSettings['notifications'];

  private isReady: boolean = false;
  
  private settingsStorageKey = 'user-settings';

  constructor( private storage: Storage ) {
    this.initSettings();
  }

  async initSettings() {
    // try to restore saved settings
    if ( !await this.loadSettings() ) {
      // apply defaults
      let defaultLang = (window.navigator['userLanguage'] || window.navigator.language).substr( 0, 2 );
      if ( defaultLang !== 'en' && defaultLang !== 'es' ) defaultLang = 'es';

      this.language = defaultLang,
      this.notifications = {
        preEventSurveyReminder: true,
        reportReminder: true,
        upcomingEvents: true
      };

      this.saveSettings();
    }

    this.isReady = true;
  }

  async waitForReady(): Promise<any> {
    let interval;
    return new Promise( (resolve, reject) => {
      interval = setInterval( () => {
        if ( this.isReady ) {
          clearInterval( interval );
          resolve();
        }
      }, 100 );
    });
  }

  async saveSettings() {
    // save to storage
    return this.storage.set( this.settingsStorageKey, {
      language: this.language,
      notifications: this.notifications
    });
  }

  // returns a promise which resolves with true or false depending on whether settings were loaded successfully
  async loadSettings(): Promise<Boolean> {
    let settings = await this.storage.get( this.settingsStorageKey );
    if ( settings ) {
      // apply settings
      this.language = settings.language;
      this.notifications = settings.notifications;
    }
    return !!settings;
  }

}