import { Directive, OnInit, Input, HostListener } from '@angular/core';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgControl } from '@angular/forms';
import { PumaDatePickerComponent } from '../puma-date-picker.component';
import { PumaDatePickerService } from '../puma-date-picker.service';

@Directive({
    selector: 'puma-date-picker[dueDate][dueDateEstStart][dueDateEstEnd][dueDateToastrFn][dueDateInitialDate]'
})
export class DueDateDirective implements OnInit {
    // tslint:disable-next-line:no-input-rename
    @Input('dueDate') public model;
    // tslint:disable-next-line:no-input-rename
    @Input('dueDateEstStart') public projectStartDate;
    // tslint:disable-next-line:no-input-rename
    @Input('dueDateEstEnd') public projectEndDate;
    // tslint:disable-next-line:no-input-rename
    @Input('dueDateToastrFn') public errFn;
    // tslint:disable-next-line:no-input-rename
    @Input('dueDateInitialDate') public intialDate;
    // tslint:disable-next-line:no-input-rename
    @Input('dueDateProp') public prop;

    constructor(
        private pdp: PumaDatePickerComponent,
        private pds: PumaDatePickerService,
        private calendar: NgbCalendar,
        private fc: NgControl
    ) {

    }

    @HostListener('ngModelChange', ['$event'])
    public onModelChange(value) {

        if (!(this.fc.control.dirty || this.fc.control.touched)) {
            return;
        }
        if (!value || !this.calendar.isValid(value)) {
            setTimeout(() => { this.model[this.prop] = this.intialDate; });
            return;
        }

        if (!this.pds.inBetweenOrSame(value, this.pdp.minDate, this.pdp.maxDate)) {
            setTimeout(() => { this.model[this.prop] = this.intialDate; });
            return this.errFn();
        }
    }
    
    public ngOnInit() {
        this.pdp.minDate = this.minDate;
        this.pdp.maxDate = this.projectEndDate;
    }

    get minDate() {
        let currentDate = this.pds.dateToNgbDate(new Date());
        if (this.pds.before(this.projectStartDate, currentDate)) {
            return currentDate;
        }

        return this.projectStartDate;
    }

}
