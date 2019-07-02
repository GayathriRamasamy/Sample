import {
    Component, ElementRef, EventEmitter, forwardRef, Inject, InjectionToken, Input, OnInit, OnChanges, Optional,
    Output, Renderer2, SimpleChanges, ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { toBoolean } from '@angular-mdl/core/components/common/boolean-property';
import { toNumber } from '@angular-mdl/core/components/common/number.property';
import { noop } from '@angular-mdl/core/components/common/noop';
import { callNative } from '@angular-mdl/core/components/common/native-support';
import { NGXLogger } from 'ngx-logger';
import {FilterService} from '../../_services/+dashboard/filter.service';
export const DISABLE_NATIVE_VALIDITY_CHECKING = new InjectionToken<boolean>('disableNativeValidityChecking');

let nextId = 0;

const IS_FOCUSED = 'is-focused';
const IS_DISABLED = 'is-disabled';
const IS_INVALID = 'is-invalid';
const IS_DIRTY = 'is-dirty';

const initialRows = 1;
const maxRows = 3;
const initialScrollHeight = 25; // textarea line height

@Component({
    selector: 'iff-mdl-textfield',
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        '[class.mdl-textfield]': 'true',
        '[class.is-upgraded]': 'true',
        '[class.mdl-textfield--expandable]': 'icon',
        '[class.mdl-textfield--floating-label]': 'isFloatingLabel',
        '[class.has-placeholder]': 'placeholder'
    },
    styleUrls: ['./select.scss'],
    templateUrl: './iff.mdl.text.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        // tslint:disable-next-line:no-forward-ref
        useExisting: forwardRef(() => IffMdlTextFieldComponent),
        multi: true
    }],
})
export class IffMdlTextFieldComponent implements OnInit, ControlValueAccessor, OnChanges {
    // tslint:disable-next-line:variable-name
    public value_: any;
    public el: HTMLElement;
    public filterName = [];
    // tslint:disable-next-line:no-output-rename
    @Output('blur')
    public blurEmitter: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

    // tslint:disable-next-line:no-output-rename
    @Output('focus')
    public focusEmitter: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

    // tslint:disable-next-line:no-output-rename
    @Output('keyup')
    public keyupEmitter: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();
    @Output('changeSearchName')
    public changeSearchNameEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output('changeSearchTerm')
    public changeSearchTermEmitter: EventEmitter<any> = new EventEmitter<any>();

    // tslint:disable-next-line:no-output-rename
    @Output('keypress')
    public keyPressEmitter: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

    // tslint:disable-next-line:no-output-rename
    @Output('keydown')
    public keyDownEmitter: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

    // tslint:disable-next-line:no-output-rename
    @Output('paste')
    public PasteEventEmitter: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('input') public inputEl: ElementRef;
    @ViewChild('mdllabelwidth') public mdllabelwidthEl: ElementRef;
    // @Output() public mdllabelwidth: EventEmitter<any> = new EventEmitter<any>();
    public iconLeft: any;
    public iconLeft12: any;
    public iconLeft14: any;

    get value(): any { return this.value_; }
    // tslint:disable-next-line:adjacent-overload-signatures
    set value(v: any) {
        this.value_ = this.type === 'number' ? (v === '' ? null : parseFloat(v)) : v;
        this.onChangeCallback(this.value);
    }
    @Input() public hintText: string = '';
    @Input() public showStar: boolean = false;
    @Input() public autocompleteNope: boolean = false;
    @Input() public type = 'text';
    @Input() public label = '';
    @Input() public tooltip = '';
    @Input() public pattern;
    @Input() public min;
    @Input() public max;
    @Input() public step;
    @Input() public name;
    @Input() public id = `mdl-textfield-${nextId++}`;
    // tslint:disable-next-line:no-input-rename
    @Input('error-msg') public errorMessage;
    public onTouchedCallback: () => void = noop;
    public onChangeCallback: (_: any) => void = noop;
    // tslint:disable-next-line:no-inferrable-types
    public _disabled: boolean = false;
    @Input()
    get disabled(): boolean { return this._disabled; }
    set disabled(value) { this._disabled = toBoolean(value); }

