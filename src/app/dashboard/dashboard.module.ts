import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { HeaderModule } from './header/header.module';
import { ChartContainerModule } from './chart-container/chart-container.module';
import { AppMaterialModule } from '../app.material.module';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MdlModule } from '@angular-mdl/core';
import { CustomDateModule } from './custom-date/custom-date.module';
import { SavedSearchesModule } from '../_shared/+search/saved-searches/saved-searches.module';
import { DetailsModule } from './details/details.module';
import { BubbleChartModule } from './bubble-chart/bubble-chart.module';
import { BarChartModule } from './bar-chart/bar-chart.module';
import { FilterModule } from './filter/filter.module';
import { ColumnChartModule } from './column-chart/column-chart.module';
import { SpinnerComponent } from '../_shared/components';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { PresetSearchModule } from '../_shared/+search/preset-search/preset-search.module';
import { PrintModule } from '../print/print.module';
import { FacetModule } from '../_shared/components/facet/facet.module';

@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    ChartContainerModule,
    BubbleChartModule,
    BarChartModule,
    ColumnChartModule,
    CustomDateModule,
    AppMaterialModule,
    SavedSearchesModule,
    FilterModule,
    PresetSearchModule,
    DetailsModule,
    NgbDropdownModule,
    FacetModule,
    NgbModule.forRoot(),
    DashboardRoutingModule,
    MdlModule,
    PrintModule
  ],
  declarations: [DashboardComponent, SpinnerComponent]
})
export class DashboardModule { }


