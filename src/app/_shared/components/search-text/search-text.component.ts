import { orderBy, filter } from 'lodash';
import { Component, ChangeDetectorRef, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";
import { Subject } from "rxjs/Subject";
import { Subscription } from 'rxjs/Subscription';
import { DashboardService } from '../../../_services/+dashboard/dashboard.service';
import { AppStateService, AppBroadCastService, AppDataService } from '../../../_services';


@Component({
    selector: "search-text",
    styleUrls: ["./search-text.component.scss"],
    templateUrl: "./search-text.component.html"
})
export class SearchTextComponent implements OnInit {
    public currentUser: any;
    public selectedSearchOption: any;
    public suggestedProjects = [];
    public searchList = [
        { label: 'in All', value: 'all', url: '/all' },
        { label: 'in Fragrances', value: 'fragrances', url: '/fragrances' },
        { label: "in Projects", value: "projects", url: "/projects" },
        { label: 'in Scent Portfolios', value: 'scentportfolios', url: '/scentportfolios' }
    ];
    public searchText: any = "";
    public searchTextChanged: Subject<string> = new Subject<string>();

    private sub: Subscription;

    constructor(
        public changeRef: ChangeDetectorRef,
        private dashboardService: DashboardService,
        private appBroadcastService: AppBroadCastService,
        private appState: AppStateService,
        private appData: AppDataService,
        private router: Router,
    ) {
        // this.appBroadcastService.updateUserId.subscribe(value => {
        //     this.currentUser = value;
        // });
        this.onSelect = this.onSelect.bind(this);
        this.searchList = orderBy(this.searchList, 'label', 'asc');
    }

    public ngOnInit() {
        this.selectedSearchOption = this.searchList[0];
        this.sub = this.appBroadcastService.onSearchURLChange.subscribe((currentSearchPath: any) => {
            let temp = filter(this.searchList, (item: any) => (item.value === currentSearchPath));
            this.selectedSearchOption = temp[0];
        });
        this.updateSelectedOption();
        this.fragranceSearchWorklist();
        // this.currentUser = this.appState.get(this.appState.stateId.userInfo);
    }

    public updateSelectedOption() {
        this.searchList.map((item: any) => {
            if (window.location.pathname.search(item.value) !== -1) {
                this.selectedSearchOption = item;
            }
        });
    }

    public fragranceSearchWorklist(): void {
        this.appBroadcastService.fragranceSearchText.subscribe(value => {
            this.searchText = value;
            this.searchList.map((item: any) => {
                if (item.value === 'fragrances') {
                    this.selectedSearchOption = item;
                }
            });
        });
    }

    public clearSearch() {
        this.searchText = "";
        this.suggestedProjects = [];
        if ('/search' + this.selectedSearchOption.url === window.location.pathname) {
            this.onSearch();
        }
    }

    public onFreeTextFilterChange(filterText: string) {
        this.searchTextChanged.next(filterText);
    }

    public onSearchOptionChanged(item: any) {
        this.selectedSearchOption = item;
        if (this.searchText) {
            this.onSearch();
        }
    }

    public selectProject(event: any) {
        const item = event.item;
        event.preventDefault();
        this.searchText = item;
        this.onSearch();
    }

    public onSelect(text: Observable<string>) {
        return text
            .debounceTime(500)
            .distinctUntilChanged()
            .switchMap(term =>
                this.appData.get(this.appData.url.suggestedProjects, [
                    this.searchText
                ])
            );
    }
    public onSearch() {
        this.appBroadcastService.onUpdateAppSpinnerPrompt("Loading");
        let searchTextTemp = this.searchText;
        if (typeof this.searchText === "object") {
            searchTextTemp = this.searchText.text.split(" -")[0].trim();
        }
        this.appState.set(this.appState.stateId.FreeSearchText, searchTextTemp);
        this.appBroadcastService.onUpdateSearchText();
        window.location.href = this.appState.stateId.searchRedirectURL + this.selectedSearchOption.url;
    }



    public getColor(color: string): string {
        return color;
    }

    public formatter(x: { text: string }) {
        return x.text;
    }

    public getImage(id, hasImage) {
        if (hasImage) {
            return this.appData.getUrlWithoutToken(
                this.appData.url.ProjectImage,
                [id]
            );
        } else {
            return "";
        }
    }

    public getCSSClassForProjectStatus(item: any): any {
        if (item.ProjectLastVisit === null) {
            return "new";
        } else if (
            item.ProjectLastVisit !== null &&
            item.updatedon > item.ProjectLastVisit
        ) {
            return "updated";
        }
        return "";
    }
}
