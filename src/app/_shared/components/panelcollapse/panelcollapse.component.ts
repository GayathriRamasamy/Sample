import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-panelcollapse',
    templateUrl: './panelcollapse.component.html'
})
export class PanelCollapseComponent implements OnInit {
    @Input() public panelCollapsed;
    @Input() public label;
    @Output() public closePanel: EventEmitter<any> = new EventEmitter<any>();
    constructor() { }
    public ngOnInit() {

    }
    public panelCollapse() {
        this.panelCollapsed = !this.panelCollapsed;
        let data = {
            collapse: this.panelCollapsed,
            label: this.label
        };
        this.closePanel.emit(data);
    }
}
