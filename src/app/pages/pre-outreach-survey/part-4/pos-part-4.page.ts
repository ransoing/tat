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
    if ( formsService.preOutreachForm === undefined ) {
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
          buttons: [await this.trx.t( 'misc.close' )]
        });
        alert.present();
        alert.onDidDismiss().then( () => {
          // clear the form and navigate back to the volunteer homepage
          this.navCtrl.navigateRoot( '/tabs/(volunteer:volunteer)' )
          .then( () => this.formsService.resetPreOutreachForm() );
        });
      } else {
        // @@ on error
        const alert = await this.alertController.create({
          header: await this.trx.t( 'misc.error' ),
          message: await this.trx.t( 'misc.submitError' ),
          buttons: [await this.trx.t( 'misc.close' )]
        });
        alert.present();
      }
    }, 3000 );
    
  }
}
