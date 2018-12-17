import { Component } from '@angular/core';
import { FormsService, TrxService } from '../../services';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  templateUrl: './hours-log-form.component.html'
})
export class HoursLogFormComponent {

  public modal: HTMLIonModalElement;
  
  constructor(
    public formsService: FormsService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public trx: TrxService
  ) {
    if ( formsService.hoursForm === undefined ) {
      formsService.resetHoursForm();
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
          message: await this.trx.t( 'volunteer.logHours.submitSuccess' ),
          buttons: [await this.trx.t( 'misc.close' )]
        });
        alert.present();
        alert.onDidDismiss().then( () => {
          // clear the form and navigate back to the volunteer homepage
          this.modal.dismiss()
          .then( () => this.formsService.resetHoursForm() );
        });
      } else {
        // @@ on error
        const alert = await this.alertController.create({
          header: await this.trx.t( 'misc.error' ),
          message: await this.trx.t( 'misc.submitError' ),
          buttons: [await this.trx.t( 'misc.ok' )]
        });
        alert.present();
      }
    }, 3000 );
    
  }

}
