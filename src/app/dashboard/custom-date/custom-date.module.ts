import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomDateComponent } from './custom-date.component';
import { MatDatePickerModule } from 'src/app/_shared/components/mat-date-picker/mat-date-picker.module';


@NgModule({
  imports: [
    CommonModule,
    MatDatePickerModule,FormsModule
  ],
  declarations: [CustomDateComponent],
  exports: [CustomDateComponent],
  entryComponents: [CustomDateComponent]
})
export class CustomDateModule { }
