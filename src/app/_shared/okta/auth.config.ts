import { AuthConfig } from 'angular-oauth2-oidc-cache';
import { environment } from '../../../environments/environment';

export const authConfig: AuthConfig = {
    issuer: environment.authIssuer,
    oidc: true,
    requireHttps: false,
    redirectUri: environment.authRedirectUri,
    postLogoutRedirectUri: environment.authPostLogoutRedirectUri,
    clientId: environment.authClientId,
    scope: 'openid profile email',
    silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
    showDebugInformation: false
}