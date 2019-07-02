import { AppStateService } from './../_services/app.state.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public users;
  public currentUser;
  public today = new Date();
  public text = "";
  public data = [];
  public info = {};
  public projectCollapse = true;

  constructor(private appState: AppStateService) {

  }
  public ngOnInit() {
    this.currentUser = this.appState.get(this.appState.stateId.userInfo);
    this.data.push({
      'id': 1,
      group: 1,
      // group: "X",
      'PlanType': 1001,
      'content': 'Project Startted' + ' on ' + '2013-04-20',
      'start': '2013-04-20'
    },
      {
        'id': 2,
        group: 2,
        // group: "X",
        'PlanType': 1002,
        'content': 'Project Startted' + ' on ' + '2013-04-20',
        'start': '2014-04-20'
      });
    this.info = {
      'options': {
        min: '2013-04-20',
        max: '2019-04-20',
        width: '100%',
        height: '200px',
        margin: {
          item: 20
        }
      }
    };
  }
  public closepanel(data) {
    this.projectCollapse = !data.collapse;
  }
}
