import { Config } from './config';
import { AuthConfig } from 'angular-oauth2-oidc-cache';
export class DevConfig extends Config {
    public okta: AuthConfig = {
        issuer: 'https://iff.okta.com',
        oidc: true,
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin + '/home',
        clientId: '0oa1foeshdeTba5ZW0h8',
        scope: 'openid profile email',
        silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
        showDebugInformation: true,
    };
    public environment = 'dev';
}
