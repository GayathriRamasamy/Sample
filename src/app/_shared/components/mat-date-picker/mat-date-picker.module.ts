import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatInputModule, MatDatepickerModule } from "@angular/material";
import { MatDatePickerComponent } from './mat-date-picker.component';


@NgModule({
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatInputModule, MatDatepickerModule],
  declarations: [MatDatePickerComponent],
  exports: [MatDatePickerComponent]
})
export class MatDatePickerModule { }
