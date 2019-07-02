import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

function padNumber(value: number) {
    if (isNumber(value)) {
        return `0${value}`.slice(-2);
    } else {
        return '';
    }
}

function isNumber(value: any): boolean {
    return !isNaN(toInteger(value));
}

function toInteger(value: any): number {
    return parseInt(`${value}`, 10);
}

@Injectable()
export class NgbDateFormatService extends NgbDateParserFormatter {
    public parse(value: string): NgbDateStruct {

        // if (value.trim().split('-').length === 0 || !moment(value, 'DD-MM-YYYY', true).isValid()) {
        //     return null;
        // }

        if (!moment(value, 'DD-MM-YYYY', true).isValid() && !moment(value, 'DD-MMM-YYYY', true).isValid()) {
            return null;
        }

        if (value) {
            const dateParts = value.trim().split('-');

            if (!isNumber(dateParts[1])) {
                dateParts[1] = moment().month(dateParts[1]).format('M');
            }

            if (dateParts.length === 1 && isNumber(dateParts[0])) {
                return { year: toInteger(dateParts[0]), month: null, day: null };
            } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
                return { year: toInteger(dateParts[2]), month: toInteger(moment(dateParts[1])), day: null };
            } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
                return { year: toInteger(dateParts[2]), month: toInteger(dateParts[1]), day: toInteger(dateParts[0]) };
            }
        }
        return null;
    }

    public format(date: NgbDateStruct): string {
        return date ?
            `${isNumber(date.day) ? padNumber(date.day) : ''}-${isNumber(date.month) ? moment().month(date.month - 1).format('MMM') : ''}-${date.year}` :
            '';
    }
}
