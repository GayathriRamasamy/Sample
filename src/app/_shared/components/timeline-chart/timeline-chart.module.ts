import { NgModule } from '@angular/core';
import { TimelineChartComponent } from './timeline-chart.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
    exports: [TimelineChartComponent],
    imports: [CommonModule, RouterModule],
    declarations: [TimelineChartComponent],
})
export class TimeLineModule { }
