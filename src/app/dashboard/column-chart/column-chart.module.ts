import { DetailsComponent } from './../details/details.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnChartComponent } from './column-chart/column-chart.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ColumnChartComponent],
  exports: [ColumnChartComponent],
  entryComponents: [DetailsComponent]
})
export class ColumnChartModule { }
