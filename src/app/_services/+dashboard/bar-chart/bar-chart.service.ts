import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AppDataService } from '../../app.data.service';

@Injectable({
  providedIn: 'root'
})
export class BarChartService {
  
  constructor(private http: HttpClient, private appservice: AppDataService) {}

  url  = {
    chart: 'chart',
    barChart: 'barChart',
    dateRange: 'dateRange'
  };

  // Get bar chart Data
  getBarData(tab: string, param: Object, date: string, permission: boolean) {
    const url = this.getserviceURL();
    return this.appservice.post( url + this.url.chart + '/' + tab + '/' + this.url.barChart + '?' +
                                      this.url.dateRange + '=' + date + '&access=' + permission, [], param);
                                
  }

  getserviceURL() {
      return this.appservice.url.serviceUrl;
  }
}


