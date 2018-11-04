import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { FormsService, ModalService, TrxService } from '../../../services';

@Component({
  templateUrl: 'pos-part-4.page.html'
})
export class POSPart4Page {

  constructor(
    public navCtrl: NavController,
    public formsService: FormsService,
    public modalService: ModalService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public trx: TrxService
  ) {
    if ( formsService.preOutreachForm === false ) {
      formsService.resetPreOutreachForm();
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

      const success = false;

      // @@ on success
      if ( success ) {
        const alert = await this.alertController.create({
          header: await this.trx.t( 'misc.success' ),
          message: await this.trx.t( 'preOutreachSurvey.submitSuccess' ),
          buttons: [await this.trx.t( 'misc.ok' )]
        });
        alert.present();
        alert.onDidDismiss().then( () => this.navCtrl.navigateRoot( '/tabs/(volunteer:volunteer)' ) );
      } else {
        // @@ on error
        const alert = await this.alertController.create({
          header: await this.trx.t( 'misc.error' ),
          message: await this.trx.t( 'preOutreachSurvey.submitError' ),
          buttons: [await this.trx.t( 'misc.ok' )]
        });
        alert.present();
      }
    }, 3000 );
    
  }
}
