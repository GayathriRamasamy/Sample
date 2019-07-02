import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'listFilter',
    pure: false
})
export class ListFilterPipe implements PipeTransform {
    public transform(items: any, filterText: any, field): any {
        if (!items || !filterText) {
            return items;
        }
        return items.filter((item: any) => (item[field].toString().toLowerCase().indexOf(filterText.toLowerCase()) !== -1));
    }
}