    public _readonly: boolean = false;
    @Input()
    get readonly() { return this._readonly; }
    set readonly(value) { this._readonly = toBoolean(value); }

    public _required: boolean = false;
    @Input()
    get required() { return this._required; }
    set required(value) { this._required = toBoolean(value); }

    public _autofocus: boolean = false;
    @Input()
    get autofocus() { return this._autofocus; }
    set autofocus(value) { this._autofocus = toBoolean(value); }

    public _isFloatingLabel: boolean = false;
    @Input('floating-label')
    get isFloatingLabel() { return this._isFloatingLabel; }
    set isFloatingLabel(value) { this._isFloatingLabel = toBoolean(value); }

    @Input() public placeholder: string;
    @Input() public autocomplete = false;

    public _rows: number = null;
    @Input()
    get rows() { return this._rows; }
    set rows(value) { this._rows = toNumber(value); }

    public _maxrows: number = -1;
    @Input()
    get maxrows() { return this._maxrows; }
    set maxrows(value) { this._maxrows = toNumber(value); }
    @Input() public icon: string;

    @Input() public tabindex: number = null;

    @Input() public maxlength: number = null;
    @Input() public minLength: number = null;
    @Input() public showHintTextOnFocusIcon: boolean = false;

    // @experimental
    private _disableNativeValidityChecking: boolean = false;
    private showHintTextOnFocus = true;
    @Input()
    get disableNativeValidityChecking() { return this._disableNativeValidityChecking; }
    set disableNativeValidityChecking(value) { this._disableNativeValidityChecking = toBoolean(value); }

    @Input() public floatingLabel;

    constructor(
        private filterService: FilterService,
        private renderer: Renderer2,
        private elmRef: ElementRef,
        private logger: NGXLogger,
        @Optional() @Inject(DISABLE_NATIVE_VALIDITY_CHECKING) private nativeCheckGlobalDisabled: boolean) {
        this.el = elmRef.nativeElement;
    }

    public ngOnInit() {
        this.showHintTextOnFocus = this.hintText && this.hintText.length > 0;
    }

    // tslint:disable-next-line:use-life-cycle-interface
    public ngAfterViewInit() {
        // this.iconLeft = this.mdllabelwidthEl.nativeElement.offsetWidth;
        // this.iconLeft14 = this.mdllabelwidthEl.nativeElement.offsetWidth;
        // this.iconLeft12 = this.mdllabelwidthEl.nativeElement.offsetWidth - this.mdllabelwidthEl.nativeElement.offsetWidth / 7;
    }

    public writeValue(value: any): void {
        this.value_ = value;
        //   this.checkDirty();
        if (value) {
            this.renderer.addClass(this.el, IS_DIRTY);
            this.doResize();
        }
    }

