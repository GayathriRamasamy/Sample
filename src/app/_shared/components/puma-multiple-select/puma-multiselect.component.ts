import { sortBy, remove } from 'lodash';
import { forwardRef, Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, FormControl } from '@angular/forms';
import { DropdownSettings } from './puma-multiselect.interface';
import { MyException } from './puma-multiselect.model';

export const DROPDOWN_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PumaMultiSelect),
    multi: true
};
export const DROPDOWN_CONTROL_VALIDATION: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => PumaMultiSelect),
    multi: true,
};
const noop = () => {
};

function toBoolean(value: any): boolean {
    return value != null && `${value}` !== 'false';
}

function randomId() {
    // tslint:disable-next-line:no-bitwise
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return (S4() + S4());
}

@Component({
    selector: 'puma-multiselect',
    templateUrl: 'puma-multiselect.component.html',
    host: {
        '[class]': 'defaultSettings.classes',
        '[class.mdl-select]': 'true',
        '[class.mdl-select--floating-label]': 'isFloatingLabel',
        '[class.has-placeholder]': 'placeholder'
    },
    styleUrls: ['puma-multiselect.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR, DROPDOWN_CONTROL_VALIDATION]
})

export class PumaMultiSelect implements OnInit, ControlValueAccessor, OnChanges, Validator {

    public data: any[] = [];
    @Input() public set options(value: any) {
        if (value) {
            this.data = value;
        } else {
            this.data = [];
        }
    }

    @Input() public settings: DropdownSettings;

    @Input() public identifyBy: any;

    @Input() public displayBy: any;

    @Input() public label: string = '';

    @Input() public showStar: boolean = false;

    @Input() public searchLimitItems: number = 0;

    @Input('floating-label')
    get isFloatingLabel() { return this._isFloatingLabel; }
    set isFloatingLabel(value) { this._isFloatingLabel = toBoolean(value); }

    @Output('Select') public onSelect: EventEmitter<any> = new EventEmitter<any>();

    @Output('DeSelect') public onDeSelect: EventEmitter<any> = new EventEmitter<any>();

    @Output('SelectAll') public onSelectAll: EventEmitter<any> = new EventEmitter<any>();

    @Output('DeSelectAll') public onDeSelectAll: EventEmitter<any> = new EventEmitter<any>();

    @Output('onOpen') public onOpen: EventEmitter<any> = new EventEmitter<any>();

    @Output('onClose') public onClose: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('searchInput') public searchInput: ElementRef;

    public selectedItems: any;
    public isActive: boolean = false;
    public isSelectAll: boolean = false;
    public groupedData: any;
    public filterText: any;
    public chunkArray: any[];
    public scrollTop: any;
    public chunkIndex: any[] = [];
    public cachedItems: any[] = [];
    public totalRows: any;
    public itemHeight: any = 41.6;
    public screenItemsLen: any;
    public cachedItemsLen: any;
    public totalHeight: any;
    public scroller: any;
    public maxBuffer: any;
    public lastScrolled: any;
    public lastRepaintY: any;

    private _isFloatingLabel: boolean = false;

    public defaultSettings: DropdownSettings = {
        singleSelection: false,
        text: 'Select',
        showCheckAll: true,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        showSearchFilter: false,
        maxHeight: 250,
        badgeShowLimit: 999999999999,
        classes: '',
        disabled: false,
        searchPlaceholderText: 'Search',
        showCheckbox: true,
        noDataLabel: 'No Data Available',
        searchAutofocus: true,
        lazyLoading: false
    };
    public parseError: boolean;
    public textfieldId: string;
    public addFocusClass: boolean = false;

    constructor(public _elementRef: ElementRef) {
        this.textfieldId = `mdl-textfield-${randomId()}`;
    }

    private onTouchedCallback: (_: any) => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    public ngOnInit() {
        this.settings = Object.assign(this.defaultSettings, this.settings);
        if (this.settings.groupBy) {
            this.groupedData = this.transformData(this.data, this.settings.groupBy);
        }
        this.totalRows = (this.data && this.data.length);
        this.cachedItems = this.data;
        this.screenItemsLen = Math.ceil(this.settings.maxHeight / this.itemHeight);
        this.cachedItemsLen = this.screenItemsLen * 3;
        this.totalHeight = this.itemHeight * this.totalRows;
        this.maxBuffer = this.screenItemsLen * this.itemHeight;
        this.lastScrolled = 0;
        this.renderChunk(0, this.cachedItemsLen / 2);
    }



    public ngOnChanges(changes: SimpleChanges) {
        if (changes.data && !changes.data.firstChange) {
            if (this.settings.groupBy) {
                this.groupedData = this.transformData(this.data, this.settings.groupBy);
                if (this.data.length === 0) {
                    this.selectedItems = [];
                }
            }
        }
        if (changes.settings && !changes.settings.firstChange) {
            this.settings = Object.assign(this.defaultSettings, this.settings);
        }
    }
    public ngDoCheck() {
        if (this.selectedItems) {
            if (this.selectedItems.length === 0 || this.data.length === 0 || this.selectedItems.length < this.data.length) {
                this.isSelectAll = false;
            }
        }
    }
    public ngAfterViewInit() {
        if (this.settings.lazyLoading) {
            this._elementRef.nativeElement.getElementsByClassName("lazyContainer")[0].addEventListener('scroll', this.onScroll.bind(this),
                { passive: true });
        }
    }
    public onItemClick(item: any, index: number, evt: Event) {
        if (this.settings.disabled) {
            return false;
        }

        let found = this.isSelected(item);
        let limit = this.selectedItems.length < this.settings.limitSelection;

        if (!found) {
            if (this.settings.limitSelection) {
                if (limit) {
                    this.addSelected(item);
                    this.onSelect.emit(item);
                }
            } else {
                this.addSelected(item);
                this.onSelect.emit(item);
            }

        } else {
            this.removeSelected(item);
            this.onDeSelect.emit(item);
        }
        if (this.isSelectAll || this.data.length > this.selectedItems.length) {
            this.isSelectAll = false;
        }
        if (this.data.length === this.selectedItems.length) {
            this.isSelectAll = true;
        }
    }

    public validate(c: FormControl): any {
        return null;
    }


    // tslint:disable-next-line:member-access
    writeValue(value: any) {
        if (value !== undefined && value !== null) {
            if (this.settings.singleSelection) {
                try {

                    if (value.length > 1) {
                        this.selectedItems = [value[0]];
                        throw new MyException(404, { "msg": "Single Selection Mode, Selected Items cannot have more than one item." });
                    } else {
                        this.selectedItems = value;
                    }
                } catch (e) {
                    console.error(e.body.msg);
                }

            } else {
                if (this.settings.limitSelection) {
                    this.selectedItems = value.splice(0, this.settings.limitSelection);
                } else {
                    this.selectedItems = value;
                }
                if (this.selectedItems.length === this.data && this.data.length > 0) {
                    this.isSelectAll = true;
                }
            }
        } else {
            this.selectedItems = [];
        }
    }

    // From ControlValueAccessor interface
    // tslint:disable-next-line:member-access
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    // From ControlValueAccessor interface
    // tslint:disable-next-line:member-access
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
    public trackByFn(index: number, item: any) {
        return item[this.identifyBy];
    }
    public isSelected(clickedItem: any) {
        let found = false;
        this.selectedItems.map((item: any) => {

            if (clickedItem[this.identifyBy] === item[this.identifyBy]) {
                found = true;
            }
        });
        // this.selectedItems && this.selectedItems.forEach(item => {
        //     if (clickedItem.ID === item.ID) {
        //         found = true;
        //     }
        // });
        return found;
    }
    public addSelected(item: any) {
        if (this.settings.singleSelection) {
            this.selectedItems = [];
            this.selectedItems.push(item);
            this.onChangeCallback(this.selectedItems);

            this.onTouchedCallback(this.selectedItems);
            this.closeDropdown();
        } else {
            this.selectedItems.push(item);
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);
        }
    }
    public removeSelected(clickedItem: any) {
        // if (this.selectedItems) {
        //     this.selectedItems.forEach(item => {
        //         if (clickedItem[this.identifyBy] === item[this.identifyBy]) {
        //             this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
        //         }
        //     });
        // }
        if (!this.settings.singleSelection) {
            remove(this.selectedItems, clickedItem);
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);
        }
    }
    public toggleDropdown(evt: any) {
        if (this.settings.disabled) {
            return false;
        }
        this.isActive = !this.isActive;
        if (this.isActive) {
            if (this.settings.searchAutofocus && this.data.length > this.searchLimitItems) {
                setTimeout(() => {
                    this.searchInput.nativeElement.focus();
                }, 0);
            }
            // this.addFocusClass=true;
            this.onOpen.emit(true);
        } else {
            // this.addFocusClass=false;
            this.onClose.emit(false);
        }
        evt.preventDefault();
    }
    public closeDropdown() {
        // this.filter = new ListItem();
        this.filterText = '';
        this.isActive = false;
        this.onClose.emit(false);
    }
    public toggleSelectAll() {
        if (!this.isSelectAll) {
            this.selectedItems = [];
            this.selectedItems = this.data.slice();
            this.isSelectAll = true;
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);

            this.onSelectAll.emit(this.selectedItems);
        } else {
            this.selectedItems = [];
            this.isSelectAll = false;
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);

            this.onDeSelectAll.emit(this.selectedItems);
        }
    }
    public transformData(arr: Array<any>, field: any): Array<any> {
        const groupedObj: any = arr.reduce((prev: any, cur: any) => {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            } else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }, {});
        const tempArr: any = [];
        let afterGrouping = Object.keys(groupedObj);
        for (let i = 0; i < afterGrouping.length; i++) {
            tempArr.push({ key: afterGrouping[i], value: groupedObj[afterGrouping[i]] });
        }
        return tempArr;
    }
    public renderChunk(fromPos: any, howMany: any) {
        this.chunkArray = [];
        this.chunkIndex = [];
        // console.log('howmany', howMany, ' fromPos', fromPos)
        let finalItem = fromPos + howMany;
        if (finalItem > this.totalRows)
            finalItem = this.totalRows;

        for (let i = fromPos; i < finalItem; i++) {
            this.chunkIndex.push((i * this.itemHeight) + 'px');
            // console.log(i, this.data[i])
            this.chunkArray.push(this.data[parseInt(i, 10)]);
        }
        // console.log('chunk array', this.chunkArray, this.data);
    }
    public onScroll(e: any) {
       // console.log('Scrolling');
        this.scrollTop = e.target.scrollTop;
        this.updateView(this.scrollTop);

    }
    public updateView(scrollTop: any) {
        let scrollPos = scrollTop ? scrollTop : 0;
        // console.log('this.screenItemsLen', this.screenItemsLen);
        // console.log('this.cachedItemsLen', this.cachedItemsLen);
        let first = (scrollPos / this.itemHeight) - this.screenItemsLen;
        let firstTemp = "" + first;
        first = +firstTemp < 0 ? 0 : +firstTemp;
        this.renderChunk(first, this.cachedItemsLen);
        this.lastRepaintY = scrollPos;
    }
    public filterInfiniteList(evt: any) {
        let filteredElems: Array<any> = [];
        this.data = this.cachedItems.slice();
        if (evt.target.value.toString() !== '') {
            this.data.filter(function (el: any) {
                for (let prop in el) {
                    if (el[prop].toString().toLowerCase().indexOf(evt.target.value.toString().toLowerCase()) >= 0) {
                        filteredElems.push(el);
                        break;
                    }
                }
            });
            // this.cachedItems = this.data;
            this.totalHeight = this.itemHeight * filteredElems.length;
            this.totalRows = filteredElems.length;
            this.data = [];
            this.data = filteredElems;
            this.updateView(this.scrollTop);
        } else if (evt.target.value.toString() === '' && this.cachedItems.length > 0) {
            this.data = [];
            this.data = this.cachedItems;
            this.totalHeight = this.itemHeight * this.data.length;
            this.totalRows = this.data.length;
            this.updateView(this.scrollTop);
        }
    }

    public getSelectedItems(coll: any): string {
        coll = sortBy(coll, [this.displayBy], 'asc');
        return coll.map((item: any) => (item[this.displayBy])).join(',');
    }

    public onClearAll() {
        this.onDeSelectAll.emit(this.selectedItems);
        this.selectedItems = [];
    }

    public trackByIndexFn(index, item) {
        return index; // or item.id
    }
}
