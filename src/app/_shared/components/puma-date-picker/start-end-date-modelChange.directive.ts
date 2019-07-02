import { Directive, Input, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { PumaDatePickerService } from './puma-date-picker.service';
import { PumaDatePickerComponent } from './puma-date-picker.component';

@Directive({
    selector: 'puma-date-picker[startEndToastrFn][setMinMaxDate][startEndModelChange]'
})

export class StartEndDateModelChangeDirective {

    // tslint:disable-next-line:no-input-rename
    @Input('startEndModelChange') public initialDate;
    // tslint:disable-next-line:no-input-rename
    @Input('startEndToastrFn') public errMsg;
    // tslint:disable-next-line:no-input-rename
    @Input('startEndModel') public model;
    // tslint:disable-next-line:no-input-rename
    @Input('startEndProp') public prop;
    public selectedDate: NgbDate;

    constructor(
        private calendar: NgbCalendar,
        private fc: NgControl,
        private pds: PumaDatePickerService,
        private pdp: PumaDatePickerComponent
    ) {

    }

    // this will happen only when user tries to enter date manually by typing the value
    // shows toastr error when tries to enter date which is out of bound(min-max)
    @HostListener('ngModelChange', ['$event'])
    public validateDate(date: NgbDate) {
        // project start should be gt than or eq to current date and less than project end date
        // eg:
        // current date is 22 dec 2017 and project end date 25 dec 2017
        //  project start date 22 dec 2017 - valid
        //  project start date 21 dec 2017 - invalid - less than current date
        //  project start date 25 dec 2017 - invalid - same as project end date
        //  project start date 26 dec 2017 - invalid - gt than project end date

        let dateIsValid = false;
        this.selectedDate = date;
        if (!(this.fc.control.dirty || this.fc.control.touched)) {
            return;
        }

        if (!this.calendar.isValid(date)) {
            // setTimeout(() => { this.model[this.prop] = this.initialDate; });
            return;
        }

        if (!this.pdp.maxDate) {
            dateIsValid = this.pds.isSameOrAfter(date, this.pdp.minDate);
        } else {
            dateIsValid = this.pds.inBetweenOrSame(date, this.pdp.minDate, this.pdp.maxDate);
        }

        if (dateIsValid) {
            return;
        } else {
            setTimeout(() => { this.model[this.prop] = this.initialDate; });
            this.errMsg();
            return;
        }
    }
    @HostListener('focusout', ['$event'])
    public onBlur(event) {
        if (!this.calendar.isValid(this.selectedDate)) {
            setTimeout(() => { this.model[this.prop] = this.initialDate; });
            return;
        }
    }
}
