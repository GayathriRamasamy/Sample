import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BubbleChartComponent } from './bubble-chart/bubble-chart.component';
import { BubbleChartOverlayComponent } from './bubble-chart-overlay/bubble-chart-overlay.component';
import { NgbDropdownModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppLoadingComponent } from '../../_shared/components';

@NgModule({
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbModule.forRoot()
  ],
  declarations: [BubbleChartComponent, BubbleChartOverlayComponent,AppLoadingComponent],
  exports: [BubbleChartComponent, BubbleChartOverlayComponent],
  entryComponents: [BubbleChartOverlayComponent]
})
export class BubbleChartModule { }
