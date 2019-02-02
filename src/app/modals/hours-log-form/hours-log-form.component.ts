import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrxService, MiscService } from '../../services';
import { AlertController } from '@ionic/angular';
import { Subscriber } from 'rxjs';

@Component({
  templateUrl: './hours-log-form.component.html'
})
export class HoursLogFormComponent implements OnInit, OnDestroy {

  public modal: HTMLIonModalElement;
  private gfSubscriber: any;//Subscriber<MessageEvent>;
  
  constructor(
    public alertController: AlertController,
    public miscService: MiscService,
    public trx: TrxService
  ) {}

  ngOnInit() {
    console.log( '@@@ oninit' );
    this.gfSubscriber = this.miscService.getFeedbackSubmitted.subscribe( async message => {
      console.log( '@@submitted' );
      // close the modal and show a success message
      this.modal.dismiss();
      const alert = await this.alertController.create({
        header: await this.trx.t( 'misc.success' ),
        message: await this.trx.t( 'volunteer.logHours.submitSuccess' ),
        buttons: [await this.trx.t( 'misc.close' )]
      });
      alert.present();
      // alert.onDidDismiss().then( () => {
        
      // });
    });
  }

  ngOnDestroy() {
    console.log( '@@@ ondestroy' );
    this.gfSubscriber.unsubscribe();
  }

}
