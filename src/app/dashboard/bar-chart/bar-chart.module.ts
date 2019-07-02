import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import {  NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AppLoadingComponent } from '../../_shared/components/loading.component';

@NgModule({
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  declarations: [BarChartComponent],
  exports: [BarChartComponent]
})
export class BarChartModule { }
