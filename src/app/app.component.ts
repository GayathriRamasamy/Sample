import { Component, OnInit } from '@angular/core';
import { AppStateService, AppDataService, AppBroadCastService } from './_services';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from "@angular/router";
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ConfigService } from './_services/+dashboard/config.service';
import { Config, imageConfig } from './_config/dashboard.config';
import { DashboardService } from './_services/+dashboard/dashboard.service';
import { InformationMessage } from './_shared/messages/InformationMessage';
import { AppPermissionService } from 'src/app/_services/authpermission.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppPermissionService]
})
export class AppComponent implements OnInit {
  public title = 'app';
  public userPhotoUrl;
  public defaultPhoto = './assets/img/default_user.jpg';
  public currentUser;
  public param;
  public dashboardNames = Config.dashboardName;
  public appLogo = imageConfig['appLogo'];
  public OfficeLocation = ''; 
  public managementDashPermission: any = {};
  public scentportfolioDashPermission: any = {};
  public userInfo = this.appData.url.me;
  public isMenuOpen = false;
  public LinksMenu: boolean = false;
  isPrintLayout: boolean = false;
  
  constructor(
    private appData: AppDataService,
    private appState: AppStateService, 
    private router: Router, 
    private appDataService: AppDataService, 
    private appPermissionService: AppPermissionService,
    private broadCastService: AppBroadCastService
    ) {

    this.managementDashPermission = this.appPermissionService.getPermission('ManagementDashboard');
    if (this.managementDashPermission === undefined) {
      this.managementDashPermission = { WriteFlag: false };
    }

    this.scentportfolioDashPermission = this.appPermissionService.getPermission('ScentPortfolioDashboard');
    console.log('ScentPortfolioDashboard Permission => ', this.scentportfolioDashPermission);
    if (this.scentportfolioDashPermission === undefined) {
      this.scentportfolioDashPermission = { WriteFlag: false };
    }

    this.currentUser = this.appState.get(this.appState.stateId.userInfo);
    this.appData.get(this.userInfo, []).subscribe((res) => {
        this.OfficeLocation = res.OfficeLocation;
    });
  }
  public ngOnInit() {
    if (this.appState.get(this.appState.stateId.isAccessDenied)) {
      this.router.navigate(["/unauthorized"]);
      return;
    } else if (this.appState.get(this.appState.stateId.userNotFound)) {
      this.router.navigate(['/usernotfound']);
      return;
    }
    this.currentUser = this.appState.get(this.appState.stateId.userInfo);
    this.userPhotoUrl = this.appDataService.getUrlWithoutToken(
      this.appDataService.url.userPhoto,
      [this.currentUser.id]
    );

    let menu = this;
    document.addEventListener("click", function (event) {
        if (event.target === document.querySelector("#sidebarshow"))
            menu.isMenuOpen = false;
    });

    if(localStorage.getItem('enablePrint') === 'true') {
      this.isPrintLayout = true;
    } else {
      this.isPrintLayout = false;
    }
  }

  // NAVIGATE DASHBOARD
  public navigateDashboard(dashboard) {
    this.broadCastService.onUpdateAppSpinnerPrompt(InformationMessage.Loading);
    this.router.navigate(['', dashboard]);
  }

  public gotoHome() {
    window.location.href = this.appState.stateId.homeURL;
  }
}
