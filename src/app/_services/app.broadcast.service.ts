import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class AppBroadCastService {
    public appSpinnerPrompt = new Subject<string>();
    public updateAppSpinnerPrompt = this.appSpinnerPrompt.asObservable();

    private _showHeader = new Subject<any>();
    public showHeader = this._showHeader.asObservable();
    private _currentUser = new Subject<any>();
    public subCurrentUser = this._currentUser.asObservable();

    public freeSearchText = new Subject();
    public onSearchURLChange = new Subject<any>();
    public fragranceSearchText = new Subject<any>();

    public pubShowHeader(value: any) {
        this._showHeader.next(value);
    }

    public pubCurrentUser(value: any) {
        this._currentUser.next(value);
    }

    public onUpdateSearchText() {
        this.freeSearchText.next();
    }


    public onGetFreeSearchText(): Observable<any> {
        return this.freeSearchText.asObservable();
    }

    public onUpdateAppSpinnerPrompt(value: string) {
        this.appSpinnerPrompt.next(value);
    }
    
    public onSearchUrlChange(value: any) {
        this.onSearchURLChange.next(value);
    }

}
