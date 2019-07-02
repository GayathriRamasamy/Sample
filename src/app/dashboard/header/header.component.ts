import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter } from "@angular/core";
import { NgbModalOptions, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { filter, cloneDeep, findIndex } from "lodash";
import * as XLSX from "xlsx";
import { ToastrService } from 'ngx-toastr';
import * as momentImported from 'moment';
const moment = momentImported;

import { keyConfig, imageConfig, Config } from "src/app/_config/dashboard.config";
import { ConfigService } from "src/app/_services/+dashboard/config.service";
import { DashboardService } from "src/app/_services/+dashboard/dashboard.service";
import { CustomDateComponent } from "../custom-date/custom-date.component";
import { SavedSearchesComponent } from "src/app/_shared/+search/saved-searches/saved-searches.component";
import { InformationMessage } from "../../_shared/messages/InformationMessage";
import { ErrorMessage } from "../../_shared/messages/ErrorMessage";
import { AppDataService, AppBroadCastService, AppStateService } from "../../_services";
import { FilterSettings, PortfolioModal } from "../../_services/+dashboard/modal-setting";
import { SpdFilterComponent } from '../filter/scentPortfolio-filter/spd-filter.component';
import { FilterService } from "src/app/_services/+dashboard/filter.service";
import { PresetSearchComponent } from "../../_shared/+search/preset-search/preset-search.component";
import { MatchSorterPipe } from "src/app/_shared/pipes/matchSorter.pipe";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  providers: [MatchSorterPipe]
})
export class HeaderComponent implements OnInit, OnDestroy {
  public dashboardConfig: any;
  public icons = {
    'calenderIcon': imageConfig.calenderIcon,
    'downloadIcon': imageConfig.downloadIcon
  };
  public buttons = {
    'saveBtn': Config.buttons["saveFilter"],
    'presetFilterBtn': Config.buttons["applyFilter"]
  };
  public labels = {
    'downloadLabels': Config.downloadLabel,
    'dateLabel': Config.dateLabel,
    'searchPlaceholder': Config.searchPlaceholder
  };

  // 
  enableHeight: boolean = false;

  // Date range related initialization
  public dateRanges: any;
  public selectedDateKey: string;
  public selectedDateRange: string;
  public isEnableDate: Boolean;

  // First level tab related initialization
  public firstLevelTab = [];
  public selectedFrstLvlTabKey: string;
  public content: any;
  private configKeys: any;
  public limitToMore = 0;
  public enableAll: Boolean = false;
  public allId: string;
  public allKey: string;
  public allDesc: string;
  public allContent: object;
  public selectedTab: any;

  // Second level tab related initialization  
  public secondLevelTab: object;
  public selectedSecLvlTabkey: string;
  public selectedSecLvlTabValue: string;

  // Filter related initialization  
  public isFilterDropdownOpen: Boolean = false;
  public isEnableSpdfilter: Boolean = false;
  public isEnableMdFilter: Boolean = false;
  public filterName: string;
  public showFilter: any = false;
  private searchModule = "SearchPortfolios";
  public key: string = "ScentPortfolioFiltersSearch";
  public savedSearchKey: String = "";
  public lastSearch: any = [];
  public savedSearchList: any = [];
  private tabWidth = 0;
  public customDateObject;
  public configContent;
  public selected: any = {};
  public mnc = [0, 20];
  public presetFilters = [];
  public selectedFacetCollection: any;
  public userSettings: any = {};
  public filterKey: string = 'savedSelectedFilters'
  private datePopupOptions: NgbModalOptions = {
    keyboard: false,
    windowClass: "cutomDateModal",
    backdrop: "static",
    centered: true
  };
  private filterPopupoptions: NgbModalOptions = {
    keyboard: false,
    // size: "sm",
    windowClass: "customSaveFilterModal",
    backdrop: "static",
    centered: true

  };
  headerFilters = ['Region'];

  @ViewChild('tabAll') allTabElement: ElementRef;
  @ViewChild('filterTab') filterTab: ElementRef;
  @ViewChild('list') elementView1;
  @ViewChild('tab') tab: ElementRef;

