import { Component, Input, OnInit } from '@angular/core';
import { Timeline, DataSet } from 'vis';

@Component({
  selector: 'app-timeline-chart',
  templateUrl: './timeline-chart.component.html',
  styleUrls: ['./timeline-chart.component.scss']
})
export class TimelineChartComponent implements OnInit {
  @Input() public data: any;
  @Input() public options: any;
  public timeline: any;

  constructor() { }

  public ngOnInit() {
    this.createTimeline();
  }

  public updateTimeLine(data, options) {
    this.timeline.itemsData.update(data);
    this.timeline.setOptions(options);
    this.timeline.fit();
  }

  public createTimeline(): void {
    let container = document.getElementById('timeline');

    // Create a DataSet (allows two way data-binding)
    let items = new DataSet([
      { id: 1, content: 'item 1', start: '2013-04-20' },
      { id: 2, content: 'item 2', start: '2013-04-14' },
      { id: 3, content: 'item 3', start: '2013-04-18' },
      { id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19' },
      { id: 5, content: 'item 5', start: '2013-04-25' },
      { id: 6, content: 'item 6', start: '2013-04-27' }
    ]);

    // Configuration for the Timeline
    let options = {};

    // Create a Timeline
    this.timeline = new Timeline(container, items, options);
  }
}
