import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TagModel } from 'ngx-chips/core/accessor';
import { AppDataService } from '../../../_services/app.data.service';
const CONTACT_PICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line:no-forward-ref
    useExisting: forwardRef(() => PeoplePickerComponent),
    multi: true
};
@Component({

    selector: 'app-people-picker',
    templateUrl: './people-picker.component.html',
    providers: [CONTACT_PICKER_VALUE_ACCESSOR]

})

export class PeoplePickerComponent implements OnInit {
    @Input() public PlaceHolder = '';
    @Input() public bindModelData = new Array();
    @Input() public Users = new Array();
    @Input() public User: any;
    @Input() public UserId: string;
    @Input() public DisplayName: string;
    @Input() public LimitItems = 5;
    @Input() public Disabled: false;
    @Input() public appendToBody = false;
    // public entApiUrl: string;
    @Output() public peopleAdded = new EventEmitter<any>();
    @Output() public peopleRemoved = new EventEmitter<any>();
    public onChange: (_: any) => {};
    public onTouched: () => {};
    private _model;

    constructor(public appData: AppDataService) { }
    get model() {
        return this._model;
    }

    set model(val) {
        this._model = val;
        this.onChange(val);
    }

    public ngOnInit() {
        // this.entApiUrl = AppSettings.ENT_SVC_URL;
        if (this.User && this.Users.length === 0) {
            if (this.User.UserId || this.User.Id) {
                this.Users.push({ display: this.User.DisplayName, value: this.User.UserId ? this.User.UserId : this.User.Id });
            }
        } else if (this.UserId && this.DisplayName && this.Users.length === 0) {
            this.Users.push({ display: this.DisplayName, value: this.UserId });
        }
    }
    public writeValue(val: any) {
        this._model = val;
    }
    public registerOnChange(fn) {
        this.onChange = fn;
    }
    public registerOnTouched(fn) {
        this.onTouched = fn;
    }

    public requestAutocompleteItems = (text: string) => {
        return this.appData.get(this.appData.url.ADPeoplePicker, [text])
            .map((data) => data.map((item) => ({ display: item.displayName, value: item })));
    }

    /**
     * Matching input value for filtering contents of the dropdown.
     * @param value value to match
     * @param target target element
     */
    public matcherFunction(value: string, target: TagModel): boolean {
        return true;
    }

    public onItemAdded(item) {
        this.peopleAdded.emit(item);
        // this.Users = [];
        // this.Users.push({ display: item.display, value: item.value.Id });
    }

    public onItemRemove(item) {
        let index = this.Users.indexOf(item);
        if (index > -1) {
            this.Users.splice(index, 1);
        }
        this.peopleRemoved.emit(item);
    }
}
