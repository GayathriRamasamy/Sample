import * as moment from 'moment';
import { AbstractControl } from '@angular/forms';

export function minMaxValidator(c: AbstractControl) {
        let value = c.value;
        let minDate: moment.Moment = this.minDate;
        let maxDate: moment.Moment = this.maxDate;
        let err = { min: minDate, max: maxDate };

        if (!value || (value && !this.calendar.isValid(value))) {
            return null;
        }

        if (!(minDate && maxDate)) {
            return null;
        }

        if (!minDate.isValid() || !maxDate.isValid()) {
            return;
        }

        let selectedDate: moment.Moment = ngbDateToMoment.bind(this)(value);

        let correctDate = null;
        if (selectedDate) {
            correctDate = selectedDate.isBetween(minDate, maxDate, 'date') || selectedDate.isSame(maxDate, 'date') || selectedDate.isSame(minDate, 'date');
        }

        if (correctDate === null) {
            return null;
        }

        if (!correctDate) {
            return err;
        }

        return null;
}

function ngbDateToMoment(date) {
    if (date && this.calendar.isValid(date)) {
        return moment.utc(`${date.year}-${date.month}-${date.day}`, 'YYYY-MM-DD');
    }

    return null;
}
