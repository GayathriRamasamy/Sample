import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { AppDataService } from '../app.data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from 'src/app/app.settings';
import { AppStateService } from '../app.state.service';
import { DashboardService } from './dashboard.service';
import { DataFilterSettings, CategoryListSettings } from './modal-setting';
// import { } from '../../app.settings';
@Injectable({
    providedIn: 'root'
})
export class FilterService {
    public config: any;
    public filters = [];
    public filternames = new BehaviorSubject<string[]>([]);
    public presetFilters = new BehaviorSubject<string[]>([]);
    public presetSelectedFacets = new BehaviorSubject<string[]>([]);
    public categoryList = new BehaviorSubject<CategoryListSettings>(new CategoryListSettings());

    public token = " ";
    public subPath = '/references/';
    public filterSubPath = '/frangrancelibrary/';
    public filterPaths = {
        referencePath: 'references/',
        fragranceLibraryPath: 'fragrancelibrary/',
        workListPath: 'worklist/'
    }
    subjectValues: DataFilterSettings;

    public onUpdateScentPortfolioSavedDashboardSearch = new Subject<any>();
    
    constructor(
        private http: HttpClient, 
        private appData: AppDataService, 
        private route: ActivatedRoute, 
        private router: Router, 
        private dashboardService: DashboardService,
        private appState: AppStateService,
    ) {
        this.dashboardService.updateFilterSettings.subscribe(value => {
            this.subjectValues = value;
        });
    }

    public getfilterName(filter: any) {
        this.filters.push(filter);
        this.filternames.next(this.filters);
    }

    // get saved filter
    public getfilters(): Observable<any> {
        return this.appData.get(this.appData.url.appFilterServiceUrl + 'userpreferences/search' + '?picklistvalue=ScentPortfolioDashboard', []);
    }
    
    // save filter
    public putfilters(filters): Observable<any> {
        let filterString = JSON.stringify(filters.filterContent);
        let payload = {
            SearchName: filters.SearchName,
            SearchTerm: filters.SearchTerm,
            SearchFilters: filterString,
            PicklistValue: 'ScentPortfolioDashboard',
            DefaultFlag: 0
        };
        return this.appData.put(this.appData.url.PutUserPreferencesSearch, [], payload);
    }

    public getPresetFilters(presetFilter) {
        this.presetFilters.next(presetFilter);
    }

    public getPresetSelectedFacets(facets) {
        this.presetSelectedFacets.next(facets);
    }

    public fetchSearchFilter(filterId): Observable<any> {
        return this.appData.get(this.appData.url.appFilterServiceUrl + 'userpreferences/search/filters/' + filterId, []);
    }

    public deleteFilter(filterId: string) {
        return this.appData.deleteData(this.appData.url.appFilterServiceUrl + 'userpreferences/search' + '?id=' + filterId, []);
    }

    public updateFilterSubject(key) {
        let selectedFilters = this.appState.get(key);
        let obj = {
            filters: selectedFilters
        };
        let tempObj: DataFilterSettings = { ...this.subjectValues, ...obj };
        this.dashboardService.updateFilterSettings.next(tempObj);
    }

    public updateLoadFilterSubject(selectedFilters) {
        let obj = {
            filters: selectedFilters
        };
        let tempObj: DataFilterSettings = { ...this.subjectValues, ...obj };
        this.dashboardService.updateFilterSettings.next(tempObj);
    }

    public getRegion() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.referencePath + 'regions', []);
    }
    public getCountries() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.referencePath + 'countries?isIffManufacturing=' + 'true', []);
    }
    public getConsumerbenefitplatform() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.referencePath + 'consumerbenefitplatform', []);
    }
    public getCategories() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.referencePath + 'categories', []);
    }
    public getSubCategories() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.referencePath + 'subcategories', []);
    }
    public getEndUse() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.referencePath + 'enduses', []);
    }
    public getProductTypes() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.referencePath + 'productTypes', []);
    }
    public getOpportunityOwner() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.referencePath + 'opportunityowner', []);
    }
    public getPhilosophy() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.workListPath + this.filterPaths.referencePath + 'philosophy', []);
    }
    public getInspirationBrand() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.workListPath + this.filterPaths.referencePath + 'inspirationbrand', []);
    }
    public getInspirationBrandVariant() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.workListPath + this.filterPaths.referencePath + 'inspriationbrandvariant', []);
    }
    public getOlfactiveFamily() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.workListPath + this.filterPaths.referencePath + 'olfactivefamily', []);
    }
    public getOlfactiveSubFamily() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.workListPath + this.filterPaths.referencePath + 'olfactivesubfamily', []);
    }
    public getKeywords() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.workListPath + this.filterPaths.referencePath + 'keywords', []);
    }
    public getDescriptors() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.workListPath + this.filterPaths.referencePath + 'odordescriptors', []);
    }

    public getCreativeCenter() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.referencePath + 'creativeCenters', []);
    }
    public getPerfumer() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.fragranceLibraryPath + 'perfumers', []);
    }
    public getSDM() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.fragranceLibraryPath + 'sdms', []);
    }

    public getProjectOwner() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.referencePath + 'projectowner', []);
    }
    public getProjectManager() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.referencePath + 'projectManager', []);
    }
    public getProjectStatus() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.referencePath + 'projectStatus', []);
    }
    public getFinalResults() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.referencePath + 'finalResult', []);
    }
    public getSegments() {
        return this.appData.get(this.appData.url.appFilterServiceUrl + this.filterPaths.referencePath + 'ffcreativesegment', []);
    }
}
