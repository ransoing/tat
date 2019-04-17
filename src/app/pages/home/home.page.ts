import { Component, AfterViewInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, MiscService, ScriptService, UserDataService } from '../../services';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NotificationType, INotificationData } from '../../models/notification';
import { ProxyAPIService } from '../../services/proxy-api.service';
import { SurveyFieldType } from '../../models/survey';

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
    public notifications: LocalNotifications,

    private scripts: ScriptService,
    private userDataService: UserDataService,
    private proxyAPI: ProxyAPIService
  ) {
    setTimeout( () => {
      this.notifications.getScheduledIds().then( (scheduledIds) => {
        if ( scheduledIds.length === 0 ) {
          // schedule a notification
          let d = new Date();
          d.setSeconds( d.getSeconds() + 20 );
          let d2 = new Date();
          d2.setSeconds( d2.getSeconds() + 22 );
          // the id of the notification is a mirror of its data
          let data: INotificationData = {
            type: NotificationType.UNFINISHED_ACTIVITY,
            salesforceId: 'blabla'
          };
          this.notifications.schedule([{
            id: Math.round( Math.random() * 99999999 ),
            data: data,
            title: 'Hello Elanora',
            text: 'How did your outreach to ___ go? Fill out this report.',
            trigger: { at: d }
          }, {
            id: Math.round( Math.random() * 99999999 ),
            data: {
              type: NotificationType.UNFINISHED_ACTIVITY,
              salesforceId: 'h8hoh'
            },
            title: 'Elanora Elanora Elanora',
            text: 'Don\'t eat my beard!',
            trigger: { at: d2 }
          }]);
          console.log( '@@@ notifications scheduled' ); 
        } else {
          // if there is a notification scheduled
          // for all scheduledIds, search for which one is 'blabla' and cancel it
          scheduledIds.forEach( async id => {
            const notification = await this.notifications.get( id );
            const data = typeof notification.data === 'string' ? JSON.parse( notification.data ) : notification.data;
            if ( data.salesforceId === 'blabla' ) {
              this.notifications.cancel( id );
            }
          });
        }
      });
    }, 2000 );

    this.scripts.loadScript( 'surveys' ).then( a => {
      setTimeout( () => {
        let s = new window['SurveyService']( this.userDataService, this.proxyAPI, this.miscService, SurveyFieldType );
        console.log( s );
        console.log( s.hoursLogSurvey() );
      }, 2000 );
    });
  }

  onSetLanguage() {
    this.translate.use( this.settings.language );
    this.settings.saveSettings();
  }

  ngAfterViewInit() {
    setTimeout( () => this.splashScreen.hide(), 300 );
  }
}
