import { Component, AfterViewInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, MiscService, TrxService } from '../../services';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { NotificationType, INotificationData } from '../../models/notification';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements AfterViewInit {

  private readonly doNotShowContentWarningStorageKey = 'doNotShowContentWarning';

  constructor(
    public navCtrl: NavController,
    public translate: TranslateService,
    public settings: SettingsService,
    public miscService: MiscService,
    public splashScreen: SplashScreen,
    private trx: TrxService,
    private alertController: AlertController,
    private storage: Storage
  ) {
    // setTimeout( () => {
    //   this.notifications.getScheduledIds().then( (scheduledIds) => {
    //     if ( scheduledIds.length === 0 ) {
    //       // schedule a notification
    //       let d = new Date();
    //       d.setSeconds( d.getSeconds() + 20 );
    //       let d2 = new Date();
    //       d2.setSeconds( d2.getSeconds() + 22 );
    //       // the id of the notification is a mirror of its data
    //       let data: INotificationData = {
    //         type: NotificationType.OUTREACH_LOCATION,
    //         salesforceId: 'blabla'
    //       };
    //       this.notifications.schedule([{
    //         id: Math.round( Math.random() * 99999999 ),
    //         data: data,
    //         title: 'Hello Elanora',
    //         text: 'How did your outreach to ___ go? Fill out this report.',
    //         trigger: { at: d }
    //       }, {
    //         id: Math.round( Math.random() * 99999999 ),
    //         data: {
    //           type: NotificationType.OUTREACH_LOCATION,
    //           salesforceId: 'h8hoh'
    //         },
    //         title: 'Elanora Elanora Elanora',
    //         text: 'Don\'t eat my beard!',
    //         trigger: { at: d2 }
    //       }]);
    //       console.log( '@@@ notifications scheduled' ); 
    //     } else {
    //       // if there is a notification scheduled
    //       // for all scheduledIds, search for which one is 'blabla' and cancel it
    //       scheduledIds.forEach( async id => {
    //         const notification = await this.notifications.get( id );
    //         const data = typeof notification.data === 'string' ? JSON.parse( notification.data ) : notification.data;
    //         if ( data.salesforceId === 'blabla' ) {
    //           this.notifications.cancel( id );
    //         }
    //       });
    //     }
    //   });
    // }, 2000 );

    // wait one second before triggering the warning
    setTimeout( () => this.triggerContentWarning(), 1000 );
  }

  async triggerContentWarning() {
    // show a content warning, unless the user has chosen not to see the warning
    let avoidWarning = await this.storage.get( this.doNotShowContentWarningStorageKey );
    if ( !avoidWarning ) {
      const alert = await this.alertController.create({
        message: await this.trx.t( 'home.contentWarning' ),
        buttons: [{
          text: await this.trx.t( 'misc.buttons.doNotShow'),
          handler: () => {
            // save to storage that we should avoid this warning
            this.storage.set( this.doNotShowContentWarningStorageKey, true );
          }
        }, {
          text: await this.trx.t( 'misc.buttons.continue'),
          role: 'cancel'
        }]
      });
      alert.present();
    }
  }

  onSetLanguage() {
    this.translate.use( this.settings.language );
    this.settings.saveSettings();
  }

  ngAfterViewInit() {
    setTimeout( () => this.splashScreen.hide(), 300 );
  }
}
