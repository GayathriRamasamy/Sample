import { AppDataService } from 'src/app/_services';
import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IColumnChart } from './column-chart-modal';

@Injectable({
  providedIn: 'root'
})

export class ColumnChartService implements IColumnChart{

  constructor(private http: HttpClient, private appData: AppDataService) { }

  url = {
    inputData: 'chart/',
    chart: 'chart',
    columnChart: '/columnChart',
    config: 'config'
  };

  /**
  * // TODO: Get bubble chart API
  * @param -  tab: String, 
              yoy: boolean,
              sortBy: string, 
              filter: string, 
              startDate: string, 
              endDate: string, 
              dropdown: string, 
              headerToggle: string, 
              dateRange: string
  * @returns - Observable
  */
  getChartData(
    firstLevelTab: string,
      innerTab: string, 
      tab: String, 
      yoy: boolean,
      sortBy: string, 
      filter: object, 
      startDate: string, 
      endDate: string, 
      dropdown: string, 
      headerToggle: string, 
      dateRange: string,
      headerFilter: object,
      permission: boolean
    ) {
    return this.appData.post(this.appData.url.serviceUrl + this.url.inputData + tab + "/columnChart" + '?dateRange=' 
    + dateRange + '&access=' + permission,
    [], {
      'scentPortfolio': firstLevelTab,
      'groupBy': innerTab,
      'YearOnYear': yoy,
      'sortBy': sortBy,
      'filter': filter,
      'startDate': startDate,
      'endDate': endDate,
      'dropdown': dropdown,
      'headerTab': headerToggle,
      'headerFilter': headerFilter
    }
   );

  }

}
