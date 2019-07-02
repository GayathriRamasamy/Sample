import { Directive, HostListener } from '@angular/core';
import { PumaDatePickerService } from './puma-date-picker.service';

/**
 * handles closing of date picker on clicking outside
 * document click
 */
@Directive({
    selector: '[close-puma-date-picker]'
})
export class ClosePumaDatePickerDirective {

    constructor(
        private pdp: PumaDatePickerService
    ) {

    }

    @HostListener('document:click', ['$event'])
    private closePumaDatePicker(event: MouseEvent) {
        if (this.pdp.selectedDatePicker && this.pdp.selectedElementRef) {
            if (!this.pdp.selectedElementRef.contains(event.target)) {
                this.pdp.selectedDatePicker.close();
            }
        }
    }
}
