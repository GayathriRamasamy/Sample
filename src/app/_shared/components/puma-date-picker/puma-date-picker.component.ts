import {
    Component, Input, ElementRef, ViewChild, AfterViewInit, forwardRef,
    Output, EventEmitter, ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, AbstractControl, Validator, NG_VALUE_ACCESSOR, NG_VALIDATORS, } from '@angular/forms';
import * as moment from 'moment';
import { PumaDatePickerService } from './puma-date-picker.service';
import { NgbDateParserFormatter, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFormatService } from '../ngb-date-format-service';
// import { AppBroadcastService } from '../../../app.broadcast.service';

const PUMA_DATE_PICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PumaDatePickerComponent),
    multi: true
};

const PUMA_DATE_PICKER_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => PumaDatePickerComponent),
    multi: true
};

@Component({
    selector: 'app-puma-date-picker',
    templateUrl: './puma-date-picker.component.html',
    exportAs: 'pumaDataPicker',
    styleUrls: ['./puma-date-picker.component.scss'],
    providers: [
        PUMA_DATE_PICKER_VALUE_ACCESSOR,
        PUMA_DATE_PICKER_VALIDATOR,
        { provide: NgbDateParserFormatter, useClass: NgbDateFormatService }
    ]
})
export class PumaDatePickerComponent implements AfterViewInit, ControlValueAccessor, Validator {

    @Output() public DatePickerBlurEvent: EventEmitter<any> = new EventEmitter();
    @Output() public NavigateEvent: EventEmitter<any> = new EventEmitter();
    @Output() public BlurEvent: EventEmitter<any> = new EventEmitter();
    @Output() public SelectEvent: EventEmitter<any> = new EventEmitter();
    // tslint:disable-next-line:no-input-rename
    @Input('pdp-name') public pdpName;
    // tslint:disable-next-line:no-input-rename
    @Input('pdp-firstDayofWeek') public pdpFirstDateOfWeek = 7;
    // tslint:disable-next-line:no-input-rename
    @Input('pdp-display-name') public pdpDisplayName: string;
    // tslint:disable-next-line:no-input-rename
    @Input('pdp-required') public pdpRequired = true;
    // tslint:disable-next-line:no-input-rename
    @Input('pdp-disabled') public _disabled;
    @Input() public minDate;
    @Input() public maxDate;
    @Input() public markDisabled;
    @Input() public minMaxValidate = true;
    @Input() public placeholder = 'dd-mmm-yyyy';
    @Input() public placement = ['bottom-left', 'top-left'];
    @Input() public readOnly = false;
    @Input() public showRemoveIcon = false;
    @ViewChild('d') public d;
    @ViewChild('ngb') public ngb;
    @Input() public ignoremaxdate;

    public showCal = false;
    public calStatus: any = null;
    public pickerModel;
    public titleString = ' ';
    private _model;

    private _onChange: (_: any) => {};
    private _onTouched: () => {};
    private _validatorFn: () => {};

    constructor(
        public cd: ChangeDetectorRef,
        private pdp: PumaDatePickerService,
        private calendar: NgbCalendar,
    ) {
    }

    get model() {
        return this._model;
    }

    set model(value) {
        // model has set from inside
        // if (value && this.calendar.isValid(value)) {
        //     this._model = value;
        //     this._onChange(value);
        // } else {
        //     this._model = null;
        //     this._onChange(null);
        // }
        this._model = value;
        this._onChange(value);
    }

    public onFocus() {
        this._onTouched();
        // if (this.calendar.isValid(this.model)) {
        //     this.appBroadcastService.onSetInitialDate(this.model);
        // }
        if (this.readOnly) {
            this.toggle();
        }
    }

    public onBlur(event) {
        this._onTouched();
        this.BlurEvent.emit();
    }
    public onNavigateEvent(event) {
        // this._onTouched();
        this.NavigateEvent.emit(event);
    }

    public close() {
        this.d.close();
    }

