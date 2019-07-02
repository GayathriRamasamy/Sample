import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lib-date-viewer',
  template: `
  <div class="TEST">{{dateValue | date:'dd MMM yyyy'}}</div>
  `,
  styles: []
})
export class DateViewerComponent implements OnInit {
  @Input() public dateValue: string;
  constructor() { }

  public ngOnInit() {
  }

}
