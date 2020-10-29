import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-red-flags-popover',
    templateUrl: './red-flags.popover.html'
})
export class RedFlagsPopover {

    public popover: HTMLIonPopoverElement;

    constructor(
        public navCtrl: NavController
    ) {}

    navigateTo( path: string ) {
        this.navCtrl.navigateRoot( path );
        this.popover.dismiss();
    }
}
