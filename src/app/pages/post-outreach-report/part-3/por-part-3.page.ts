import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { FormsService, TrxService } from '../../../services';

@Component({
  templateUrl: 'por-part-3.page.html'
})
export class PORPart3Page {
  constructor(
    public navCtrl: NavController,
    public formsService: FormsService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public trx: TrxService
  ) {
    if ( formsService.postOutreachForm === false ) {
      formsService.resetPostOutreachForm();
    }
  }

  async submitForm() {
    console.log( '@@ Check internet connection. Connect to salesforce.' );

    let loading = await this.loadingController.create({
      message: await this.trx.t( 'misc.pleaseWait' )
    });
    loading.present();
    setTimeout( async () => {
      loading.dismiss();

      const success = true;

      // @@ on success
      if ( success ) {
        const alert = await this.alertController.create({
          header: await this.trx.t( 'misc.success' ),
          message: await this.trx.t( 'postOutreachReport.submitSuccess' ),
          buttons: [await this.trx.t( 'misc.ok' )]
        });
        alert.present();
        alert.onDidDismiss().then( () => {
          // clear the form and navigate back to the volunteer homepage
          this.formsService.preOutreachForm = false;
          this.navCtrl.navigateRoot( '/tabs/(volunteer:volunteer)' );
        });
      } else {
        // @@ on error
        const alert = await this.alertController.create({
          header: await this.trx.t( 'misc.error' ),
          message: await this.trx.t( 'postOutreachReport.submitError' ),
          buttons: [await this.trx.t( 'misc.ok' )]
        });
        alert.present();
      }
    }, 3000 );
    
  }
}
