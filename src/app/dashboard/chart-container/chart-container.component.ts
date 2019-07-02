import { Component, OnInit } from "@angular/core";

import { keyConfig } from "src/app/_config/dashboard.config";
import { DashboardService } from "src/app/_services/+dashboard/dashboard.service";
import { ConfigService } from "src/app/_services/+dashboard/config.service";
import { DataFilterSettings } from "../../_services/+dashboard/modal-setting";
import { InformationMessage } from "../../_shared/messages/InformationMessage";
import { AppBroadCastService } from "../../_services/app.broadcast.service";
import { ErrorMessage } from "../../_shared/messages/ErrorMessage";
import { BehaviorSubject, forkJoin } from "rxjs";

@Component({
  selector: "app-chart-container",
  templateUrl: "./chart-container.component.html",
  styleUrls: ["./chart-container.component.scss"],
})
export class ChartContainerComponent implements OnInit {
  public dashboardConfig: any;
  public content: object;
  differ: any;
  //Sorted option declaration
  public sortByOptions;
  public selectedSortedOption: string;
  public selectedSortValue: string;
  public isEnableSortby: Boolean = false;

  // header content 
  public selectedSecLvlTabKey: string;
  public selectedSecLvlTabValue: string;
  public selectedFrstLvlTabKey: string;
  public toggles: Array<object>;
  public toggleArray = [];
  public header: string = '';
  public objectKeys = Object.keys;
  public objectValues = Object.values;
  public legends = [];
  public clonedObject;
  public configContent;
  public isEnableChart = false;

  private selectedHeaderFilter;
  private selectedTabObject: object = {};
  public selectedDate: string;
  //Restrict the asc ordering while using keyvalue pipe
  sortFn = (a, b) => 0;
  selectedFilters: any = {};

  public get headerFilter() {
    return this.selectedHeaderFilter;
  }

