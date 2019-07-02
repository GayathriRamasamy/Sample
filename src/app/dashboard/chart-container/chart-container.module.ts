import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlModule } from '@angular-mdl/core';

import { ChartContainerComponent } from './chart-container.component';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BubbleChartModule } from '../bubble-chart/bubble-chart.module';
import { BarChartModule } from '../bar-chart/bar-chart.module';
import { ColumnChartModule } from '../column-chart/column-chart.module';
import { DetailsModule } from '../details/details.module';


@NgModule({
  imports: [
    CommonModule,
    NgbDropdownModule,
    BubbleChartModule,
    ColumnChartModule,
    BarChartModule,
    DetailsModule,  
    MdlModule,
    NgbModule.forRoot()
  ],
  declarations: [ChartContainerComponent],
  exports: [
    ChartContainerComponent
  ],
})
export class ChartContainerModule { }
