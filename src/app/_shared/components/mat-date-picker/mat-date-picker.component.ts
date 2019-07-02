import { Component, OnInit, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor, AbstractControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { MatDateAdapter, APP_DATE_FORMATS } from './mat-date-format-service';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import * as momentImported from 'moment';
const moment = momentImported;

@Component({
  selector: 'app-mat-date-picker',
  templateUrl: './mat-date-picker.component.html',
  exportAs: 'lib-mat-date-picker',
  styleUrls: ['./mat-date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatDatePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MatDatePickerComponent),
      multi: true
    },
    {
      provide: DateAdapter, useClass: MatDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})

export class MatDatePickerComponent implements OnInit, ControlValueAccessor {
  @Input() public name;
  @Input() public minDate;
  @Input() public maxDate;
  @Input() public showStar;
  @Input() public placeholder;
  @Input() public isEnablePicker;
  @Input() public selectedDate;

  @Output() public SelectEvent: EventEmitter<any> = new EventEmitter();

  private _model;
 

  public onChange: (_: any) => {};
  public onTouched: () => {};
  public validatorFn: () => {};

  constructor() {    
    this._model = this.selectedDate;
  }

  get model() {
    return this._model;
  }

  set model(value) {
    this._model = value;
  }

  public ngOnInit() {   
  }

  public ngOnChanges() {
  }

  /**
   * Method that performs synchronous validation against the provided control.
   * @return null
   */
  public validate(c: AbstractControl) {
    return null;
  }

  /**
   * Registers a callback function to call when the validator inputs change.
   * @param fn The callback function
   */
  public registerOnValidatorChange(fn) {
    this.validatorFn = fn;
  }

  /**
   * Method to call when ngModel set from view or parent component
   * @param val to write to the ngModel
   */
  public writeValue(val: any) {
    if (val) {
      this._model = val;
    } else {
      this._model = null;
    }
  }

  /**
   * Required forControlValueAccessor interface
   * @param fn The callback function
   */
  public registerOnChange(fn) {
    this.onChange = fn;
  }

  /**
   * Required forControlValueAccessor interface
   * @param fn The callback function
   */
  public registerOnTouched(fn) {
    this.onTouched = fn;
  }

  /**
   * Method to emit the selected date from the date picker
   * @param date selected date from the date picker popup
   */
  public onSelectedDate(date: any) {
    if (moment(date, 'YYYY/MM/DD', true).isValid() && moment(date, 'YYYY-MM-DD', true).isValid()) {
      this.SelectEvent.emit(date);
    }else{
      this.SelectEvent.emit(null);
    }
  }

}
