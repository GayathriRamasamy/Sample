import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_shared/okta/auth.guard';
import { AboutComponent } from './about/about.component';
import { NoContentComponent } from './_shared/components';
import { UnauthorizedComponent } from './error/unauthorized/unauthorized.component';
import { UsernotfoundComponent } from './error/usernotfound/usernotfound.component';
import { LoginComponent } from './_shared/okta/login.component';

export const ROUTES: Routes = [
  // { path: '', redirectTo: '', pathMatch: 'full' },
  // {
  //   path: 'dashboard',
  //   loadChildren: './dashboard/dashboard.module#DashboardModule',
  //   canActivate: [AuthGuard],
  //   runGuardsAndResolvers: 'paramsChange'
  // },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '*', redirectTo: '/login' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  {
    path: ':dashboardName',
    loadChildren: 'src/app/dashboard/dashboard.module#DashboardModule',
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard]
  },
  {
    path: 'search',
    loadChildren: './+search/search.module#SearchModule',
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard]
  },
  { path: 'about', component: AboutComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'usernotfound', component: UsernotfoundComponent },
  { path: '**', component: NoContentComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(ROUTES, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
