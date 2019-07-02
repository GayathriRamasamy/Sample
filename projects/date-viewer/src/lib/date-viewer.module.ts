import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DateViewerComponent } from './date-viewer.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DateViewerComponent],
  exports: [DateViewerComponent]
})
export class DateViewerModule { }
