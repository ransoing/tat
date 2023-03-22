import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  constructor(
    public modalController: ModalController,
    private _analyticsService: AnalyticsService
  ) { }

  // keep a stack of active modals
  public stack: HTMLIonModalElement[] = [];

  public getActiveModal(): HTMLIonModalElement | false {
    if ( this.stack.length === 0 ) return false;
    return this.stack[ this.stack.length -1 ];
  }

  /**
   * Opens a modal defined by the given component and component properties.
   * @param forceScreenName If defined, alters the `static screenName` property of the given component, for analytics purposes.
   */
  async open( component: any, props: any = {}, forceScreenName?: string ) {
    const modal = await this.modalController.create({
      component: component,
      componentProps: props,
      cssClass: 'modal-large'
    });

    if ( forceScreenName != null ) {
      component.screenName = forceScreenName;
    }

    if ( component.screenName != null ) {
      // log the event
      this._analyticsService.logModalView( component.screenName )
    }

    // add to the modal stack
    this.stack.push( modal );
    // pop off the stack when it's dismissed
    modal.onDidDismiss().then( data => {
      this.stack.pop();
      // if the modal that was just shown had a screen name, log the screen name that's highest on the stack
      // (because the user is now viewing a different screen)
      if ( component.screenName != null ) {
        const lastScreenName = this.stack.map(
          stackModal => stackModal.component['screenName']
        ).filter(
          screenName => screenName != null
        ).pop();
        
        // if the modal stack doesn't have any screen names, log the name of the page under the modal stack
        if ( lastScreenName != null ) {
          this._analyticsService.logModalView( lastScreenName );
        } else {
          this._analyticsService.logPageView( this._analyticsService.currentPageName );
        }
      }
    });

    // show the modal
    modal.present().then(
      () => modal.dispatchEvent( new Event('ionModalDidPresent') ),
      () => {}
    );
    return modal;
  }

}