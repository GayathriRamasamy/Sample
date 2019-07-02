import { Component, Input } from '@angular/core';

@Component({
    selector: 'tiltlabel',
    templateUrl: './tiltlabel.component.html',
    styleUrls: ['./tiltlabel.component.scss']
})
export class TiltlabelComponent {

    @Input() public status;
}
