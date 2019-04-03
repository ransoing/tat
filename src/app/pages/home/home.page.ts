import { Component, AfterViewInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, MiscService } from '../../services';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { LocalNotifications, ILocalNotification, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements AfterViewInit {

  constructor(
    public navCtrl: NavController,
    public translate: TranslateService,
    public settings: SettingsService,
    public miscService: MiscService,
    public splashScreen: SplashScreen,
    public notifications: LocalNotifications
  ) {
    // setTimeout( () => {
    //   this.notifications.getScheduledIds().then( (scheduledIds) => {
    //     if ( scheduledIds.length === 0 ) {
    //       // schedule a notification
    //       let d = new Date();
    //       d.setSeconds( d.getSeconds() + 30 );
    //       this.notifications.schedule({
    //         id: 2,
    //         title: 'Dur hurr',
    //         text: 'Get to it d00d',
    //         foreground: true,
    //         trigger: { at: d }
    //       });
    //       alert( 'scheduled one' );
    //     } else {
    //       this.notifications.get( scheduledIds[0] ).then(
    //       // this.notifications.getScheduled( scheduledIds[0] ).then(
    //         a => alert( JSON.stringify(a) ),
    //         f => alert('failed')
    //       );
    //       this.notifications.cancelAll();
    //     }
    //   });
    // }, 2000 );
  }

  onSetLanguage() {
    this.translate.use( this.settings.language );
    this.settings.saveSettings();
  }

  ngAfterViewInit() {
    setTimeout( () => this.splashScreen.hide(), 300 );
  }
}
