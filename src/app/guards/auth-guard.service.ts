import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ModalService, MiscService } from '../services';
import { LoginComponent } from '../modals-volunteer';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private modalService: ModalService,
    private miscService: MiscService
  ) {}

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) {
    if ( this.miscService.isLoggedIn ) return true;

    // save the URL the user was trying to go to and open the login modal
    this.miscService.loginRedirectUrl = state.url;
    this.modalService.open( LoginComponent );
    return false;
  }
}