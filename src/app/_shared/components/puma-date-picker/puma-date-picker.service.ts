import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';

@Injectable()
export class PumaDatePickerService {
    public selectedDatePicker;
    public selectedElementRef;

    constructor(private calendar: NgbCalendar) { }

    public get currentDate() {
        return this.dateToNgbDate(moment());
    }

    public ngbDateToMoment(date) {
        if (date && this.calendar.isValid(date)) {
            return moment.utc(date.year + '-' + date.month + '-' + date.day, 'YYYY-MM-DD');
        }
        return null;
    }

    public ngbDateToDate(date) {
        if (date && this.calendar.isValid(date)) {
            return moment.utc(`${date.year}-${date.month}-${date.day}`, 'YYYY-MM-DD').format('YYYY-MM-DD');
        }
        return null;
    }

    public momentToNgbDate(m: moment.Moment): NgbDateStruct {
        if (m && m.isValid()) {
            return { day: m.date(), month: m.month() + 1, year: m.year() };
        }
        return null;
    }
    public momentFormatDate (m: moment.Moment): NgbDateStruct {
        if (m && m.isValid()) {
            return { day: m.date(), month: m.month(), year: m.year() };
        }
        return null;
    }

    public dateToNgbDate(date) {
        let ngbDate = null;
        if (date) {
            ngbDate = {
                day: parseFloat(moment.utc(date).format('DD')),
                month: parseFloat(moment.utc(date).format('MM')),
                year: parseFloat(moment.utc(date).format('YYYY'))
            };
        }

        return ngbDate;
    }

    public before(date1: NgbDate | NgbDateStruct, date2: NgbDate | NgbDateStruct): boolean {
        let m1 = this.ngbDateToMoment(date1);
        let m2 = this.ngbDateToMoment(date2);
        if (m1 && m2) {
            return m1.isBefore(m2);
        }
        return null;
    }

    public inBetweenOrSame(
        selectedDate: NgbDate | NgbDateStruct,
        date1: NgbDate | NgbDateStruct,
        date2: NgbDate | NgbDateStruct
    ): boolean {

        let mSelectedDate = this.ngbDateToMoment(selectedDate);
        let m1 = this.ngbDateToMoment(date1);
        let m2 = this.ngbDateToMoment(date2);
        if (m1 && m2 && mSelectedDate) {
            return mSelectedDate.isBetween(m1, m2) || mSelectedDate.isSame(m1) || mSelectedDate.isSame(m2);
        }
        return true;
    }

    public isSameOrAfter(date1: NgbDate | NgbDateStruct, date2: NgbDate | NgbDateStruct): boolean {
        let m1 = this.ngbDateToMoment(date1);
        let m2 = this.ngbDateToMoment(date2);
        if (m1 && m2) {
            return m1.isSameOrAfter(m2);
        }
        return null;
    }

    public isSameOrBefore(date1: NgbDate | NgbDateStruct, date2: NgbDate | NgbDateStruct): boolean {
        let m1 = this.ngbDateToMoment(date1);
        let m2 = this.ngbDateToMoment(date2);
        if (m1 && m2) {
            return m1.isSameOrBefore(m2);
        }
        return null;
    }

    public ngbDateToInputVal(date) {
        if (date && this.calendar.isValid(date)) {
            return moment.utc(`${date.day}-${date.month}${date.year}`, 'DD-MMM-YYYY').format('DD-MMM-YYYY');
        }
        return null;
    }
}
