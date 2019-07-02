import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appAlphaNumeric]'
})
export class AlphaNumericDirective {
    public pattern = new RegExp('^[A-Za-z0-9]*$');
    constructor(private el: ElementRef) {
        this.el.nativeElement.onpaste = (event: any) => {
            let clipboardDataTransfer = (event.originalEvent || event).clipboardData;
            let text = clipboardDataTransfer.getData('text/plain') || '';
            if (!this.pattern.test(text)) {
                event.preventDefault();
            }
        };
    }

    @HostListener('keydown', ['$event'])
    public onKeyDown(event) {
        let inp = String.fromCharCode(event.keyCode);
        if ((!event.shiftKey && /[0-9]/.test(inp)) || /[a-zA-Z]/.test(inp) ||
            [8, 9, 13, 27, 32, 46, 110].indexOf(event.keyCode) !== -1 || (event.keyCode >= 35 && event.keyCode <= 39)) {
            return;
        } else {
            event.preventDefault();
                    }
    }
}
