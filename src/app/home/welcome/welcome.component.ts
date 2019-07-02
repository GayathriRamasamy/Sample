import { Component, OnInit, ViewChild } from '@angular/core';
import { AppStateService } from '../../_services';
import { AppDataService } from 'src/app/_services/app.data.service';
import { NGXLogger } from 'ngx-logger';
import { MatTableDataSource, MatSort } from '@angular/material';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public userInfo: any = {};
  @ViewChild(MatSort) public sort: MatSort;

  public displayedColumns: string[] = ['ProjectId', 'ProjectName', 'ProjectDesc'];
  public dataSource;
  constructor(private appState: AppStateService, private appData: AppDataService, private logger: NGXLogger) {
  }
  public ngOnInit() {
    this.appData.get(this.appData.url.projects, []).subscribe((value) => {
      this.dataSource = new MatTableDataSource(value);
      this.dataSource.sort = this.sort;
          }, (error) => {
      console.log(error);
    });
  }

}