  @ViewChild(SpdFilterComponent) private filterComponent: SpdFilterComponent;
  @Output() removeFilter = new EventEmitter<any>();
  @Output() cancelFilter = new EventEmitter<any>();
  @Output() resetFilters = new EventEmitter<any>();
  //Restrict the asc ordering while using keyvalue pipe
  sortFn = (a, b) => 0;
  showFacet: boolean = false;
  detailsPageHeader: any;
  detailsPageData: any = [];
  detailsPayload: object = {};

  constructor(
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private configService: ConfigService,
    private dashboardService: DashboardService,
    private appData: AppDataService,
    private filterService: FilterService, private broadCastService: AppBroadCastService,
    private appState: AppStateService
  ) {
    this.configService.headerConfig.subscribe((config) => {
      if (Object.keys(config).length) {
        this.configContent = config;
        this.initialiseInvites();
        this.broadCastService.onUpdateAppSpinnerPrompt('');
      } else {
        this.broadCastService.onUpdateAppSpinnerPrompt(InformationMessage.Loading);
        // implementing
      }
    });
  }

  ngOnInit() {
    this.filterService.onUpdateScentPortfolioSavedDashboardSearch.subscribe(() => {
      this.onLoadPresetFilters();
    });

    this.onLoadPresetFilters();
    this.dashboardService.selectedFilter.subscribe(value => {
      this.selectedFacetCollection = value;
    });
    this.filterService.presetSelectedFacets.subscribe(value => {
      this.selectedFacetCollection = value;
    });
    this.filterService.presetFilters.subscribe(value => {
    });
  }

