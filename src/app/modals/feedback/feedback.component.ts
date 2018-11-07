import { Component } from '@angular/core';
import { FormsService, TrxService } from '../../services';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  templateUrl: './feedback.component.html'
})
export class FeedbackComponent {

  public modal: HTMLIonModalElement;
  
  constructor(
    private formsService: FormsService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private trx: TrxService
  ) {
    if ( formsService.feedbackForm === undefined ) {
      formsService.resetFeedbackForm();
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
          message: await this.trx.t( 'volunteer.feedback.submitSuccess' ),
          buttons: [await this.trx.t( 'misc.close' )]
        });
        alert.present();
        alert.onDidDismiss().then( () => {
          // clear the form and navigate back to the volunteer homepage
          this.modal.dismiss()
          .then( () => this.formsService.resetFeedbackForm() );
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
