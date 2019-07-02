import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-loading',
    template: `
    <div>
        <div style="text-align:center">
            <img src="./assets/img/squares1.gif" width="{{size}}" alt="Loading..."><br>
            <span style="font-size:90%">{{msg}}</span>
        </div>
    </div>`
})

export class AppLoadingComponent {
    @Input() public size: string = '40';
    @Input() public msg: string = 'Loading...';
}