    public open() {
        // this.d.open();
    }
    public pickerModelChanged(event) {
        this.model = event;
    }
    // public toggle (e) {
    //     this.ngb.navigateTo(this.model);
    //     // this.pickerModel = this.model;
    //     if (this.calStatus == null) {
    //         this.calStatus = 'enable';
    //     } else {
    //         this.calStatus = null;
    //     }
    //     e.cal = this;
    // }
    public toggle() {
        this.d.toggle();
        // if (this.calendar.isValid(this.model)) {
        //     this.appBroadcastService.onSetInitialDate(this.model);
        // }
    }
    public disableCal() {
        this.calStatus = null;
    }

    public navigateTo(date: { year: number, month: number }) {
        this.d.navigateTo(date);
    }

    public validate(c: AbstractControl) {
        return null;
        // const value = c.value;
        // if (value === null || value === undefined) {
        //     return null;
        // }

        // if (!this.calendar.isValid(value)) {
        //     return { pngbDate: { invalid: c.value } };
        // }
    }

    public registerOnValidatorChange(fn) {
        this._validatorFn = fn;
    }

    public writeValue(val: any) {
        // will be called when ngModel set from view or parent component
        if (val) {
            this._model = val;
        } else {
            this._model = null;
        }
    }
    // emits the value to view
    public registerOnChange(fn) {
        this._onChange = fn;
    }

    public registerOnTouched(fn) {
        this._onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean) {
        this._disabled = isDisabled;
    }

    public ngAfterViewInit() {
    }
    public getElementRef(ef: ElementRef) {
        this.pdp.selectedElementRef = ef;
    }

    public onNavigate(event, d) {
        // if (this.model && event.current && event.current.year !== event.next.year) {
        //     this.model = {
        //         year: event.next.year,
        //         month: event.current.month,
        //         day: ((event.current.year % 4) === 0 && event.current.month === 2 && (this.model.day > 28)) ? 28 : this.model.day
        //     };
        // }

        // if (this.model && event.current && event.current.month !== event.next.month) {
        //     let startDate = moment([event.next.year, event.next.month - 1]);
        //     let endDate = moment(startDate).endOf('month');
        //     this.model = {
        //         year: parseFloat(moment(endDate).format('YYYY')),
        //         month: parseFloat(moment(endDate).format('MM')),
        //         day: (this.model.day > parseFloat(moment(endDate).format('DD'))) ?
        //             parseFloat(moment(endDate).format('DD')) : this.model.day
        //     };
        // }
        // set close the opened date picker if any before opening another datepicker
        if (this.pdp.selectedDatePicker) {
            if (d === this.pdp.selectedDatePicker) {
                // same date picker, so dont close it
            } else {
                // selecting different date picker, so close it
                this.pdp.selectedDatePicker.close();
            }
        }
        this.pdp.selectedDatePicker = d;
    }
    // public onSelectedDate(date: any) {
    //     if ((moment(date, 'DD-MM-YYYY', true).isValid() && moment(date, 'DD-MMM-YYYY', true).isValid()) || this.calendar.isValid(date)) {
    //         this.SelectEvent.emit();
    //         this.appBroadcastService.onSetInitialDate(date);
    //     }
    // }

    // public onSetInitialDate(date: any) {
    //     if ((moment(date, 'DD-MM-YYYY', true).isValid() && moment(date, 'DD-MMM-YYYY', true).isValid()) || this.calendar.isValid(date)) {
    //         this.appBroadcastService.onSetInitialDate(date);
    //     }
    // }

    public onRemovedDate(date: any) {
        this.SelectEvent.emit();
    }
    // @HostListener('document:click', ['$event'])
    // public closeCal (event: MouseEvent) {
    //     let className = event.target['className'];
    //     let lastClass = className.split(" ").splice(-1)[0];
    //     // tslint:disable-next-line:max-line-length
    //     if (this.calStatus === null || lastClass === 'ngb-dp-navigation-chevron'
    //         || lastClass === 'custom-select' || lastClass === 'fa-calendar'
    //           || lastClass === 'input-group-addon' || lastClass === 'ngb-dp-arrow-btn') {
    //     } else {
    //         this.toggle(event);
    //     }
    //     if (lastClass === 'fa-calendar' && event['cal'] !== undefined) {
    //         this.disableCal();
    //         event['cal'].calStatus = null;
    //         event['cal'].calStatus = 'enable';
    //     }
    // }
}