  constructor(
    private dashboardService: DashboardService,
    private configService: ConfigService, private broadCastService: AppBroadCastService
  ) {
    if(localStorage.getItem('enablePrint') == 'true') {
      this.getLegends('CATEGORY');
    } else {
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

  
  }


  ngOnInit() {
    // localStorage.setItem('mainLegend', '');
  }

  /**
  * This is the initialiseInvites function
  * After getting config re initialize the values
  * @param no-params
  * @returns void
  */
  async initialiseInvites() {
    if (this.configContent) {
      this.isEnableChart = true;
      this.dashboardService.tabDetails.subscribe((value) => {
        if (value['secLvlTabKey'] && this.configContent) {
          this.selectedTabObject = value;
          this.selectedSecLvlTabKey = value['secLvlTabKey'];
          this.selectedSecLvlTabValue = value['secLvlTabValue'];
          this.configService.getChartConfig(value);
          this.getLegends(this.selectedSortedOption);
          this.getHeader();
        }
      });
      this.dashboardConfig = this.configContent;
      if (this.dashboardConfig[keyConfig.frstLvlTab.key]) {
        this.content = this.dashboardConfig[keyConfig.frstLvlTab.key];
        this.getToggles();
        this.sortByValues();
        this.updateSubjectValues();
        this.dashboardService.updateFilterSettings.subscribe(value => {
          this.selectedFilters = value['filters'];
          this.getLegends(this.selectedSortedOption);
        });
      } else {
        this.broadCastService.onUpdateAppSpinnerPrompt(InformationMessage.Loading);
      }

    }
  }

  /**
    * To set the required subjects after getting values 
    * @param no-params
    * @returns void
    */
  public updateSubjectValues() {
    let subscribedValue: any;
    this.dashboardService.filterDetails.subscribe(value => {
      if (Object.values(value).length) {
        subscribedValue = value;
        this.selectedDate = subscribedValue['dateKey'];
        let object = {
          sortedOption: this.selectedSortedOption,
          filters: this.selectedFilters
        };
        let tempObject: DataFilterSettings = { ...subscribedValue, ...object };
        this.dashboardService.updateFilterSettings.next(tempObject);
        // this.getLegends(this.selectedSortedOption);
      }
    });

  }

  /**
  * To get the sorted option based on config file
  * @param - selected sorted option
  * @returns void
  */
  public getLegends(sortOption) {
    if(localStorage.getItem('enablePrint') == 'true') {
      this.legends = JSON.parse(localStorage.getItem('mainLegend'));
      // this.objectValues = JSON.parse(localStorage.getItem('main-legend'));
    } else {
    if (Object.keys(this.selectedTabObject).length && this.selectedDate) {
      let objToSort = {
        frstLvlTabKey: this.selectedTabObject['frstLvlTabKey'],
        secLvlTabKey: this.selectedTabObject['secLvlTabKey'],
        sortedOption: sortOption,
        dateRange: this.selectedDate,
        filters: this.selectedFilters
      };
      this.broadCastService.onUpdateAppSpinnerPrompt(InformationMessage.Loading);
      let showKey = keyConfig.legendShowKey;
        if (objToSort['frstLvlTabKey'] && objToSort['secLvlTabKey'] && objToSort['sortedOption'] && objToSort['dateRange'] && objToSort['filters']) {
          this.dashboardService
            .getLegends(objToSort)
            .subscribe((legends) => {
              this.legends = legends;
              localStorage.setItem('mainLegend', JSON.stringify(this.legends));
              let domains = [], colors = [];
              this.legends.forEach((item) => {
                if (item[showKey]) {
                  domains.push(this.objectKeys(item)[0]);
                  colors.push(this.objectValues(item)[0]);
                }
              });
              // localStorage.setItem('main-legend', JSON.stringify(this.objectValues));
              let legendObject = {
                domains: domains,
                colors: colors
              }
              this.broadCastService.onUpdateAppSpinnerPrompt('');
              this.dashboardService.legends.next(legendObject);
            }, (error) => {
              this.broadCastService.onUpdateAppSpinnerPrompt(ErrorMessage.LegendsUpdate);
            }
            );
        }
      }

    }
  }

  /**
  * To replace the header content based on config  
  * @param no-params
  * @returns void
  */
  public getHeader() {
    this.header = '';
    let configHeader = this.configContent[keyConfig.chartHeader];
    this.header = configHeader;// assign the back end response to local variable
    if (this.selectedSecLvlTabValue && this.selectedSortedOption) {
      this.header = this.header.replace(keyConfig.secLevlKey, this.selectedSecLvlTabValue); // replace the key value to selected tab value
      this.header = this.header.replace(keyConfig.sortedOptionKey, this.selectedSortValue); // replace the key value to selected sort option
    }
  }

  /**
  * Getting the sort options based on config  
  * @param no-params
  * @returns void
  */
  public sortByValues() {
    this.sortByOptions = {};
    if (this.dashboardConfig[keyConfig.sortBy.key]) {
      let options = this.dashboardConfig[keyConfig.sortBy.key];
      this.sortByOptions = options[keyConfig.sortBy.sortList];
      this.selectedSortedOption = options[keyConfig.sortBy.defaultSort];
      this.selectedSortValue = this.sortByOptions[this.selectedSortedOption];
    } else {
      // get the sort option based on second type of config structure
      if (this.content[this.selectedFrstLvlTabKey]) {
        if (this.content[this.selectedFrstLvlTabKey][keyConfig.sortBy.key]) {
          let options = this.content[this.selectedFrstLvlTabKey][keyConfig.sortBy.key];
          if (options[keyConfig.sortBy.sortList]) {
            this.sortByOptions = options[keyConfig.sortBy.sortList];
            this.selectedSortedOption = options[keyConfig.sortBy.defaultSort];
            this.selectedSortValue = this.sortByOptions[this.selectedSortedOption];
          }
        }
      }
    }
    this.isEnableSortby = Object.entries(this.sortByOptions).length ? true : false;
    if (this.sortByOptions) {
      this.dashboardService.cloneObject['sortByOptions'] = this.sortByOptions;
    }
    this.getHeader();
  }

  /**
  * Getting the toggles options based on config  
  * @param no-params
  * @returns void
  */
  public getToggles() {
    this.toggles = [];
    let sliders = this.dashboardConfig[keyConfig.toggle.key];
    Object.keys(sliders).forEach((item) => {
      let name = sliders[item][keyConfig.toggle.name];
      let reportToShow = sliders[item][keyConfig.toggle.list];
      let toggleObject = {
        toggleName: name,
        toggleValue: item,
        reportToShow: reportToShow
      };
      this.toggles.push(toggleObject);
    });
  }


  /**
  * track the toggle selection  
  * @param - toggle event and its value
  * @returns void
  */
  public getToggleChanges(event, value) {
    if (event) {
      this.toggleArray.push(value);
    } else {
      if (this.toggleArray.includes(value)) {
        let index = this.toggleArray.indexOf(value);
        this.toggleArray.splice(index, 1);
      }
    }
    this.dashboardService.toggles.next(this.toggleArray);
  }

  /**
  * Function based on selected sorted option  
  * @param - selected sorted option
  * @returns void
  */
  public toSortbyOption(option) {
    this.selectedSortedOption = option.key;
    this.selectedSortValue = option.value;
    this.updateSubjectValues();
    this.getHeader();
  }
}
