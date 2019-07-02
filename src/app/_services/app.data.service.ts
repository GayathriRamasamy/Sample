import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OAuthService } from 'angular-oauth2-oidc-cache';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../app.settings';
import { AppStateService } from './app.state.service';
import { Md5 } from 'ts-md5/dist/md5';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class AppDataService {
    public filterPaths = {
        referencePath: 'references/',
        fragranceLibraryPath: 'fragrancelibrary/',
        workListPath: 'worklist/'
    }
    public url = {
        authPermission: AppSettings.AppUrl.api + 'authorization/authpermission',
        userByEmail: AppSettings.AppUrl.api + 'userservice?email={0}',
        userPhoto: AppSettings.AppUrl.api + 'userservice/{0}/photo',
        me: AppSettings.AppUrl.api + 'userservice/me',
        searchSubmissions: AppSettings.AppUrl.api + 'submissions',
        getProfile: AppSettings.AppUrl.api + 'profile/{0}',
        getEvaluation: AppSettings.AppUrl.api + 'eval/{0}',
        projects: AppSettings.AppUrl.api + 'project',
        ADPeoplePicker: AppSettings.AppUrl.api + 'userservice?displayname={0}',
        login: AppSettings.AppUrl.api + 'userservice/login',
        serviceUrl: AppSettings.AppUrl.dashboardApi,
        appFilterServiceUrl: AppSettings.AppUrl.api,

        PutUserPreferencesSearch: AppSettings.AppUrl.api + 'userpreferences/search',
        suggestedProjects: AppSettings.AppUrl.api + 'search/suggestions?searchtext={0}',
        ProjectImage: AppSettings.AppUrl.api + 'fragranceProjects/{0}/image',
        fragranceSearchByFilters: AppSettings.AppUrl.api + 'search/fragrances',
        projectsSearchByFilters: AppSettings.AppUrl.api + 'search/projects',
        scentportfolioSearchByFilters: AppSettings.AppUrl.api + 'search/scentportfolios',
        PortfolioAccessType: AppSettings.AppUrl.api + 'worklist/references/portfolioaccesstype',
        ScentPortfolioClassification: AppSettings.AppUrl.api + 'scentportfolio/classification',
    };
    public filterUrl = {
        categories: this.url.appFilterServiceUrl + this.filterPaths.referencePath + 'categories',
        subCategories: this.url.appFilterServiceUrl + this.filterPaths.referencePath + 'subcategories',
        philosophy: this.url.appFilterServiceUrl + this.filterPaths.workListPath + this.filterPaths.referencePath + 'philosophy',
        inspirationBrand: this.url.appFilterServiceUrl + this.filterPaths.workListPath + this.filterPaths.referencePath + 'inspirationbrand',
        inspirationBrandVariant: this.url.appFilterServiceUrl + this.filterPaths.workListPath + this.filterPaths.referencePath + 'inspriationbrandvariant',
        regions: this.url.appFilterServiceUrl + this.filterPaths.referencePath + 'regions',
        contries: this.url.appFilterServiceUrl + this.filterPaths.referencePath + 'countries?isIffManufacturing=' + 'true',
        olfactiveFamily: this.url.appFilterServiceUrl + this.filterPaths.workListPath + this.filterPaths.referencePath + 'olfactivefamily',
        olfactiveSubFamily: this.url.appFilterServiceUrl + this.filterPaths.workListPath + this.filterPaths.referencePath + 'olfactivesubfamily',
        keywords: this.url.appFilterServiceUrl + this.filterPaths.workListPath + this.filterPaths.referencePath + 'keywords',
        descriptors: this.url.appFilterServiceUrl + this.filterPaths.workListPath + this.filterPaths.referencePath + 'odordescriptors',
        creativeCenter: this.url.appFilterServiceUrl + this.filterPaths.referencePath + 'creativeCenters',
        perfumers: this.url.appFilterServiceUrl + this.filterPaths.fragranceLibraryPath + 'perfumers',
        sdm: this.url.appFilterServiceUrl + this.filterPaths.fragranceLibraryPath + 'sdms',
        endUse: this.url.appFilterServiceUrl + this.filterPaths.referencePath + 'enduses',
        projectTypes: this.url.appFilterServiceUrl + this.filterPaths.referencePath + 'productTypes',
        consumerBenefitPlatforms: this.url.appFilterServiceUrl + this.filterPaths.referencePath + 'consumerbenefitplatform',
        opportunityOwner: this.url.appFilterServiceUrl + this.filterPaths.referencePath + 'opportunityowner',
        projectOwner: this.url.appFilterServiceUrl + this.filterPaths.referencePath + 'projectowner',
        projectManager: this.url.appFilterServiceUrl + this.filterPaths.referencePath + 'projectManager',
        projectStatus: this.url.appFilterServiceUrl + this.filterPaths.referencePath + 'projectStatus',
        finalResults: this.url.appFilterServiceUrl + this.filterPaths.referencePath + 'finalResult',
        segments: this.url.appFilterServiceUrl + this.filterPaths.referencePath + 'ffcreativesegment',
    }

    constructor(private http: HttpClient, private appState: AppStateService, private oAuthSvc: OAuthService) { }

    public get(qry: string, prm: string[]): Observable<any> {
        let heads = {
            "Cache-control": 'no-cache,no-store',
            'Expires': '0',
            'Pragma': 'no-cache',
            'x-access-token': this.getToken(),
            'x-userid': this.getId()
        };
        let options = { headers: heads, withCredentials: false };
        let aQry = this.formatQuery(qry, prm);
        return this.http.get(aQry, options).catch((err) => Observable.throw(err));
    }


    public getUrlWithoutToken(qry: string, prm: any[]) {
        return this.formatQuery(qry, prm);
    }

    public getCached(qry: string, prm: string[]): Observable<any> {
        let heads = {
            'x-access-token': this.getToken(),
            'x-userid': this.getId()
        };
        let options = { headers: heads, withCredentials: true };
        let aQry = this.formatQuery(qry, prm);
        if (this.appState.get(aQry)) {
            return Observable.of(this.appState.get(aQry));
        } else {         
            return this.http.get(aQry, options)
                .map((response) => {
                    this.appState.set(aQry, response);
                    return response;
                });
        }
    }

    public getConfigCached(qry: string, prm: string[]): Observable<any> {
        let heads = {
            'x-access-token': this.getToken(),
            'x-userid': this.getId()
        };
        let options = { headers: heads, withCredentials: true };
        let aQry = this.formatQuery(qry, prm);
        if (this.appState.get(aQry)) {
            return Observable.of(this.appState.get(aQry));
        } else {
            return this.http.get(aQry)
                .map((response) => {
                    this.appState.set(aQry, response);
                    return response;
                });
        }
    }

    public post(qry: string, prm: any[], data: any) {
        let hdr = {
            'Content-Type': 'application/json',
            'x-access-token': this.getToken(),
            'x-userid': this.getId()
        };
        let options = { headers: hdr };
        let aQry = this.formatQuery(qry, prm);
        return this.http.post(aQry, data, options).catch((err) => Observable.throw(err));
    }

    public deleteData(qry: string, prm: any[]): Observable<any> {
        let heads = {
            "Cache-control": 'no-cache,no-store',
            'Expires': '0',
            'Pragma': 'no-cache',
            'x-access-token': this.getToken(),
            'x-userid': this.getId()
        };
        let options = { headers: heads, withCredentials: true };
        let aQry = this.formatQuery(qry, prm);
        return this.http.delete(aQry, options);
    }


    public put(qry: string, prm: any[], data: any) {
        let hdr = {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'x-access-token': this.getToken(),
            'x-userid': this.getId()
        };
        let options = { headers: hdr };
        let aQry = this.formatQuery(qry, prm);
        return this.http.put(aQry, data, options).catch((err) => Observable.throw(err));
    }

    public getUrl(qry: string, prm: any[]) {
        let index = qry.indexOf('?');
        qry += index === -1 ? '?token=' + this.getToken() :
            '&token=' + this.getToken();
        return this.formatQuery(qry, prm);
    }

    private formatQuery(qry: string, prm: string[]) {
        let theString = arguments[0];
        if (arguments.length !== 2) {
            return theString;
        }

        let theParams = arguments[1];
        for (let i = 0; i < theParams.length; i++) {
            if (theParams[i] !== undefined && theParams[i] !== null) {
                // tslint:disable-next-line:quotemark
                let regEx = new RegExp("\\{" + i + "\\}", "gm");
                theString = theString.replace(regEx, theParams[i]);
            }
        }
        return theString;
    }
    public getToken() {
        return AppSettings.isOktaRequired ? this.oAuthSvc.getIdToken() : 'test';
    }

    public getId() {
        return this.appState.get(this.appState.stateId.userInfo) ? this.appState.get(this.appState.stateId.userInfo).Id : 'mxj1234';
    }

}
