import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-spinner',
    template: `
    <div class="load-parent">
        <div class="load-child">
        <img src="./assets/img/squares1.gif" width="50" height="50" alt="Loading..."><br>
            <span style="font-size:90%">{{msg}}</span>
        </div>
    </div>`
})
export class SpinnerComponent {
    @Input() public msg: string = '';
}
