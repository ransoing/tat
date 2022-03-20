import { Component, ViewChild } from '@angular/core';
import { PopoverController, IonTabs } from '@ionic/angular';
import { RedFlagsPopover } from './popovers/red-flags/red-flags.popover';
import { Router } from '@angular/router';
import { MiscService } from '../services';
import { environment } from '../../environments/environment';
import { AppMode } from '../models/app-mode';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  @ViewChild( 'tabs', { static: true } ) tabs: IonTabs;

  environment = environment;
  AppMode = AppMode;

  constructor(
    public popover: PopoverController,
    public router: Router,
    public miscService: MiscService
  ) {}

  showResourcesQr( $event ) {
    $event.stopImmediatePropagation();
    this.miscService.openExternalLink( environment.webAppResourcesPage );
  }

  async openRedFlagsMenu( clickEvent ) {
    const popover = await this.popover.create({
      event: clickEvent,
      component: RedFlagsPopover,
      cssClass: 'red-flags-popover'
    });
    popover.present();
  }

}
