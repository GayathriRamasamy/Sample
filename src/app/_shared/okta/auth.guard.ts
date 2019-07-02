import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Router, RouterStateSnapshot, Route } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc-cache';
import { AppSettings } from '../../app.settings';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

    constructor(private oAuthSvc: OAuthService, private router: Router) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!AppSettings.isOktaRequired) {
            return true;
        }
        if (this.oAuthSvc.hasValidIdToken() && this.oAuthSvc.hasValidAccessToken()) {
            return true;
        } else {
            // this.router.navigate(['/login']);
            this.oAuthSvc.initImplicitFlow();
            return false;
        }
    }

    public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!AppSettings.isOktaRequired) {
            return true;
        }
        if (this.oAuthSvc.hasValidIdToken() && this.oAuthSvc.hasValidAccessToken()) {
            return true;
        } else {
            // this.router.navigate(['/login']);
            this.oAuthSvc.initImplicitFlow();
            return false;
        }
    }
    public canLoad(route: Route): boolean {
        // if (this.authorizeService.hasAuthorization(route.path)) {
        //     return true;
        // } else {
        //     this.appBroadcastService.onUpdateAppSpinnerPrompt('');
        //     return false;
        // }
        return true;
    }
}
