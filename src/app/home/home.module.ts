import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { AuthGuard } from '../_shared/okta/auth.guard';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppMaterialModule } from '../app.material.module';
import { PeoplePickerModule } from '../_shared/components/people-picker/people-picker.module';
import { RichTextModule } from '../_shared/components/rich-text/rich-text.module';
import { MatDatePickerModule } from '../_shared/components/mat-date-picker/mat-date-picker.module';
import { AppDirectiveModule } from '../_shared/directives/app-directives.module';
import { DateViewerModule } from '../../../projects/date-viewer/src/lib/date-viewer.module';
import { PanelCollapseModule } from '../_shared/components/panelcollapse/panelcollapse.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AlphaNumericDirective } from '../_shared/directives/alpha-numeric.directive';

const HomeRouting: ModuleWithProviders = RouterModule.forChild([
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    }
]);

@NgModule({
    imports: [
        CommonModule,
        HomeRouting,
        MatDatePickerModule,
        AppMaterialModule,
        PeoplePickerModule,
        RichTextModule,
        AppDirectiveModule,
        FormsModule,
        DateViewerModule,
        PanelCollapseModule,
        NgbCollapseModule
    ],
    exports: [PanelCollapseModule, NgbCollapseModule],
    declarations: [HomeComponent, WelcomeComponent, AlphaNumericDirective],
    providers: []
})
export class HomeModule { }
