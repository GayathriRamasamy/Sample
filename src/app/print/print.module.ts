import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppMaterialModule } from 'src/app/app.material.module';


import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DetailsModule } from '../dashboard/details/details.module';
import { DashboardRoutingModule } from '../dashboard/dashboard.routing.module';
import { BarChartModule } from '../dashboard/bar-chart/bar-chart.module';
import { ColumnChartModule } from '../dashboard/column-chart/column-chart.module';
import { FilterModule } from '../dashboard/filter/filter.module';
import { BubbleChartModule } from '../dashboard/bubble-chart/bubble-chart.module';
import { ChartContainerModule } from '../dashboard/chart-container/chart-container.module';
import { PrintComponent } from './print.component';

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    DetailsModule,
    DashboardRoutingModule,
    BarChartModule,
    ColumnChartModule,
    DetailsModule,
    FilterModule,
    NgbDropdownModule,
    ChartContainerModule,
    BubbleChartModule,
    NgbModule.forRoot(),
  ],
  declarations: [PrintComponent],
  exports : [
    PrintComponent
  ]
})
export class PrintModule { }
