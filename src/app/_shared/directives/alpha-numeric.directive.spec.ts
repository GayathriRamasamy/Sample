import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { AlphaNumericDirective } from './alpha-numeric.directive';

@Component({
    template: `<input type="text" alphaNumeric>`
})
class TestAlphaNumericComponent {
}


describe('Directive: Alpha Numeric', () => {

    let component: TestAlphaNumericComponent;
    let fixture: ComponentFixture<TestAlphaNumericComponent>;
    let inputEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestAlphaNumericComponent, AlphaNumericDirective]
        });
        fixture = TestBed.createComponent(TestAlphaNumericComponent);
        component = fixture.componentInstance;
        inputEl = fixture.debugElement.query(By.css('input'));
    });

    it('keydown input when key is alpha', () => {
        let event = {
            altKey: false,
            ctrlKey: false,
            shiftKey: true,
            key: 'e',
            isTrusted: true,
            code: 'KeyE',
            keyCode: 69,
            preventDefault() {
                return true;
            }
        };
        inputEl.triggerEventHandler('keydown', event);
        fixture.detectChanges();
        // expect(inputEl.nativeElement.style.backgroundColor).toBe('blue');
    });
    it('keydown input when key is numeric', () => {
        let event = {
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            key: '3',
            isTrusted: true,
            code: 'Digit3',
            keyCode: 51,
            preventDefault() {
                return true;
            }
        };
        inputEl.triggerEventHandler('keydown', event);
        fixture.detectChanges();
        // expect(inputEl.nativeElement.style.backgroundColor).toBe('blue');
    });
    it('keydown input when key is not alphanumeric', () => {
        let event = {
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            key: 'Shift',
            isTrusted: true,
            code: 'ShiftRight',
            keyCode: 16,
            preventDefault() {
                return true;
            }
        };
        inputEl.triggerEventHandler('keydown', event);
        fixture.detectChanges();
        // expect(inputEl.nativeElement.style.backgroundColor).toBe('blue');
    });
    it('keydown input when key is not up/down/right/left arrow', () => {
        let event = {
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            key: 'ArrowLeft',
            isTrusted: true,
            code: 'ArrowLeft',
            keyCode: 37,
            preventDefault() {
                return true;
            }
        };
        inputEl.triggerEventHandler('keydown', event);
        fixture.detectChanges();
        // expect(inputEl.nativeElement.style.backgroundColor).toBe('blue');
    });
});
