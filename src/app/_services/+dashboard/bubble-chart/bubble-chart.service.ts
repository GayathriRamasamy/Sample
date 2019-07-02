import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppDataService } from "../../app.data.service";
import { IBubbleChart } from './bubble-chart-modal';

@Injectable({
  providedIn: 'root'
})

export class BubbleChartService implements IBubbleChart {

  constructor(private http: HttpClient, private appData: AppDataService) { }

  // API url 
  url = {
    chart: 'chart',
    bubbleChart: '/bubbleChart'
  };

  /**
  * // TODO: Get bubble chart API
  * @param -firstLevelTab: string, 
            secondLevelTab: string,
            dateRange: string, 
            type: string, 
            tabToggle: string[], 
            yoyCondition: boolean,
            headerToggle: string, 
            dropDownOption: string, 
            filter: any[]
  * @returns  Observable
  */
  getBubbleChartData(
      firstLevelTab: string, 
      secondLevelTab: string,
      dateRange: string, 
      type: string, 
      tabToggle: string[], 
      yoyCondition: boolean,
      headerToggle: string, 
      dropDownOption: string,
      headerFilter: object,
      startDate: string,
      endDate: string,
      filter: object,
      permission: boolean
    ) {
     return this.appData.post(this.appData.url.serviceUrl + this.url.chart + '/'
      + secondLevelTab + this.url.bubbleChart + '?dateRange=' + dateRange
      + '&access='+ permission,
        [], {
        'scentPortfolio': firstLevelTab,
        'YearOnYear': yoyCondition,
        'sortBy': type,
        'dropdown': dropDownOption,
        'headerTab': headerToggle,
        'headerFilter': headerFilter,
        'startDate': startDate,
        'endDate': endDate,
        'filter': filter
      }, 
    );
  }
}
