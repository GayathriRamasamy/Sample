import { Config } from './config';
import { AuthConfig } from 'angular-oauth2-oidc-cache';
export class BusConfig extends Config {
    public okta: AuthConfig = {
        issuer: 'https://iff.okta.com',
        oidc: true,
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin + '/home',
        clientId: '0oa1g6lt3iyj2aCos0h8',
        scope: 'openid profile email',
        silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
        showDebugInformation: true
    };
    public environment = 'beta';

}