    public registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.checkDisabled();
        this.doResize();
    }

    public setFocus() {
        if (!this.inputEl) {
            return;
        }
        callNative(this.inputEl.nativeElement, 'focus');
    }

    public onPaste(event) {
        this.PasteEventEmitter.emit(event);
    }
    public onKeyDown(event: KeyboardEvent) {
        this.keyDownEmitter.emit(event);
    }

    public onFocus(event: FocusEvent) {
        // this.showHintTextOnFocus = this.hintText && this.hintText.length > 0 ? true : false;
        this.renderer.addClass(this.el, IS_FOCUSED);
        this.focusEmitter.emit(event);
        this.iconLeft = this.iconLeft12;
    }

    public onBlur(event: FocusEvent) {
        // this.showHintTextOnFocus = this.hintText && this.hintText.length > 0 ? false : false;
        this.renderer.removeClass(this.el, IS_FOCUSED);
        this.onTouchedCallback();
        this.blurEmitter.emit(event);
        this.iconLeft = this.iconLeft14;
        this.inputEl.nativeElement.style = "";
    }

    public onKeyup(event: KeyboardEvent) {
        event.stopPropagation();
        this.keyupEmitter.emit(event);
        //     this.doResize();
    }
    public ngModelChange(event) {
        // this.filterName.push(event.target);
        // this.filterService.getfilterName( this.filterName);
        this.keyPressEmitter.emit(event);
        this.changeSearchNameEmitter.emit(event.target.value);
        this.changeSearchTermEmitter.emit(event.target.value);
    }
    public checkDisabled() {
        if (this.disabled) {
            this.renderer.addClass(this.el, IS_DISABLED);
        } else {
            this.renderer.removeClass(this.el, IS_DISABLED);
        }
    }

    public checkValidity() {
        // check the global setting - if globally disabled do no check
        if (this.nativeCheckGlobalDisabled === true) {
            return;
        }
        // check local setting - if locally disabled do no check
        if (this.disableNativeValidityChecking) {
            return;
        }
        if (this.inputEl && this.inputEl.nativeElement.validity) {
            if (!this.inputEl.nativeElement.validity.valid) {
                this.renderer.addClass(this.el, IS_INVALID);
            } else {
                this.renderer.removeClass(this.el, IS_INVALID);
            }
        }
    }

    public checkDirty() {
        let dirty = this.inputEl && this.inputEl.nativeElement.value && this.inputEl.nativeElement.value.length > 0;
        if (dirty) {
            this.renderer.addClass(this.el, IS_DIRTY);
            this.iconLeft = this.iconLeft12;
        } else {
            this.renderer.removeClass(this.el, IS_DIRTY);
            // this.iconLeft = this.iconLeft14;
        }

    }

    public keydownTextarea($event: KeyboardEvent) {
        let currentRowCount = this.inputEl.nativeElement.value.split('\n').length;
        if ($event.keyCode === 13) {
            if (currentRowCount >= this.maxrows && this.maxrows !== -1) {
                $event.preventDefault();
            }
        }
    }

    // hm only for test purposes to simulate a change to the input field that will change the
    // model value.
    public triggerChange(event: Event) {
        this.value = (event.target as HTMLInputElement).value;
        this.onTouchedCallback();
    }

    public doResize() {
        let rows;
        setTimeout(() => {
            if (this.inputEl) {
                let textarea = this.inputEl.nativeElement;
                if (textarea.value && textarea.value.split('\n').length) {
                    if (textarea.value.split('\n').length > 1) {
                        rows = textarea.value.split('\n').length > 3 ? maxRows : textarea.value.split('\n').length;
                    } else {
                        rows = textarea.value.split('\n').length === 1 && textarea.value.length > 270 ? maxRows
                            : textarea.value.split('\n').length === 1 && textarea.value.length > 180 ? 2
                                // tslint:disable-next-line:max-line-length
                                : textarea.value.split('\n').length === 1 && textarea.value.length > 90 ? textarea.value.split('\n').length : initialRows;
                    }
                    textarea.rows = rows;
                } else if (!textarea.value) {
                    textarea.rows = initialRows;
                }
                // textarea.style.cssText = 'height:auto; padding:0';
                // textarea.style.cssText = 'max-height: 80px';
                let scrollHeight = textarea.scrollHeight === 0 ? rows * initialScrollHeight : textarea.scrollHeight;
                // textarea.style.cssText = 'height:' + scrollHeight + 'px';
                if (textarea.scrollHeight !== 0) {
                    // rows = textarea.scrollHeight > 60 ? 3 : textarea.scrollHeight > 40 ? 2 : 1;
                    rows = textarea.scrollHeight > 132 ? 6 : textarea.scrollHeight > 110 ? 5 : textarea.scrollHeight > 88 ? 4 :
                        textarea.scrollHeight > 66 ? 3 : textarea.scrollHeight > 44 ? 2 : 1;
                    textarea.rows = rows;
                }
                // if (scrollHeight < maxRows * initialScrollHeight || textarea.scrollHeight < 70 && textarea.scrollHeight !== 0) {
                    // textarea.style.cssText = 'overflow: hidden';
                // }
            }
        }, 10);
    }
}

// tslint:disable-next-line:max-classes-per-file
