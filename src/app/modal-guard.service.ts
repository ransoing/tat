import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import { ModalController } from '../../node_modules/@ionic/angular';

@Injectable()
export class ModalGuard implements CanActivate {
  
  constructor( public modalController: ModalController ) {}
  
  canActivate() {
    console.log('ModalGuard#canActivate called');
    console.log( this.modalController );
    return true;
  }
}
