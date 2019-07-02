import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AppDataService } from "../../_services/app.data.service";
import {
  TabSettings,
  FilterSettings,
  ChartSettings,
  DataFilterSettings
} from "./modal-setting";

@Injectable({
  providedIn: "root"
})
export class DashboardService {
  public tabDetails = new BehaviorSubject<TabSettings>({
    frstLvlTabKey: "",
    secLvlTabKey: "",
    secLvlTabValue: ""
  });

  public filterDetails = new BehaviorSubject<FilterSettings>({
    dateKey: "",
    dateValue: "",
    sortedOption: "",
    startDate: "",
    endDate: ""
  });

  public chartDetail = new BehaviorSubject<ChartSettings>({
    headerToggle: "",
    dropDown: ""
  });

  public yoyToggle = new BehaviorSubject<boolean>(false);
  public toggles = new BehaviorSubject<string[]>([]);
  public activeDropdownOption = new BehaviorSubject<string>("");
  public legends = new BehaviorSubject<Object>({ domains: [], colors: [] });

  public filterObject = new BehaviorSubject<object>({});
  public selectedFilter = new BehaviorSubject<string[]>([]);

  public cloneObject: Object = {};
  public activeHeaderToggle = new BehaviorSubject<string>("");

  public checkFilterDetails = new BehaviorSubject<DataFilterSettings>(
    new DataFilterSettings()
  );
  public updateFilterSettings = new BehaviorSubject<DataFilterSettings>(
    new DataFilterSettings()
  );

  public dashboardPermission: object = {};

  constructor(private appData: AppDataService, private http: HttpClient) {}

  public setChartDetail(toggle: string, dropdown: string) {
    this.chartDetail.next({ headerToggle: toggle, dropDown: dropdown });
  }

  /**
   * To set selected tab keys
   * @param - value as type of TabSettings
   * @returns void
   */
  public onUpdateTabDetails(value: TabSettings) {
    this.tabDetails.next(value);
  }

  /**
   * To set selected filter details like date,sorted option and filter
   * @param - value as type of FilterSettings
   * @returns void
   */
  public onCheckFilterDetails(value: DataFilterSettings) {
    this.checkFilterDetails.next(value);
  }

  public getSelectedFilter(filters) {
    this.selectedFilter.next(filters);
  }
  public getFilter(filterValue: object) {
    this.filterObject.next(filterValue);
  }
  /**
   * To set selected filter details like date,sorted option and filter
   * @param - value as type of FilterSettings
   * @returns void
   */
  public onUpdateFilterDetails(value: FilterSettings) {
    this.filterDetails.next(value);
  }

  /**
   * To set year on year toggle value to the YOY subject
   * @param - YOY condition
   * @returns void
   */
  public getYoyToggle(yoyCondition: boolean) {
    this.yoyToggle.next(yoyCondition);
  }

  /**
   * To set a subject selected bubble chart dropdown option
   * @param - option
   * @returns void
   */
  public setDropdownOption(option: string) {
    this.activeDropdownOption.next(option);
  }

  /**
   * To set a subject header toggle
   * @param - toggle value
   * @returns void
   */
  public setHeaderToggle(toggle: string) {
    this.activeHeaderToggle.next(toggle);
  }

  /**
   * To get the legends data from back end
   * @param - selected sort option
   * @returns void
   */
  public getLegends(objToSort): Observable<any> {
    return this.appData.post(
      this.appData.url.serviceUrl +
        "chart/" +
        objToSort["secLvlTabKey"] +
        "/legend?dateRange=" +
        objToSort["dateRange"] +
        "&access=" +
        this.dashboardPermission["WriteFlag"],
      [],
      {
        scentPortfolio: objToSort["frstLvlTabKey"],
        sortBy: objToSort["sortedOption"],
        filter: objToSort["filters"]
      }
    );
  }

  /**
   * To get the tab data values
   * @param - url
   * @returns void
   */
  public getTabData(url: string): Observable<any> {
    return this.appData.get(
      url + "?access=" + this.dashboardPermission["WriteFlag"], ['ScentPortfolioDashboard']
    );
  }

  public putProjectsPrintDataToRedis(): Observable<any> {
    return this.appData.put(
      this.appData.url.serviceUrl + "fragrancelibrary/printdata",
      [],
      {}
    );
  }

  /**
   * To get the details config
   * @param - dashboard name
   * @returns void
   */
  public getDetailsConfig(dashboardName): Observable<any> {
    return this.http.get(
      this.appData.url.serviceUrl + "config/detail/" + dashboardName
    );
  }

  /**
   * To get the details contents
   * @param - details object
   * @returns void
   */
  public getDetailsContents(dateRange, detailsObj): Observable<any> {
    return this.appData.post(
      this.appData.url.serviceUrl +
        "chart/" +
        detailsObj["secondLevelTab"] +
        "/detail" +
        "?dateRange=" +
        detailsObj["dateRange"] +
        "&access=" +
        this.dashboardPermission["WriteFlag"],
      [],
      detailsObj
    );
  }
}
