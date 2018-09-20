import { Injectable }     from '@angular/core';
import { CanDeactivate, Router, NavigationStart, RouterEvent, ActivatedRouteSnapshot }    from '@angular/router';
import { ModalService } from './services';
import { Location } from '@angular/common';

@Injectable()
export class ModalGuard implements CanDeactivate<any> {

  private triggerIsPopstate = false;
  
  constructor( private modalService: ModalService, private router: Router, private location: Location ) {
    // listen to router events to learn when the user is navigating back
    this.router.events.subscribe( (evt: RouterEvent) => {
      if ( evt instanceof NavigationStart ) {
        this.triggerIsPopstate = (evt as NavigationStart).navigationTrigger === 'popstate';
      }
    });
  }
  
  canDeactivate( component: any, currentRoute: ActivatedRouteSnapshot ) {
    // if a modal is active and the user is trying to navigate back, prevent the navigation and instead dismiss the modal.
    let activeModal = this.modalService.getActiveModal();
    if ( this.triggerIsPopstate && activeModal ) {
      activeModal.dismiss();
      
      // due to a bug ( https://github.com/angular/angular/issues/13586 ), when the browser back button or hardware back button is used,
      // the browser history will change even when canDeactivate blocks the route. This means that the user could repeatedly open a
      // modal and use the back button to close the modal, and eventually the browser history will run out and the app will quit.
      // to offset this problem, add the current URL to the browser history
      const currentUrlTree = this.router.createUrlTree( [], currentRoute );
      const currentUrl = currentUrlTree.toString();
      this.location.go( currentUrl );
      
      return false;
    } else {
      return true;
    }
  }
}
