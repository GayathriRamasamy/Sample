import { Injectable } from '@angular/core';

// tslint:disable-next-line:interface-over-type-literal
export type InternalStateType = {
  [key: string]: any
};

@Injectable()
export class AppStateService {

  public stateId = { // State Id
    token: 'TOKEN',
    userClaims: 'USER_CLAIMS',
    userInfo: 'USER_INFO',
    isAccessDenied: 'isAccessDenied',
    RedirectUri: '/home',
    userNotFound: 'userNotFound',
    FreeSearchText: '',
    searchRedirectURL: 'https://dev1-puma.iff.com/search',
    homeURL:'https://dev1-puma.iff.com/home'

  };

  public _state: InternalStateType = {};

  public get state() {
    return this._state = this._clone(this._state);
  }

  public set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }

  public get(prop?: any) {
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : null;
  }

  public set(prop: string, value: any) {
    return this._state[prop] = value;
  }

  private _clone(object: InternalStateType) {
    return JSON.parse(JSON.stringify(object));
  }
  public getCurrentUser() {
    return this.get(this.stateId.userInfo);
  }

}
