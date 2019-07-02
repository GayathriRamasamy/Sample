import { cloneDeep } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { AppDataService, AppStateService, AppBroadCastService } from '../../_services';
import { HomeSortFieldSettings } from '../../home/settings';

// import FragranceSearchQuery from '../fragrancesearch/fragrancesearch.query';
// import ScentPortfolioSearchQuery from '../scentportfoliosearch/scentportfoliosearch.query';
// import ProjectSearchQuery from '../projectsearch/projectssearch.query';


@Component({
    selector: 'allsearch',
    templateUrl: './allsearch.component.html',
    styleUrls: ['./allsearch.component.scss']
})
export class AllSearchComponent implements OnInit {

    public filtersTab: any;
    public selectedTab: string = '';
    public searchText: string = '';

    public key: string = 'AllSearch';
    public userSettings: any;

    public fragrances: any = {
        coll: [],
        currentPage: 1,
        numPerPage: 3,
        total: 0,
        selectedSortField: {}
    };
    public projects: any = cloneDeep(this.fragrances);
    public scentportfolios = cloneDeep(this.fragrances);
    // public scentportfoliosColl =  [];
    // public projectsColl: any = [];
    private sub: Subscription;

    constructor(
        private logger: NGXLogger,
        private appData: AppDataService,
        private appState: AppStateService,
        private appBroadcastService: AppBroadCastService
    ) {
        if (this.appState.get(this.key)) {
            this.userSettings = this.appState.get(this.key);
        } else {
            this.userSettings = {};
            this.appState.set(this.key, this.userSettings);
        }
    }

    public ngOnInit() {
        this.fragrances.selectedSortField = { field: 'updatedon', displayName: 'Most Recent', direction: 'asc' };
        if (this.userSettings && this.userSettings.selectedFragranceSortField) {
            this.fragrances.selectedSortField = this.userSettings.selectedFragranceSortField;
        }
        this.projects.selectedSortField = HomeSortFieldSettings.ProjectSearchSortFields[0];
        if (this.userSettings && this.userSettings.selectedProjectSortField) {
            this.projects.selectedSortField = this.userSettings.selectedProjectSortField;
        }
        this.scentportfolios.selectedSortField = { field: 'updatedon', displayName: 'Most Recent', direction: 'asc' };
        if (this.userSettings && this.userSettings.selectedScentPortfolioSortField) {
            this.scentportfolios.selectedSortField = this.userSettings.selectedScentPortfolioSortField;
        }

        this.initTab();
        this.sub = this.appBroadcastService.onGetFreeSearchText().subscribe(() => {
            this.searchText = this.appState.get(this.appState.stateId.FreeSearchText) ?
                this.appState.get(this.appState.stateId.FreeSearchText) : '';
                if (window.location.pathname === "/search/all") {
                    this.fragrances.currentPage = 1;
                    this.projects.currentPage = 1;
                    this.scentportfolios.currentPage = 1;
                    this.fetchResults();
                    setTimeout(() => {
                        this.appBroadcastService.onUpdateAppSpinnerPrompt("");
                    }, 3500);
                    return;
                }
        });
        this.searchText = this.appState.get(this.appState.stateId.FreeSearchText) ?
            this.appState.get(this.appState.stateId.FreeSearchText) : '';
        this.fetchResults();
    }

    public initTab() {
        this.filtersTab = [
            { field: 'ALL' },
            { field: "My Work" }
        ];
        this.selectedTab = 'ALL';
    }

    public fetchResults() {
        this.fetchFragrances();
        this.fetchProjects();
        this.fetchScentPortfolios();
    }

    public fetchFragrances() {
        let payload = this.createFragrancePayload();
        this.appData.post(this.appData.url.fragranceSearchByFilters, [], payload).subscribe((response: any) => {
            this.fragrances.coll = response.searchresults.map((item: any) => {
                if (item._source.costbooks && item._source.costbooks.length > 0) {
                    item._source.costbookcode = item._source.costbooks[0].costbookcode;
                    item._source.mnc = item._source.costbooks[0].mnc;
                }
                return item._source;
            });
            this.fragrances.total = response.total;
        });
    }

