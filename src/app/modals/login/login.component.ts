import { Component } from '@angular/core';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { MiscService, TrxService } from '../../services';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {

  public modal: HTMLIonModalElement;
  
  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController,
    private miscService: MiscService,
    private trx: TrxService
  ) { }

  async onLoginClick() {
    this.miscService.isLoggedIn = true;
    // @@ go to the URL which the user attempted to go to
    //this.router.navigate( )
    // navigate to the saved url, maybe via the ion navigator
    let loading = await this.loadingController.create({
      message: await this.trx.t( 'misc.pleaseWait' )
    });
    loading.present();
    setTimeout( async () => {
      loading.dismiss();

      const success = true;

      // @@ on success
      if ( success ) {
        // go to the restricted page which the user initially tried to go to before logging in
        this.navCtrl.navigateRoot( this.miscService.loginRedirectUrl )
        .then( () => this.modal.dismiss() );
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
