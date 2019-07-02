import { AuthConfig } from 'angular-oauth2-oidc-cache';
export abstract class Config {
    public okta: AuthConfig = {
        clientId: '0oa1foeshdeTba5ZW0h8',
        issuer: 'https://iff.okta.com',
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin + '/home',
        silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html'
    };
    public environment = '';

}
