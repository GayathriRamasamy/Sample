import { Directive, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgControl } from '@angular/forms';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { PumaDatePickerService } from './puma-date-picker.service';
import { PumaDatePickerComponent } from './puma-date-picker.component';
import * as moment from 'moment';

@Directive({
    selector: 'puma-date-picker[setMinMaxDate]'
})
export class SetMinMaxDateDirective implements OnInit, OnChanges {
    // tslint:disable-next-line:no-input-rename
    @Input('min-max-estStartDate') public estStartDate: NgbDate;
    // tslint:disable-next-line:no-input-rename
    @Input('min-max-estEndDate') public estEndDate: NgbDate;
    // tslint:disable-next-line:no-input-rename
    @Input('setMinMaxDate') public type: "start" | "end";

    @Input() public dateCtrl: NgControl;

    public get maxDate() {
        switch (this.type) {
            case "start":
                {
                    if (this.pds.before(this.estEndDate, this.minDate)) {
                        return null;
                    } else if (this.pds.ngbDateToMoment(this.estEndDate).format('YYYY-MM-DD') === this.pds.ngbDateToMoment(this.minDate).format('YYYY-MM-DD')) {
                        return null;
                    }
                    return this.oneDayBefore(this.estEndDate);
                }
            case "end":
                return null;
            default:
                break;
        }
    }

    public get minDate() {
        switch (this.type) {
            case "start":
                return this.pds.dateToNgbDate(new Date());
            case "end":
                {
                    return this.endMinDate(this.estEndDate);
                }
            default:
                break;
        }
    }

    constructor(
        private pdp: PumaDatePickerComponent,
        private pds: PumaDatePickerService,
        private calendar: NgbCalendar
    ) {

    }

    public ngOnInit() {
        this.pdp.minDate = this.minDate;
        this.pdp.maxDate = this.maxDate;

        this.dateCtrl.valueChanges.subscribe((value) => {
            if (this.type === 'start') {
                if (this.pds.ngbDateToMoment(value).format('YYYY-MM-DD') === moment.utc().format('YYYY-MM-DD')) {
                    return this.pdp.maxDate = this.pds.dateToNgbDate(new Date());
                } else if (this.pds.before(value, this.minDate)) {
                    return this.pdp.maxDate = null;
                } else if (this.pds.ngbDateToMoment(this.estEndDate).format('YYYY-MM-DD') === this.pds.ngbDateToMoment(this.minDate).format('YYYY-MM-DD')) {
                    return null;
                }
                return this.pdp.maxDate = this.oneDayBefore(value);
            }
            if (this.type === 'end') {
                this.pdp.minDate = this.endMinDate(value);
            }
        });
    }

    public ngOnChanges(change: SimpleChanges) {
        // min date - current date to one day before project start date
        // max date - one day after project start date to infinity;
        // setTimeout(() => {
        //     if (change.estEndDate && change.estEndDate.previousValue !== change.estEndDate.currentValue && this.type === 'start') {
        //         this.pdp.maxDate = this.maxDate;
        //     }

        //     if (change.estStartDate && change.estStartDate.previousValue !== change.estStartDate.currentValue && this.type === 'end') {
        //         this.pdp.minDate = this.minDate;
        //     }
        // })

    }

    private oneDayBefore(date): NgbDate {
        return this.calendar.getPrev(date, 'd', 1);
    }

    private oneDayAfter(date): NgbDate {
        return date ? this.calendar.getNext(date, 'd', 1) : date;
    }

    private endMinDate(date) {
        if (this.pds.before(date, this.pds.dateToNgbDate(new Date()))) {
            return this.pds.dateToNgbDate(new Date());
        }
        return this.oneDayAfter(date);
    }
}
