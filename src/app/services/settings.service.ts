import { Injectable } from '@angular/core';

export interface INotificationSettings {
  survey: boolean,
  report: boolean,
  event: boolean,
  upcoming: boolean
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {

  // @@TODO: save this data to persistent storage and restore it upon app start
  public language: 'en' | 'es' = 'en';
  public notifications: INotificationSettings = {
    survey: true,
    report: true,
    event: false,
    upcoming: true
  };

  constructor() {
    let defaultLang = (window.navigator['userLanguage'] || window.navigator.language).substr( 0, 2 );
    if ( defaultLang !== 'en' && defaultLang !== 'es' ) defaultLang = 'es';
    this.language = defaultLang;
  }
}