    public fetchProjects() {
        let payload = this.createProjectPayLoad();
        this.appData.post(this.appData.url.projectsSearchByFilters, [], payload).subscribe((response: any) => {
            this.projects.coll = response.searchresults.map((item) => {
                return item._source;
            });
            this.projects.total = response.total;
        });
    }

    public fetchScentPortfolios() {
        let payload = this.createScentPortfolioPayLoad();
        this.appData.post(this.appData.url.scentportfolioSearchByFilters, [], payload).subscribe((response: any) => {
            this.scentportfolios.coll = response.searchresults.map((item) => {
                return item._source;
            });
            this.scentportfolios.total = response.total;
        });
    }

    public createFragrancePayload() {
        let fragranceSearchQuery = cloneDeep();
        fragranceSearchQuery.searchtext = this.searchText;
        fragranceSearchQuery.from = this.fragrances.currentPage - 1;
        fragranceSearchQuery.sortbyfield = this.fragrances.selectedSortField.field;
        fragranceSearchQuery.sortbyorder = this.fragrances.selectedSortField.direction;
        fragranceSearchQuery.resultssize = this.fragrances.numPerPage;
        return fragranceSearchQuery;
    }

    public createProjectPayLoad() {
        let projectSearchQuery = cloneDeep();
        projectSearchQuery.searchtext = this.searchText;
        projectSearchQuery.from = this.projects.currentPage - 1;
        projectSearchQuery.sortbyfield = this.projects.selectedSortField.field;
        projectSearchQuery.sortbyorder = this.projects.selectedSortField.direction;
        projectSearchQuery.resultssize = this.projects.numPerPage;
        return projectSearchQuery;
    }

    private createScentPortfolioPayLoad(): any {
        let scentPortfolioSearchQuery = cloneDeep();
        scentPortfolioSearchQuery.searchtext = this.searchText;
        scentPortfolioSearchQuery.from = this.scentportfolios.currentPage - 1;
        scentPortfolioSearchQuery.sortbyfield = this.scentportfolios.selectedSortField.field;
        scentPortfolioSearchQuery.sortbyorder = this.scentportfolios.selectedSortField.direction;
        scentPortfolioSearchQuery.resultssize = this.scentportfolios.numPerPage;
        return scentPortfolioSearchQuery;
    }

    public onFilterTagClick(field) {
        this.selectedTab = field;
    }

    public onFragranceSortByClick(item) {
        this.fragrances.selectedSortField = item;
        this.userSettings.selectedFragranceSortField = item;
        this.appState.set(this.key, this.userSettings);
        this.fetchFragrances();
    }

    public onFragrancePaginationChanged(pageObj) {
        this.fragrances.currentPage = pageObj.curPage;
        this.fragrances.numPerPage = pageObj.numPerPage;
        this.fetchFragrances();
    }

    public onProjectSortByClick(item) {
        this.projects.selectedSortField = item;
        this.userSettings.selectedProjectSortField = item;
        this.appState.set(this.key, this.userSettings);
        this.fetchProjects();
    }

    public onProjectPaginationChanged(pageObj) {
        this.projects.currentPage = pageObj.curPage;
        this.projects.numPerPage = pageObj.numPerPage;
        this.fetchProjects();
    }

    public onScentPortfolioSortByClick(item) {
        this.scentportfolios.selectedSortField = item;
        this.userSettings.selectedScentPortfolioSortField = item;
        this.appState.set(this.key, this.userSettings);
        this.fetchScentPortfolios();
    }

    public onScentPortfolioPaginationChanged(pageObj) {
        this.scentportfolios.currentPage = pageObj.curPage;
        this.scentportfolios.numPerPage = pageObj.numPerPage;
        this.fetchScentPortfolios();
    }

}
