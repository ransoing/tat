import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ModalService {

constructor( public modalController: ModalController ) { }

  async open( component: any, props: any = {} ) {
    const modal = await this.modalController.create({
      component: component,
      componentProps: props
    });
    return await modal.present();
  }

}