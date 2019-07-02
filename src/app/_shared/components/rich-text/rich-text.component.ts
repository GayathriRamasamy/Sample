import {
  Component, OnInit, ViewChild, ElementRef, Renderer2, Input,
  Output, AfterViewInit, EventEmitter, forwardRef, HostListener
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

const IS_FOCUSED = 'is-focused';
const IS_DISABLED = 'is-disabled';
const IS_INVALID = 'is-invalid';
const IS_DIRTY = 'is-dirty';

@Component({
  selector: 'app-rich-text',
  templateUrl: './rich-text.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RichTextComponent),
    multi: true
  }],
  styleUrls: ['./rich-text.component.scss']
})
export class RichTextComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  public bottomBorderStyle: Boolean = false;
  public contentEditableFlag: Boolean = true;
  public iconLeft: any;
  public iconLeft12: any;
  public iconLeft14: any;
  public textValue: String;

  @ViewChild('input') public inputEl: ElementRef; // input DOM element
  @ViewChild('mdllabelwidth') public mdllabelwidthEl: ElementRef;
  @Output() public valueEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input() public hintText: any;
  @Input() public quillShow: any;
  @Input() public requiredFlag: Boolean;
  @Input() public name;
  @Input() public readonly: Boolean;
  @Input() public label: String = '';  // Label value for input element
  @Input() public tooltip: String = '';  // Tooltip value for input element
  @Input() public showStar: Boolean = false;  // required value for input element
  @Input() public hideControlOnLostFocus = false;
  private _value: String; // Private variable for input value
  public onChange: any = Function.prototype; // Trascend the onChange event
  public onTouched: any = Function.prototype; // Trascend the onTouch event

  public quillOption = {
    toolbar: [
      ['bold', 'italic', 'underline'],        // toggled buttons

      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    ],
  };

  // Control Value Accessors for ngModel get
  get value(): any {
    return this._value;
  }

  // Control Value Accessors for ngModel set
  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  constructor(public router: ActivatedRoute) {
  }

  public ngOnInit() {
    this.contentEditableFlag = this.readonly === null ? false : this.readonly;
    if (this.requiredFlag) { this.requiredValidation(); }
    this.valueEmitter.emit();
  }

  public ngAfterViewInit() {
    this.iconLeft = this.mdllabelwidthEl.nativeElement.offsetWidth;
    this.iconLeft14 = this.mdllabelwidthEl.nativeElement.offsetWidth;
    this.iconLeft12 = this.mdllabelwidthEl.nativeElement.offsetWidth - this.mdllabelwidthEl.nativeElement.offsetWidth / 7;
    this.checkLabelPosition(this.value);
  }

  // Required for ControlValueAccessor interface
  public writeValue(value: any) {
    this._value = value;
    this.checkLabelPosition(value);
  }

  // Required forControlValueAccessor interface
  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  // Required forControlValueAccessor interface
  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  /**
   * Method to set the focus to the richtext editor
   * @param event it has the editors properties includes textvalue, range, oldvalue
   */
  public onFocus(event: FocusEvent) {
    this.quillShow = true;
    this.iconLeft = this.iconLeft12;
  }

  /**
   * Method to set the focus out from the richtext editor
   * @param editor it has the editors properties includes textvalue, range, oldvalue
   */
  public onFocusOut(editor) {
    if (!this.hideControlOnLostFocus) {
      return;
    }
    if (editor.range === null && editor.oldRange !== null) {
      if (document.querySelector('.ql-expanded') === null) {
        this.quillShow = false;
        this.textValue = this.textValue ? this.textValue.trim() : '';
        this.value = this.value === null || this.textValue.length === 0 ? null : this.value;
        if (this.requiredFlag) { this.requiredValidation(); }
      }
      this.checkLabelPosition(this.value);
    }
  }

  /**
   * Method to set the focus out from the richtext editor
   * @param editor it has the editors properties includes textvalue, range, oldvalue
   */
  public onSetQuillFocus(editor) {
    editor.focus();
  }

  /**
   * Method to set the text value when richtext editor value changes
   * @param editor it has the editors properties includes textvalue, range, oldvalue
   */
  public onContentChanges(editor) {
    this.value = editor.html;
    this.textValue = editor.text;
  }

  /**
   * Method to set the border validation for the input text
   */
  public requiredValidation() {
    if (this.value && this.value.length === 0) {
      this.bottomBorderStyle = true;
    } else {
      this.bottomBorderStyle = false;
    }
  }

  /**
   * Method to place the label if value is present in the editor
   */
  public checkLabelPosition(value) {
    let dirty = value && value.length > 0 && value !== null;
    if (dirty && this.iconLeft) {
      this.iconLeft = this.iconLeft12;
    } else if (!dirty && this.iconLeft) {
      this.iconLeft = this.iconLeft14;
    }
  }

  /**
   * Method to set the value on focus out
   */
  public setOnFocusOut() {
    this.quillShow = false;
    if (this.textValue === undefined) {
      this.value = this.value ? this.value : null;
    } else {
      this.textValue = this.textValue.trim();
      this.value = this.value === null || this.textValue.length === 0 ? null : this.value;
    }
    if (this.requiredFlag) { this.requiredValidation(); }
    this.checkLabelPosition(this.value);
  }

}
