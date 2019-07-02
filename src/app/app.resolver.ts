import { Injectable } from '@angular/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc-cache';
import { AppBroadCastService } from './_services/app.broadcast.service';
import { AppStateService, AppDataService } from './_services';

import 'rxjs/add/operator/toPromise';
import { AppSettings } from './app.settings';

@Injectable()
export class AppResolver {

    constructor(
        private appData: AppDataService,
        private appState: AppStateService,
        private pubSub: AppBroadCastService,
        private oAuthSvc: OAuthService
    ) { }

    public configureJWT() {
        let config = AppSettings.config();
        this.oAuthSvc.configure(config.okta);
        this.oAuthSvc.tokenValidationHandler = new JwksValidationHandler();
    }
    public validateUser() {
        this.configureJWT();
        let isInvalidLogin;
        return new Promise((resolve, reject) => {
            if (!AppSettings.isOktaRequired) {
                this.updateUserInfo('Test', resolve);
            } else {
                this.oAuthSvc.loadDiscoveryDocument().then((doc) => {
                    this.oAuthSvc.tryLogin({
                        onTokenReceived: (context) => {
                            this.appState.set(this.appState.stateId.RedirectUri, context.state);
                            let claims: any = this.oAuthSvc.getIdentityClaims();
                            this.updateUserInfo(claims, resolve);
                        },
                        onLoginError: (context) => {
                            isInvalidLogin = true;
                            this.appState.set(this.appState.stateId.isAccessDenied, true);
                            resolve(true);
                        }
                    });
                    if (!this.oAuthSvc.hasValidIdToken() && !this.oAuthSvc.hasValidAccessToken()) {
                        if (!isInvalidLogin) {
                            this.oAuthSvc.initImplicitFlow(window.location.pathname);
                        }
                    } else {
                        this.oAuthSvc.setupAutomaticSilentRefresh();
                        const claims: any = this.oAuthSvc.getIdentityClaims();
                        this.updateUserInfo(claims, resolve);
                    }
                }).catch((err) => {
                    reject(err);
                });
            }

        });
    }

    // private updateUserInfo(claims: any, resolve: any) {
    //     if (claims) {
    //         this.appState.set(this.appState.stateId.token, this.oAuthSvc.getAccessToken());
    //         this.appData.post(this.appData.url.login, [], {}).subscribe((result) => {
    //             if (!result) {
    //                 this.appState.set(this.appState.stateId.userNotFound, true);
    //                 resolve(claims);
    //             } else {
    //                 this.appState.set(this.appState.stateId.userInfo, result);
    //                 resolve(claims);
    //             }

    //         });
    //     }
    // }

    private updateUserInfo(claims: any, resolve: any) {
        if (claims) {
            this.appState.set(this.appState.stateId.token, this.oAuthSvc.getAccessToken());
            // this.appData.post(this.appData.url.login, [], {}).subscribe((result) => {
            //     if (!result) {
            //         this.appState.set(this.appState.stateId.userNotFound, true);
            //         resolve(claims);
            //     } else {
            //         this.appState.set(this.appState.stateId.userInfo, result);
            //         resolve(claims);
            //     }
    
            // });

            this.appState.set(this.appState.stateId.userInfo, {"DisplayName": "Kovarthanan Murugan", "Id":"JXK9190","displayName":"Ashok Raja T","email":"ASHOK.RAJA@IFF.COM","officeLocation":"Chennai (Guindy), India","firstName":"Ashok Raja","lastName":"T","title":null,"regionName":"Greater Asia","jobFamily":"IT","locationCode":"IT"});
           resolve(claims);
        }
    }
    
}