  public onLoadPresetFilters() {
    this.filterService.getfilters().subscribe(data => {
      this.presetFilters = data;
      this.assignLastSearch();
      this.appState.set(this.searchModule, this.presetFilters);
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
      this.dashboardConfig = this.configContent;
      if (this.dashboardConfig[keyConfig.frstLvlTab.key]) {
        this.content = this.dashboardConfig[keyConfig.frstLvlTab.key];
        this.getFirstLevelTab();
        this.enableAllTab();
        this.getSecondLvlTab();
        this.getDateRanges();
        this.enableDate(this.selectedFrstLvlTabKey);
        this.getFilter();
        this.setTabSubjects();
      } else {
        this.broadCastService.onUpdateAppSpinnerPrompt(InformationMessage.Loading);
        this.toastrService.error(ErrorMessage.ConfigUpdate);
      }

    }
  }


  /**
  * To set the required subjects after getting values 
  * @param no-params
  * @returns void
  */
  public setTabSubjects() {
    let keyObject = {
      frstLvlTabKey: this.selectedFrstLvlTabKey,
      secLvlTabKey: this.selectedSecLvlTabkey,
      secLvlTabValue: this.selectedSecLvlTabValue
    };
    this.dashboardService.onUpdateTabDetails(keyObject);
  }


  /**
   * To set the required subjects after getting values 
   * @param no-params
   * @returns void
   */
  public setFilterSubject() {
    let tempFilterObject;
    tempFilterObject = {
      dateKey: this.selectedDateKey,
      dateValue: this.selectedDateRange
    };
    if (this.customDateObject) {
      tempFilterObject = { ...this.customDateObject, ...tempFilterObject };
    }
    this.dashboardService.onUpdateFilterDetails(tempFilterObject);
  }

  /**
  * To decide which filter have to render
  * @param no-params
  * @returns void
  */
  public getFilter() {
    this.filterName = '';
    this.filterName = this.dashboardConfig[keyConfig.filter];
    if (this.filterName === Config.filters[0]) {
      this.isEnableSpdfilter = true;
      this.isEnableMdFilter = false;
    } else if (this.filterName === Config.filters[1]) {
      this.isEnableMdFilter = true;
      this.isEnableSpdfilter = false;
    } else {
      this.showFilter = false;
      this.isEnableSpdfilter = false;
      this.isEnableMdFilter = false;
    }
  }

  public onChangeFilter(coll: any) {
    this.showFacet = coll;
    this.selectedFacetCollection.forEach(item => {
      if (this.headerFilters.includes(item['GroupName'])) {
        coll.selectedFacetCollection.push(item);
      }
    })
    this.selectedFacetCollection = coll.selectedFacetCollection;
    this.dashboardService.getSelectedFilter(this.selectedFacetCollection);
    this.userSettings = {
      selected: cloneDeep(coll.selected),
      // list: cloneDeep( coll.list)		
      selectedFacetCollection: this.selectedFacetCollection
    };
    this.dashboardService.getFilter(this.userSettings);
  }


  public onRemoveSelectedFacet(event) {
    if (this.headerFilters.includes(event.GroupName)) {
      this.removeFilter.next(event);
    } else {
      this.filterComponent.onRemoveSelectedFacet(event);
    }
    // if (this.showFilter) {
    //   this.filterComponent.onRemoveSelectedFacet(event);
    // } else {
    //   let removedItem = event;
    //   let tempFacetCollection = cloneDeep(this.selectedFacetCollection);
    //   let removedItemGroupName = event['GroupName'];
    //   tempFacetCollection.forEach(item => {
    //     if (item['GroupName'] === removedItemGroupName) {
    //       if (item['DisplayName'] === removedItem['DisplayName']) {
    //         tempFacetCollection.splice(findIndex(tempFacetCollection, item), 1);
    //       }
    //     }
    //   });
    //   this.selectedFacetCollection = tempFacetCollection;
    //   this.filterComponent.onChangeCategory(this.selectedFacetCollection);
    // }
  }
  /**
  * Getting date ranges from config 
  * @param no-params
  * @returns void
  */
  public getDateRanges() {
    if (this.dashboardConfig[keyConfig.dateRanges.key]) {
      let dateRangeObj = this.dashboardConfig[keyConfig.dateRanges.key];
      this.dateRanges = dateRangeObj[keyConfig.dateRanges.listDates];
      this.selectedDateKey = dateRangeObj[keyConfig.dateRanges.defaultDate];
      this.selectedDateRange = this.dateRanges[this.selectedDateKey];
      this.isEnableDate = Object.entries(this.dateRanges).length ? true : false;
    }
    if (this.dateRanges) {
      this.dashboardService.cloneObject['dateRanges'] = this.dateRanges;
    }
    this.customDateObject = {
      startDate: '',
      endDate: ''
    };
    this.setFilterSubject();
  }

  /**
  * After getting config re initialize the values
  * @param - selected tab value
  * @returns void
  */
  public enableDate(selectedTab) {
    this.isEnableDate = true;
  }

  /**
  * Getting first level tab values based on config 
  * @param no-params
  * @returns void
  */
  public async getFirstLevelTab() {
    this.broadCastService.onUpdateAppSpinnerPrompt(InformationMessage.Loading);
    this.firstLevelTab = [];
    if (this.content[keyConfig.frstLvlTab.url]) {
      let url: string = this.content[keyConfig.frstLvlTab.url];
      let tabDataUrl: string = this.appData.url.serviceUrl + url + '';
      this.configKeys = this.content[keyConfig.frstLvlTab.keys];
      let valueKey, descKey, imageKey;
      //Restructure the first level tab object values 
      if (this.configKeys[0]) {
        valueKey = this.configKeys[0];
      }
      if (this.configKeys[1]) {
        descKey = this.configKeys[1];
      }
      if (this.configKeys[2]) {
        imageKey = this.configKeys[2];
      }
      let tabValues: any;
      let value, image, desc, tabObject;
      // Wait for data to decide how many number of first level tabs have to be displayed 
      await this.dashboardService.getTabData(tabDataUrl).toPromise().then((tabData: PortfolioModal) => {
        tabValues = tabData;
        let dataLength = tabValues.length;
        for (let i = 0; i < dataLength; i++) {
          value = tabValues[i][valueKey];
          image = tabValues[i][imageKey];
          desc = tabValues[i][descKey];
          tabObject = {
            value: value,
            image: '../../../assets/img/Category-Image/' + image.toLowerCase() + '.png',
            desc: desc
          };
          this.firstLevelTab.push(tabObject);
        }
      }).catch((error) => {
        this.toastrService.error(ErrorMessage.PortfolioUpdate);
      });

    } else {
      // Getting the first level tab values based on second type of config struture 
      this.configKeys = Object.keys(this.content);
      if (this.configKeys) {
        let value;
        let tabObject;
        for (let i = 0; i < this.configKeys.length; i++) {
          value = this.content[this.configKeys[i]][keyConfig.frstLvlTab.name];
          tabObject = {
            value: value,
            key: this.configKeys[i]
          };
          this.firstLevelTab.push(tabObject);
          this.selectedTab = this.firstLevelTab[0].value;
          this.selectedFrstLvlTabKey = this.firstLevelTab[0].key;
        }
      }
    }


    // After getting tab values , to decide the number of tabs have to be displayed
    if (this.firstLevelTab.length > 0) {
      let tabWidth = this.tab.nativeElement.clientWidth;
      let filterTabWidth = this.filterTab.nativeElement.clientWidth;
      if (filterTabWidth) {
        tabWidth = tabWidth - filterTabWidth;
      }
      let allTabWidth;
      if (this.enableAll) {
        allTabWidth = this.allTabElement.nativeElement.clientWidth;
        tabWidth = tabWidth - allTabWidth;
      }
      let moreTabWidth = Config['moreTabWidth'];
      tabWidth = tabWidth - moreTabWidth;
      this.limitToMore = Math.floor(tabWidth / Config['defaultTabWidth']);
      this.broadCastService.onUpdateAppSpinnerPrompt('');
    }
  }

  /**
  * Getting second level tab values based on config 
  * @param no-params
  * @returns void
  */
  public getSecondLvlTab() {
    this.secondLevelTab = {};
    if (this.dashboardConfig[keyConfig.secLvlTab.key]) {
      this.secondLevelTab = this.dashboardConfig[keyConfig.secLvlTab.key];
    } else {
      // Getting the second level tab values based on second type of config struture 
      if (this.content[this.selectedFrstLvlTabKey]) {
        let tabKey = this.content[this.selectedFrstLvlTabKey];
        if (tabKey[keyConfig.secLvlTab.key]) {
          this.secondLevelTab = tabKey[keyConfig.secLvlTab.key];
        }
      }
    }
    this.selectedSecLvlTabkey = Object.keys(this.secondLevelTab)[3];
    this.selectedSecLvlTabValue = this.secondLevelTab[this.selectedSecLvlTabkey];
    if (this.secondLevelTab) {
      this.dashboardService.cloneObject['secLvlTab'] = this.secondLevelTab;
    }
  }


  /**
  * Decide whether the All tab is enable or not based on config 
  * @param no-params
  * @returns void
  */
  public enableAllTab() {
    if (this.content[keyConfig.frstLvlTab.isAll]) {
      this.allContent = this.content[keyConfig.frstLvlTab.isAll];
      this.enableAll = true;
      this.allId = this.allContent[keyConfig.frstLvlTab.all.name];
      this.allKey = keyConfig['frstLvlTab']['isAll'];
      this.allDesc = this.allContent[keyConfig.frstLvlTab.all.desc];
      this.selectedTab = this.allKey;
      this.selectedFrstLvlTabKey = this.allKey;
    } else {
      this.allContent = {};
      this.enableAll = false;
      this.allId = "";
      this.allDesc = "";
    }
  }

  /**
  * Pick up the date range value, if it is custom , pop up the modal
  * @param - selected date range value
  * @returns void
  */
  public pickDateRange(dateRange) {

    let customRange = this.dashboardConfig[keyConfig.dateRanges.key][keyConfig.dateRanges.listDates][keyConfig.dateRanges.customRange];
    if (dateRange.value === customRange) {
      let modelRef: NgbModalRef = this.modalService.open(
        CustomDateComponent,
        this.datePopupOptions
      );
      modelRef.componentInstance.customDateRange = this.customDateObject;
      modelRef.result.then((value) => {
        this.customDateObject = value ? value : '';
        if (this.customDateObject) {
          this.selectedDateKey = dateRange.key;
          this.selectedDateRange = moment(this.customDateObject['startDate']).format(Config.DATE_FORMAT) + ' ' + 'to' + ' ' + moment(this.customDateObject['endDate']).format(Config.DATE_FORMAT);
          this.setFilterSubject();
        }

      });
    } else {
      this.customDateObject = {
        startDate: '',
        endDate: ''
      }
      this.selectedDateRange = dateRange.value;
      this.selectedDateKey = dateRange.key;
      this.setFilterSubject();
    }
  }

  /**
  * Select the second level tab and setting value to the subjects
  * @param - selected tab data
  * @returns void
  */
  public navigateSecLvlTab(tabData) {
    this.selectedSecLvlTabValue = tabData.value;
    this.selectedSecLvlTabkey = tabData.key;
    this.setTabSubjects();
  }


  /**
  * Select the first level tab and setting value to the subjects based on the config structure
  * @param - selected tab data
  * @returns void
  */
  public navigateTab(tabData) {
    // setting value based on first type of config stucture
    if (tabData["key"]) {
      this.selectedFrstLvlTabKey = tabData.key;
      this.selectedTab = tabData.value;
      this.getSecondLvlTab();
    } else if (tabData["value"]) {
      // setting value based on second type of config stucture
      this.selectedFrstLvlTabKey = tabData.value;
      this.selectedTab = tabData.value;
    } else {
      this.selectedTab = tabData;
      this.selectedFrstLvlTabKey = tabData;
    }
    this.setTabSubjects();
    this.enableDate(this.selectedFrstLvlTabKey);
  }

  getSavedFilters() {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  // To be implemented
  public onPrintList() {
    localStorage.setItem('enablePrint', 'true');
    localStorage.setItem('enableDetail', 'false');
    let popup = window.open(
      "scentPortfolioDashboard/print",
      "_blank",
      "width=" +
      screen.width +
      ",height=" +
      screen.height +
      ",scrollbars=yes,fullscreen=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no"
    );
    popup.moveTo(0, 0);
  }

  // To be implemented
  public exportExcel() {
    let regX = /(<([^>]+)>)/ig;

    let dashboardName;
    this.configService.dashboardName.subscribe((name) => {
      dashboardName = name;
    });

    let configHeader: any;

    this.dashboardService.getDetailsConfig(dashboardName).subscribe((config) => {
      configHeader = config;
      this.detailsPageHeader = config['all']['staticHeader'];
      this.detailsPageHeader = JSON.stringify(this.detailsPageHeader);
      this.detailsPageHeader = JSON.parse(this.detailsPageHeader.replace(regX, ""));
    });

    this.dashboardService.tabDetails.subscribe(tabdetail => {
      if (tabdetail) {
        this.detailsPayload['scentPortfolio'] = tabdetail.frstLvlTabKey;
        this.detailsPayload['secondLevelTab'] = tabdetail.secLvlTabKey;
      }
    });

    this.dashboardService.updateFilterSettings.subscribe(filterDetail => {
      if (filterDetail) {
        this.detailsPayload['filter'] = filterDetail.filters;
        this.detailsPayload['dateRange'] = filterDetail.dateKey;
        this.detailsPayload['sortBy'] = filterDetail.sortedOption
        this.detailsPayload['startDate'] = filterDetail.startDate;
        this.detailsPayload['endDate'] = filterDetail.endDate;
      }
    });

    this.dashboardService.chartDetail.subscribe(chartDetail => {
      if (chartDetail) {
        this.detailsPayload['headerTab'] = chartDetail.headerToggle;
        this.detailsPayload['dropdown'] = chartDetail.dropDown;
      }
    });

    this.dashboardService.getDetailsContents(this.detailsPayload['dateRange'], this.detailsPayload).subscribe((contents) => {
      if (contents) {
        let dynamicContentKeys = configHeader['all']['dynamicContent'];
        let staticContentsKeys = configHeader['all']['staticContent'];
        let staticContents = [];
        let dynamicKeys = [];
        let dynamicContentTemplate;
        staticContents = contents;
        if (dynamicContentKeys) {
          dynamicContentTemplate = dynamicContentKeys[this.detailsPayload['secondLevelTab']];
          dynamicKeys = dynamicContentTemplate.match(/@\w*@/ig);
        }
        for (let i = 0; i < staticContents.length; i++) {
          let contentArray = [];
          for (let j = 0; j < staticContentsKeys.length; j++) {
            let staticContentTemplate = staticContentsKeys[j];
            let keys = staticContentTemplate.match(/@\w*@/ig);

            for (let k = 0; k < keys.length; k++) {
              let key = keys[k].substring(1, keys[k].length - 1);
              staticContentTemplate = staticContentTemplate.replace(keys[k], staticContents[i][key]);
            }
            contentArray.push(staticContentTemplate);
          }

          if (dynamicKeys) {
            for (let m = 0; m < dynamicKeys.length; m++) {
              let key = dynamicKeys[m].substring(1, dynamicKeys[m].length - 1);
              dynamicContentTemplate = dynamicContentTemplate.replace(dynamicKeys[m], staticContents[i][`${key}`]);

            }
            contentArray.push(dynamicContentTemplate);
          }
          this.detailsPageData.push(contentArray);
        }

        let excelHeader: any;
        excelHeader = this.detailsPageHeader;
        let excelBody: any;
        excelBody = this.detailsPageData;
        excelBody = JSON.stringify(excelBody);
        excelBody = JSON.parse(excelBody.replace(regX, ""));

        let json = [];
        for (var i = 0; i < excelBody.length; i++) {
          let tempArray = {};
          for (var j = 0; j < excelHeader.length; j++) {
            tempArray[excelHeader[j]] = excelBody[i][j]
          }
          json.push(tempArray);
        }

        this.exportToExcel(json, "IPC detail");
      }
    });
  }

  public exportToExcel(json: any, sheetName: string) {
    const EXCEL_EXTENSION = ".xlsx";
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: {
        ScentPortfolio: worksheet
      },
      SheetNames: ["ScentPortfolio"]
    };
    XLSX.writeFile(workbook, sheetName + EXCEL_EXTENSION, {
      bookSST: true
    });
  }

  public onSavedSearchClick() {
    let modelRef: NgbModalRef;
    modelRef = this.modalService.open(
      SavedSearchesComponent,
      this.filterPopupoptions
    );
    modelRef.componentInstance.seletedFacetCollection = this.selectedFacetCollection;
    modelRef.componentInstance.selected = this.userSettings;
  }

  public onSavedPresetSearch(item) {
    let modelRef: NgbModalRef;
    modelRef = this.modalService.open(
      PresetSearchComponent,
      this.filterPopupoptions
    );
    modelRef.componentInstance.inputSelectedSearch = item;
    modelRef.componentInstance.savedSearchList = this.presetFilters;
  }

  public moveTabs(tabData, index) {
    let temp = this.firstLevelTab[this.limitToMore - 1];
    this.firstLevelTab[this.limitToMore - 1] = tabData;
    this.firstLevelTab[this.limitToMore + index] = temp;
  }

  public assignLastSearch() {
    if (this.presetFilters && this.presetFilters.length > 0) {
      let lastSearchIndex = findIndex(this.presetFilters, item => {
        return item.SearchName === "Last Search";
      });
      if (lastSearchIndex !== -1) {
        this.lastSearch = filter(cloneDeep(this.presetFilters), item => {
          return item.SearchName === "Last Search";
        });
        this.presetFilters.splice(lastSearchIndex, 1);
      }
    }
  }
  public filterSearchNames(evt) {
    let filteredElems: Array<any> = [];
    if (evt.target.value.toString() !== '') {
      this.presetFilters.filter(function (el: any) {
        // tslint:disable-next-line:forin
        for (let prop in el.SearchName) {
          if (el.SearchName.slice(0, prop + 1).toString().toLowerCase().indexOf(evt.target.value.toString().toLowerCase()) >= 0) {
            filteredElems.push(el);
            break;
          }
        }
      });
      // this.presetFilters = [];
      // this.presetFilters = filteredElems;
    }
  }
  public onCancelFilters(selectdOptions) {
    this.showFilter = false;
    this.cancelFilter.next(selectdOptions);
  }
  public onResetFiters(){
    this.resetFilters.next();
  }
  public onApplyFilters(selectedOptions) {
    let subjectValues = this.appState.get(this.filterKey);
    this.showFilter = false;
    this.selected = selectedOptions.selected;
    // this.logger.log(this.selected);
    // this.currentPage = 1;
    this.userSettings.selectedFilterOptions = selectedOptions;
    this.userSettings.subjectValues = subjectValues;
    this.appState.set(this.key, this.userSettings);
    // this.fetchResults();
  }
  /**
  * Destroy the subscription values
  * @param no-params
  * @returns void
  */
  ngOnDestroy() {

  }
}
