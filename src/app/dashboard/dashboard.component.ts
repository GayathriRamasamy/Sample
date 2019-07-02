import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { filter, map, cloneDeep, orderBy } from 'lodash';
import { keyConfig, imageConfig, HeaderDropdown } from "../_config/dashboard.config";
import { ConfigService } from "../_services/+dashboard/config.service";
import { HeaderFilter, DataFilterSettings } from "./../_services/+dashboard/modal-setting";
import { Subscription, BehaviorSubject, forkJoin } from "rxjs";
import { InformationMessage } from "../_shared/messages/InformationMessage";
import { AppBroadCastService, AppStateService, AppDataService } from "../_services";
import { DashboardService } from "../_services/+dashboard/dashboard.service";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { AppPermissionService } from "src/app/_services/authpermission.service";
import { FilterService } from "../_services/+dashboard/filter.service";
import { SpdFilterComponent } from "./filter/scentPortfolio-filter/spd-filter.component";
import { thresholdFreedmanDiaconis } from "d3";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  providers: [AppPermissionService]
})

export class DashboardComponent implements OnInit, OnDestroy {
  public dashboardName: string;
  leftArrow = imageConfig.leftArrow;
  // Spinner 
  public showAppSpinner = false;
  public appSpinnerMsg = '';
  spinnerSub: Subscription;
  public configContent;
  public headerDropdown: object;
  public headerFilterObj: HeaderFilter;
  public scentPortfolioPermission: any = {};
  public managementPermission: any = {};
  headerDropdownValues: any = {};
  // subscribedValue: object = {};
  selectedFilters: any = {};
  public filterKey: string = 'savedSelectedFilters';
  public categoryKey = 'CATEGORY';
  currentTopHeaderRegion: any = 'All Regions';
  currentTopHeaderAccount: any = 'All Accounts';
  @ViewChild(SpdFilterComponent) private filterComponent: SpdFilterComponent;
  initialCategory: any;
  selectedCategoies: any = ['All Categories'];
  allRegionObject = {
    Code: "All Regions",
    Description: "All",
    SortOrder: 0
  };
  alreadySelectedFacets: any[];
  headerFilters = ['Region'];

  constructor(
    private configService: ConfigService,
    private broadCastService: AppBroadCastService,
    private titleService: Title,
    private dashboardService: DashboardService,
    private router: Router,
    private route: ActivatedRoute,
    private appPermissionService: AppPermissionService,
    private appState: AppStateService,
    private appData: AppDataService,
    private filterService: FilterService
  ) {

    this.managementPermission = this.appPermissionService.getDashboardPermission('ManagementDashsboardAll');
    if (this.managementPermission === undefined) {
      this.managementPermission = { WriteFlag: false };
    } else {
      this.managementPermission = { WriteFlag: true };
    }

    this.scentPortfolioPermission = this.appPermissionService.getDashboardPermission('ScentPortfolioAll');
    console.log('ScentPortfolioAll => ', this.scentPortfolioPermission);
    if (this.scentPortfolioPermission === undefined) {
      this.scentPortfolioPermission = { WriteFlag: false };
    } else {
      this.scentPortfolioPermission = { WriteFlag: true };
    }

    this.spinnerSub = this.broadCastService.appSpinnerPrompt.subscribe(
      (value) => {
        this.appSpinnerMsg = value;
        this.showAppSpinner = value.length > 0;
      });

    this.configService.headerConfig.subscribe((config) => {
      if (Object.keys(config).length) {
        this.configContent = config;
        this.initialiseInvites();
        this.broadCastService.onUpdateAppSpinnerPrompt('');
      } else {
        this.broadCastService.onUpdateAppSpinnerPrompt(InformationMessage.Loading);
      }
    });

    this.router.events.subscribe((value) => {
      if (value instanceof NavigationEnd) {
        let id = this.route.snapshot.paramMap.get('dashboardName');
        if (id) {
          this.configService.dashboardName.next(id);
          this.configService.loadDashboardConfig(id);
          // debugger;
        }
      }
    });

    this.configService.dashboardName.subscribe(dashboardName => {
      if (dashboardName.length > 0) {
        if (dashboardName === 'scentPortfolioDashboard') {
          console.log('Dashboard => ', this.scentPortfolioPermission);
          this.dashboardService.dashboardPermission = this.scentPortfolioPermission;
        } else if (dashboardName === 'managementDashboard') {
          this.dashboardService.dashboardPermission = this.managementPermission;
        }
      }
    });
    // let promiseArray = [
    //   this.appData.getCached(this.appData.filterUrl.categories, [])
    // ]
    // forkJoin(promiseArray).subscribe((results: any) => {
    //   this.headerDropdownValues.categories = this.addFieldsForSelectedFact(results[0], 'Category', 'Description');
    // })

    this.filterService.categoryList.subscribe(value => {
      // this.headerDropdownValues.categories = cloneDeep(value.initialCategoryList);
      this.initialCategory = cloneDeep(value.initialCategoryList);
      if (Object.keys(value)) {
        if (value.selectedCategoryList) {
          if (Object.values(value.selectedCategoryList).length) {
            this.updateFilterByCategory(cloneDeep(value.selectedCategoryList));
          }
        }
      }
    });
    this.dashboardService.updateFilterSettings.subscribe(values => {
      this.selectedFilters = values.filters;
    });
    this.dashboardService.selectedFilter.subscribe(value => {
      this.alreadySelectedFacets = value;
    });
  }

