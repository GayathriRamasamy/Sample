import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ConfigService } from '../_services/+dashboard/config.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HeaderModule } from './header/header.module';
import { ChartContainerModule } from './chart-container/chart-container.module';
import { MatCardModule } from '@angular/material';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppDataService, AppStateService } from '../_services';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc-cache';
import { ActivatedRoute, RouterModule, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let service: ConfigService;
  let configService: ConfigService;
  let configServiceCall;
  let debugElement: DebugElement;
  let htmlElement: HTMLElement;

  const fakeActivatedRoute = {
    snapshot: { data: {} }
  } as ActivatedRoute;

  class MockRouter {
    navigate = jasmine.createSpy('navigate');
  }


  const mockRouter = new MockRouter();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        HeaderModule,
        ChartContainerModule,
        MatCardModule,
        HttpClientModule,
        RouterModule,
      ], providers: [HttpClient, AppDataService, AppStateService, OAuthService,
        UrlHelperService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useValue: mockRouter, }

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get(ConfigService);
    // configService = new ConfigService();
    configServiceCall = spyOn(configService, 'loadDashboardConfig').and.callThrough();
    debugElement = fixture.debugElement.query(By.css('.title'));
    htmlElement = debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('Service injected via inject(...) and TestBed.get(...) should be the same instance',
    inject([ConfigService], (injectService: ConfigService) => {
      expect(injectService).toBe(service);

    })
  );

  it('should call the loadDashboardConfig method in service', () => {
    expect(configServiceCall).toHaveBeenCalled();
  });
  it('Initialize values by calling initialiseInvites', async () => {
  
    const initialDashboardName = component.dashboardName;
    component.initialiseInvites();
    const newDashboardName = component.dashboardName;
    expect(newDashboardName).toContain('Dashboard');
  });

  it('should display the name of the dashboard of the dashboardName', () => {
    expect(htmlElement.textContent).toContain(' ');
  });



});
