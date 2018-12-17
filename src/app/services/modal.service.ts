import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  constructor( public modalController: ModalController ) { }

  // keep a stack of active modals
  public stack: HTMLIonModalElement[] = [];

  public getActiveModal(): HTMLIonModalElement | false {
    if ( this.stack.length === 0 ) return false;
    return this.stack[ this.stack.length -1 ];
  }

  async open( component: any, props: any = {} ) {
    const modal = await this.modalController.create({
      component: component,
      componentProps: props,
      cssClass: 'modal-large'
    });

    // add to the modal stack
    this.stack.push( modal );
    // pop off the stack when it's dismissed
    modal.onDidDismiss().then( data => this.stack.pop() );

    // show the modal
    modal.present().then(
      () => modal.dispatchEvent( new Event('ionModalDidPresent') ),
      () => {}
    );
    return modal;
  }

}