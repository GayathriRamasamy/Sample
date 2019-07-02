import { DashboardService } from 'src/app/_services/+dashboard/dashboard.service';
import { DebugElement } from '@angular/core';
import { AppStateService } from './../../_services/app.state.service';
import { HeaderModule } from './header.module';
import { ConfigService } from './../../_services/+dashboard/config.service';
import { Observable } from 'rxjs/Observable';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AppDataService } from 'src/app/_services';
import { HttpClientModule } from '@angular/common/http';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc-cache';
import { of } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}
const fakeActivatedRoute = {
  snapshot: { data: {} }
} as ActivatedRoute;

const mockRouter = new MockRouter();
fdescribe('HeaderComponent', () => {
  let dashboardName = 'scentPortfolioDashboard';
  let updateConfigFile = { "title": "Scent Portfolio Dashboard", "filter": "scentPortfolioFilter", "header": "My Scent Portfolios' @secLvlTabKey@ by @sortedOption@", "dateList": { "default": "last12Months", "list": { "qtrToDate": "QTR to Date", "lastQtr": "Last QTR", "ytd": "YTD", "last12Months": " Last 12 Months", "last16QTRs": "Last 16 QTRs", "customRange": "Custom - Range" } }, "report": { "inflow": "Inflow", "outflow": "Outflow", "winRate": "Win Rate", "sales": "Sales", "product": "Product", "samples": "Samples" }, "sortBy": { "default": "summary", "list": { "customer": "Customer (Top 5)", "category": "Category", "creativeCenter": "Creative Center", "customerClassification": "Customer Classification", "customerSegmentation": "Customer Segmentation", "opportunityType": "Opportunity Type", "projectType": "Project Type", "region": "Region", "restrictions": "Restrictions", "serviceLevel": "Service Level", "summary": "Summary" } }, "content": { "all": { "name": "All", "description": "My ScentPortfolios" }, "field": ["portfolioNumber", "portfolioDescription", "image"], "url": "http://172.24.144.131:50511/scentportfolio" }, "slider": { "yearOverYear": { "name": "Year Over Year", "list": ["sales"] } } }
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let debugElement: DebugElement;
  let configService: ConfigService;
  let loadConfigSpy;
  let getupdateConfigFileSpy;
  let getDashboardNameSpy, loadDeatilsConfigSpy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HeaderModule, NgbModalModule, HttpClientModule, ToastrModule.forRoot()],
      providers: [
        AppStateService,
        OAuthService,
        AppDataService,
        NgbModal,
        ToastrService,
        ConfigService,
        DashboardService,
        UrlHelperService,
        { provide: Router, useValue: mockRouter, },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    configService = debugElement.injector.get(ConfigService);

  });
  afterEach(() => {
    configService = null;
    component = null;
    sessionStorage.clear();
  });
  it('should create', () => {
    configService.dashboardName.next(dashboardName);
    getDashboardNameSpy = spyOn(configService, 'getDashboardName').and.callFake(() => {
      configService.dashboardName.next(dashboardName);
    });
    loadDeatilsConfigSpy = spyOn(configService, 'loadDeatilsConfig').and.callThrough();
    getupdateConfigFileSpy = spyOn(configService, 'getupdateConfigFile').and.returnValue(of(updateConfigFile));
    sessionStorage.setItem(dashboardName, JSON.stringify(updateConfigFile));
    loadConfigSpy = spyOn(configService, 'loadupdateConfigFile').and.callFake(() => {
      if (sessionStorage.getItem(dashboardName)) {
        configService.updateConfigFile = JSON.parse(sessionStorage.getItem(dashboardName));
      } else {
        sessionStorage.setItem(dashboardName, JSON.stringify(updateConfigFile));
        configService.updateConfigFile = JSON.parse(sessionStorage.getItem(dashboardName));
      }
      if (configService.updateConfigFile) {
        return true;
      } else {
        return false;
      }
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('setSubjects', () => {
    configService.dashboardName.next(dashboardName);
    getDashboardNameSpy = spyOn(configService, 'getDashboardName').and.callFake(() => {
      configService.dashboardName.next(dashboardName);
    });
    loadDeatilsConfigSpy = spyOn(configService, 'loadDeatilsConfig').and.callThrough();
    getupdateConfigFileSpy = spyOn(configService, 'getupdateConfigFile').and.returnValue(of(updateConfigFile));
    sessionStorage.setItem(dashboardName, JSON.stringify(updateConfigFile));
    loadConfigSpy = spyOn(configService, 'loadupdateConfigFile').and.callFake(() => {
      if (sessionStorage.getItem(dashboardName)) {
        configService.updateConfigFile = JSON.parse(sessionStorage.getItem(dashboardName));
      } else {
        sessionStorage.setItem(dashboardName, JSON.stringify(updateConfigFile));
        configService.updateConfigFile = JSON.parse(sessionStorage.getItem(dashboardName));
      }
      if (configService.updateConfigFile) {
        return true;
      } else {
        return false;
      }
    });
    fixture.detectChanges();
    component.selectedFrstLvlTabKey = 'All';
    component.selectedDateRange = 'Last 12 Months';
    component.defaultDateKey = 'last12Months';
    let dashboardService = debugElement.injector.get(DashboardService);
    let frstLvlTabKey, dateValue, dateKey;
    component.setSubjects();
    dashboardService.frstLvlTabKey.subscribe(value => {
      frstLvlTabKey = value;
    });
    expect(frstLvlTabKey).toEqual(component.selectedFrstLvlTabKey);
    dashboardService.dateValue.subscribe(value => {
      dateValue = value;
    }); 
    expect(dateValue).toEqual(component.selectedDateRange);
    dashboardService.dateKey.subscribe(key => {
      dateKey = key;
    });
    expect(dateKey).toEqual(component.defaultDateKey);

  });


  it('initialiseInvites', () => {
    dashboardName = 'managementDashboard';
    configService.dashboardName.next(dashboardName);
    getDashboardNameSpy = spyOn(configService, 'getDashboardName').and.callFake(() => {
      configService.dashboardName.next(dashboardName);
    });
    loadDeatilsConfigSpy = spyOn(configService, 'loadDeatilsConfig').and.callThrough();
    getupdateConfigFileSpy = spyOn(configService, 'getupdateConfigFile').and.returnValue(of(updateConfigFile));
    sessionStorage.setItem(dashboardName, JSON.stringify(updateConfigFile));
    loadConfigSpy = spyOn(configService, 'loadupdateConfigFile').and.callFake(() => {
      if (sessionStorage.getItem(dashboardName)) {
        configService.updateConfigFile = JSON.parse(sessionStorage.getItem(dashboardName));
      } else {
        sessionStorage.setItem(dashboardName, JSON.stringify(updateConfigFile));
        configService.updateConfigFile = JSON.parse(sessionStorage.getItem(dashboardName));
      }
      if (configService.updateConfigFile) {
        return true;
      } else {
        return false;
      }
    });

    fixture.detectChanges();
    component.initialiseInvites();
    expect(configService.updateConfigFile).toBeDefined();
    expect(loadConfigSpy).toHaveBeenCalled();
    // component.updateConfigFile = configService.updateConfigFile
    expect(configService.updateConfigFile).toEqual(component.updateConfigFile);
  });


  it('getFilter', () => {
    configService.dashboardName.next(dashboardName);
    let managementDashboadConfig = {
      "title": "Management Dashboard",
      "filter": "managementFilter",
      "header": null,
      "dateList": {
        "default": "last12Months",
        "list": {
          "qtrToDate": "QTR to Date",
          "lastQtr": "Last QTR",
          "ytd": "YTD",
          "last12Months": " Last 12 Months",
          "last16QTRs": "Last 16 QTRs",
          "customRange": "Custom - Range"
        }
      },
      "content": {
        "process": {
          "name": "Process",
          "report": {
            "siProject": "SI Project",
            "projectTimeline": "Project Timeline"
          },
          "sortBy": {
            "customer": "Customer",
            "category": "Category",
            "creativeCenter": "Creative Center",
            "customerClassification": "Customer Classification",
            "customerSegmentation": "Customer Segmentation",
            "opportunityType": "Opportunity Type",
            "projectType": "Project Type",
            "region": "Region",
            "restrictions": "Restrictions",
            "serviceLevel": "Service Level",
            "summary": "Summary"
          }
        },
        "finance": {
          "name": "Finance",
          "report": {
            "inflow": "Inflow",
            "pipeline": "Pipeline",
            "outflow": "Outflow",
            "overdue": "Overdue",
            "netImpact": "Net Impact",
            "sales": "Sales",
            "costToServe": "Cost To Serve"
          },
          "sortBy": {
            "customer": "Customer",
            "category": "Category",
            "creativeCenter": "Creative Center",
            "customerClassification": "Customer Classification",
            "customerSegmentation": "Customer Segmentation",
            "opportunityType": "Opportunity Type",
            "projectType": "Project Type",
            "region": "Region",
            "restrictions": "Restrictions",
            "serviceLevel": "Service Level",
            "summary": "Summary"
          }
        },
        "product": {
          "name": "Product",
          "report": {
            "submitted": "Ingredients | submitted ",
            "formulas": "Formulas",
            "selling": "Ingredients | Selling",
            "lineage": "Lineage"
          },
          "sortBy": {
            "customer": "Customer",
            "category": "Category",
            "creativeCenter": "Creative Center",
            "customerClassification": "Customer Classification",
            "customerSegmentation": "Customer Segmentation",
            "opportunityType": "Opportunity Type",
            "projectType": "Project Type",
            "region": "Region",
            "restrictions": "Restrictions",
            "serviceLevel": "Service Level",
            "summary": "Summary"
          }
        },
        "people": {
          "name": "People",
          "report": {
            "allocation": "Allocation"
          },
          "sortBy": {}
        }
      },
      "slider": {
        "yearOverYear": {
          "name": "Year Over Year",
          "list":
            ["inflow", "pipeline", "outflow", "overdue", "netImpact", "sales", "costToServe",
              "submitted", "formulas", "selling", "lineage"]
        },
        "includeCancelledProjects": {
          "name": "Include Cancelled Projects",
          "list": ["outflow"]
        },
        "includeExclusiveProjects": { "name": "Include Exclusive Projects", "list": ["outflow"] },
        "showClosedProjects": { "name": "Show Closed Projects", "list": ["siProject", "projectTimeline"] }
      }
    };
    getDashboardNameSpy = spyOn(configService, 'getDashboardName').and.callFake(() => {
      configService.dashboardName.next(dashboardName);
    });
    loadDeatilsConfigSpy = spyOn(configService, 'loadDeatilsConfig').and.callThrough();
    getupdateConfigFileSpy = spyOn(configService, 'getupdateConfigFile').and.returnValue(of(managementDashboadConfig));
    sessionStorage.setItem(dashboardName, JSON.stringify(managementDashboadConfig));
    loadConfigSpy = spyOn(configService, 'loadupdateConfigFile').and.callFake(() => {
      if (sessionStorage.getItem(dashboardName)) {
        configService.updateConfigFile = JSON.parse(sessionStorage.getItem(dashboardName));
      } else {
        sessionStorage.setItem(dashboardName, JSON.stringify(managementDashboadConfig));
        configService.updateConfigFile = JSON.parse(sessionStorage.getItem(dashboardName));
      }
      if (configService.updateConfigFile) {
        return true;
      } else {
        return false;
      }
    });
    component.updateConfigFile = updateConfigFile;
    fixture.detectChanges();
    component.initialiseInvites();
    component.getFilter();
    expect(component.isEnableMdFilter).toBeFalsy();
    expect(component.isEnableSpdfilter).toBeTruthy();
  });




  it('getDateRanges',()=>{

  });
});