  /**
  * This is the initialiseInvites function
  * After getting config re initialize the values
  * @param no-params
  * @returns void
  */
  async initialiseInvites() {
    if (this.configContent) {
      this.dashboardName = this.configContent[
        keyConfig.dashboardName
      ];
      this.titleService.setTitle(this.dashboardName);
      if (HeaderDropdown) {
        this.headerDropdown = HeaderDropdown;
        this.headerFilterObj = {
          region: Object.keys(this.headerDropdown['Region'])[0].split(" "),
          category: Object.keys(this.headerDropdown['Category'])[0].split(' '),
          account: Object.keys(this.headerDropdown['Account'])[0].split(" ")
        }
      }
    }
    let promiseArray = [
      this.appData.getCached(this.appData.filterUrl.categories, []),
      this.appData.getCached(this.appData.filterUrl.regions, []),
    ]
    forkJoin(promiseArray).subscribe((results: any) => {
      this.headerDropdownValues.categories = results[0];
      let regions = results[1];
      regions.unshift(this.allRegionObject);
      regions = this.addFieldsForSelectedFact(orderBy(regions,
        "Region", 'asc'), 'Region', 'Code');
      this.headerDropdownValues.regions = cloneDeep(regions);
    });
  }

  ngOnInit() {
    localStorage.setItem("enablePrint", "false");
    localStorage.setItem('enableDetail', "false");
  }
  private addFieldsForSelectedFact(coll: any, groupName: string, displayFieldName: any, showGroupName: boolean = false) {
    if (coll) {
      coll.map((item: any) => {
        item.isChecked = false;
        item.GroupName = groupName;
        item.DisplayName = item[displayFieldName];
        item.showGroupName = showGroupName;
        return item;
      });
    }
    return coll;
  }
  public cancelFilters(event) {
    this.updateFilterByCategory(event.category);
  }
  public updateFilterByRegion(region) {
    this.currentTopHeaderRegion = region.Code;
    let tempArray = [];
    let key = 'REGION';
    if (this.alreadySelectedFacets.length) {
      this.alreadySelectedFacets.forEach((item, i) => {
        if (this.headerFilters.includes(item['GroupName'])) {
          this.alreadySelectedFacets.splice(i, 1)
        }
      });
      if (region.Description === 'All') {
        if (this.selectedFilters[key]) {
          delete this.selectedFilters[key];
        }
      } else {
        tempArray.push(key + region.Code);
        this.selectedFilters[key] = tempArray;
        this.alreadySelectedFacets.push(region);
      }
    } else {
      if (region.Description === 'All') {
        if (this.selectedFilters[key]) {
          delete this.selectedFilters[key];
        }
      } else {
        tempArray.push(key + region.Code);
        this.selectedFilters[key] = tempArray;
        this.alreadySelectedFacets.push(region);
      }

    }
    this.dashboardService.getSelectedFilter(this.alreadySelectedFacets);
    this.appState.set(this.filterKey, this.selectedFilters);
    this.filterService.updateFilterSubject(this.filterKey);
  }

  public onRemoveFilter(event) {
    delete this.selectedFilters['REGION'];
    this.alreadySelectedFacets.forEach((item, i) => {
      if (this.headerFilters.includes(item['GroupName'])) {
        this.alreadySelectedFacets.splice(i, 1)
      }
    })
    this.dashboardService.getSelectedFilter(this.alreadySelectedFacets);
    this.appState.set(this.filterKey, this.selectedFilters);
    this.filterService.updateFilterSubject(this.filterKey);
  }


  public updatedCategory(category) {
    this.filterService.categoryList.next({
      initialCategoryList: this.initialCategory,
      selectedCategoryList: category
    });
  }

  public resetFilters() {
    this.updateFilterByCategory(this.initialCategory)
  }

  public updateFilterByCategory(category) {
    this.headerDropdownValues.categories = category;
    let selectedCategoryArray = this.manageCheckBoxFacets(category);
    let tempArray = [];
    if (selectedCategoryArray) {
      selectedCategoryArray.forEach(item => {
        if (item['Description']) {
          tempArray.push(item['Description']);
        }
      });
    }
    this.selectedCategoies = tempArray;
  }

  public updateFilterByAccount(account) {
    this.currentTopHeaderAccount = account;
    if (this.headerFilterObj['account'].length > 0) {
      this.headerFilterObj['account'] = [];
      this.headerFilterObj['account'].push(account);
    }
  }
  private manageCheckBoxFacets(coll) {
    return filter(coll, (e: any) => e.isChecked === true);
  }
  /**
  * Destroy the subscription values
  * @param no-params
  * @returns void
  */
  ngOnDestroy() {
    this.spinnerSub.unsubscribe();
  }
}
