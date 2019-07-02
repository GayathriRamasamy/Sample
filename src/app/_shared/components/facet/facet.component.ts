import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { each } from 'lodash';
@Component({
    selector: 'facet',
    templateUrl: 'facet.component.html',
    styleUrls: ['./facet.component.scss']
})

export class FacetComponent implements OnInit {
    /*
    public facetname: string;
    @Input() public set facetName(value: string) {
        this.facetname = value;
    }

    public title: string;
    @Input() public set facetTitle(value: string) {
        this.title = value;
    }

    public filterOptions: object[];
    @Input() public set options(value: object[]) {
        this.filterOptions = value;
    }

    @Input() public showTitle: boolean = true;

    public isAllSelect: boolean;
    @Input() public set isAllChecked(value: boolean) {
        this.isAllSelect = value;
    }

    @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();
    public isFacetCollapsed: boolean;
    public change(e: any) {
        this.checkSelectAll();
        this.onChange.emit(this.filterOptions);
    }
    constructor(private logger: NGXLogger) {
     }

    public ngOnInit() {

        // this.filterOptions = [{ name: 'Filter Name 1', isChecked: false },
        // { name: 'Filter Name 2', isChecked: false }, { name: 'Filter Name 3', isChecked: false },
        // { name: 'Filter Name 4' }];
    }

    public onSelectAll(isAllSelect) {
        this.filterOptions.map((item: any) => item.isChecked = isAllSelect);
        this.onChange.emit(this.filterOptions);
    }

    public onMouseEnter(option) {
        this.filterOptions.map((item: any) => {
            if (item.key === option.key) {
                item.showOnly = true;
            }
        });
    }

    public onMouseLeave(option) {
        this.filterOptions.map((item: any) => {
            if (item.key === option.key) {
                item.showOnly = false;
            }
        });
    }

    public onShowOnly(option) {
        this.filterOptions.map((item: any) => {
            if (item.key === option.key) {
                item.isChecked = true;
                return;
            }
            item.isChecked = false;
        });
        this.checkSelectAll();
        this.onChange.emit(this.filterOptions);
    }

    public checkSelectAll() {
        this.isAllSelect = this.filterOptions.every((item: any) => {
            return item.isChecked === true;
        });
    }
    */
public sampe = 'SAmple';
    public title: string;
    @Input() public set facetTitle(value: string) {
        this.title = value;
    }

    public facetTitDisable: boolean;
    @Input() public set facetTitleDisable(value: boolean) {
        this.facetTitDisable = value;
    }

    public filterOptions: object[];
    @Input() public set options(value: object[]) {
        if (value) {         
            this.filterOptions = value;
            this.checkSelectAll();
        } else {
            this.filterOptions = [];
        }
    }

    public isAllSelect: boolean;
    @Input() public set isAllChecked(value: boolean) {
        this.isAllSelect = value;
    }

    @Input() public displayBy: string = 'Description';

    @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();
    constructor() {
    }

    public ngOnInit() {
    }

    public onSelectAll(isAllSelect) {
        each(this.filterOptions, (item: any) => {
            item.isChecked = !isAllSelect;
        });
        this.emitData();
    }

    public checkSelectAll() {
        this.isAllSelect = this.filterOptions.every((item: any) => {
            return item.isChecked === false;
        });
    }

    public onClick(option) {
        this.checkSelectAll();
        this.emitData();
    }

    private emitData() {
        // if (this.isAllSelect) {
        //     this.onChange.emit([]);
        //     return;
        // }
        this.onChange.emit(this.filterOptions);
    }

    public trackByFn(index, item) {
        return index; // or item.id
    }
}
