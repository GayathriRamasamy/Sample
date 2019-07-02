import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { filter, orderBy, findIndex } from 'lodash';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'selected-facet',
    templateUrl: './selectedfacet.component.html',
    styleUrls: ['./selectedfacet.component.scss']
})

export class SelectedFacetComponent implements OnInit, OnChanges {

    public facetsCollection: any[];
    DisplayName;
    @Input()
    public set facets(coll: any[]) {
        this.facetsCollection = coll;
    }
    public data: any[] = [];
    @Input() public set options(value: any) {
        if (value) {
            this.data = value;
        } else {
            this.data = [];
        }
    }
    @Input() public displayBy: any;
    // tslint:disable-next-line:no-output-on-prefix
    @Output()
    public onChange: EventEmitter<any> = new EventEmitter<any>();
    public result: any[] = [];
    public show = false;
    public constructor() { }
    public ngOnInit() {
    }

    public ngOnChanges() {
    }

    public onRemoving(item) {
        this.facetsCollection.splice(findIndex(this.facetsCollection, item), 1);
        this.onChange.emit(item);
    }
}
