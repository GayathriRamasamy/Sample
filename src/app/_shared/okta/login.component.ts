import { Component, OnInit } from '@angular/core';
import { AppBroadCastService, AppStateService } from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc-cache';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public isError = false;
  private returnUrl;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pubSub: AppBroadCastService,
    private oAuthSvc: OAuthService,
    private appState: AppStateService) { }

  public ngOnInit() {
    let url = this.appState.get(this.appState.stateId.RedirectUri);
    if (!url || url === '/login' || url === '/') {
      url = '/home';
    }

    if (this.appState.get(this.appState.stateId.isAccessDenied)) {
      this.router.navigateByUrl('/unauthorized');
    } else if (this.oAuthSvc.hasValidIdToken() || this.oAuthSvc.hasValidAccessToken()) {

      this.router.navigateByUrl(url);
    } else {
      this.oAuthSvc.initImplicitFlow(url);
    }
  }

}
