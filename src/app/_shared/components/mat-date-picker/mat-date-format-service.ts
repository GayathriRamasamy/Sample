import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from "@angular/material";
import * as momentImported from 'moment';
const moment = momentImported;

const DATE_FORMAT = 'DD-MMM-YYYY';

/**
 * The MatDateAdpater implementation is to
 * override the existing datepicker parse and format method
 * and displays the date in the formated/parsed date format
 */
export class MatDateAdapter extends NativeDateAdapter {

    /**
     * Method to parse the string value to date
     * @param value string date or date value
     */
    public parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);        
        return isNaN(timestamp) ? null : new Date(timestamp);
    }
    /**
     * Method to convert date format
     * @param date date which has to be converted
     * @param displayFormat format to display
     */
    public format(date: Date, displayFormat: string): string {
        if (displayFormat === "inputMonth") {
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            return this.to2digit(month) + '/' + year;
        } else if (displayFormat === DATE_FORMAT) {        
            let formatedDate = moment(date).format(DATE_FORMAT);         
            return formatedDate;
        } else {
            return date.toDateString();
        }
    }

    /**
     * Method to slice by digits
     * @param n number of digits
     */
    private to2digit(n: number) {
        return ('00' + n).slice(-2);
    }
}

export const APP_DATE_FORMATS = {
    parse: {
        dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
    },
    display: {
        dateInput: DATE_FORMAT,
        monthYearLabel: 'inputMonth'
    }
};
