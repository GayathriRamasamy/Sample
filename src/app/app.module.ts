import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppMaterialModule } from './app.material.module';
import { AppFontAwesomeModule } from 'src/app-fontawesome.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientXsrfModule } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { OAuthModule } from 'angular-oauth2-oidc-cache';
import { AuthGuard } from './_shared/okta/auth.guard';
import { AppResolver } from './app.resolver';
import { AppDataService } from './_services/app.data.service';
import { AppBroadCastService } from './_services';
import { AppStateService, InternalStateType } from './_services';
import { NoContentComponent } from './_shared/components';
import { APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HomeModule } from './home/home.module';
import { LoginComponent } from './_shared/okta/login.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AppRoutingModule } from './app.routing.module';
import { ErrorModule } from './error/error.module';
import { DateViewerModule } from '../../projects/date-viewer/src/lib/date-viewer.module';
import { NgbDropdownModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SearchService } from './_shared/+search/search.service';
import { SearchTextModule } from './_shared/components/search-text/search-text.module';
import {AppCancelConfimationModule} from './app.cancel.confimation.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MatchSorterPipe } from './_shared/pipes/matchSorter.pipe';
import { PipeModule } from './_shared/pipes/pipe.module';
import { FormsModule } from '@angular/forms';
import { AppPermissionService } from './_services/authpermission.service';

@NgModule({
  declarations: [
    AppComponent,
    AppComponent,
    AboutComponent,
    LoginComponent,
    NoContentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PipeModule,
    FormsModule,
    CommonModule,
    OAuthModule.forRoot(),
    AppMaterialModule,
    AppFontAwesomeModule,
    AppCancelConfimationModule.forRoot(),
    HomeModule,
    AppRoutingModule,
    ErrorModule,
    DateViewerModule,
    LoggerModule.forRoot({ serverLogLevel: NgxLoggerLevel.OFF, level: NgxLoggerLevel.TRACE }),
    DashboardModule,
    NgbDropdownModule,
    NgbModule.forRoot(),
    SearchTextModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right'
    })
  ],
  providers: [
    AppDataService,
    AppStateService,
    AppPermissionService,
    AppResolver,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: AppResolver) => () => config.validateUser(),
      deps: [AppResolver],
      multi: true
    },
    AppBroadCastService,
    AuthGuard, SearchService, ToastrService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
