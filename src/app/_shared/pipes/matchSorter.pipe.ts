import { Pipe, PipeTransform } from '@angular/core';
// import matchSorter from 'match-sorter';
@Pipe({
    name: 'matchSorter',
})
export class MatchSorterPipe implements PipeTransform {
  constructor() {}
    public transform(input: any[] = [], options: any | string, value: string): any {
        if (input) {
            if (typeof options === 'string') {
                if (options === '') {
                    return input.filter((item) => item !== null ? item.toLowerCase().includes(value.toLowerCase()) : '');
                } else {
                    return input.filter((item) => item[options] !== null ? item[options].toLowerCase().includes(value.toLowerCase()) : '');
                }
            } else {
                let result = input.filter((item) => {
                    return options.some((column) => {
                        if (item[column]) {
                            return item[column] !== null ? item[column].toLowerCase().includes(value.toLowerCase()) : '';
                        }
                    });
                });
                return result;
            }
        }
    }
}