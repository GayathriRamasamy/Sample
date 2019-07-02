import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppDataService } from '../app.data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorMessage } from '../../_shared/messages/ErrorMessage';
import { DashboardService } from './dashboard.service';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    public dashboardName = new BehaviorSubject<string>('');
    public detailsConfig: Object;
    public chartConfig = new BehaviorSubject<any>({});
    public headerConfig = new BehaviorSubject<any>({});


    constructor(private http: HttpClient,
        private toastrService: ToastrService, private appData: AppDataService, private route: ActivatedRoute, private router: Router
    ) { }

    /**
      * Getting the config from either session or back end
      * @param - dashboard name
      * @returns void
      */
    public async loadDashboardConfig(name) {
        let dashboardName = name;
        if (sessionStorage.getItem(dashboardName)) {
            this.headerConfig.next(JSON.parse(sessionStorage.getItem(dashboardName)));
        } else {
            await this.getDashboardConfig(dashboardName).toPromise().then((config) => {
                sessionStorage.setItem(dashboardName, JSON.stringify(config));
                this.headerConfig.next(JSON.parse(sessionStorage.getItem(dashboardName)));
            }).catch(error => {
                this.toastrService.error(ErrorMessage.ConfigUpdate);
            });
        }

    }

    /**
     * Getting dashboard config based on dashboard name
     * @param - dashboard name
     * @returns - observable data 
     */
    public getDashboardConfig(dashboardName): Observable<any> {
     return this.http.get(this.appData.url.serviceUrl + 'config/header/' + dashboardName);
    }


    public async loadDeatilsConfig() {
        let dashboardName;
        this.dashboardName.subscribe((name) => {
            dashboardName = name;
        });
    }


    public getChartConfig(value) {
        this.fetchChartConfig(value).subscribe((chartConfig) => {
            this.chartConfig.next(chartConfig);
        });
    }

    /**
  * Getting dashboard config based on dashboard name
  * @param - dashboard name
  * @returns - observable data 
  */
    public fetchChartConfig(value): Observable<any> {
        let dashboard;
        this.dashboardName.subscribe(name => {
            dashboard = name;
        });
        return this.http.get(this.appData.url.serviceUrl + 'config/' + dashboard + '/' + value['frstLvlTabKey'] + '/' + value['secLvlTabKey']);
    }

}

