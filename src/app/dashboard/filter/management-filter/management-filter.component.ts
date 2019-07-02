import { Component, OnInit } from '@angular/core';
import { managementFilterConfig } from '../../../_config/filter/managementFilter.config';
import { scentportfolioFilterConfig } from '../../../_config/filter/scentportfolioFilter.config';
import {
  map, orderBy, sortBy, uniqBy, filter, union, pullAllBy,
  intersectionBy, cloneDeep, mapValues, flattenDeep, findIndex, isEqual, round,
  differenceBy, each, find,
} from 'lodash';
import { commonFilterConfig } from "../../../_config/filter/commonFilter.config";
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-management-filter',
  templateUrl: './management-filter.component.html',
  styleUrls: ['./management-filter.component.scss']
})
export class ManagementFilterComponent implements OnInit {
  public debouncer: Subject<any> = new Subject();
  public debounceSubscription: Subscription;
  public Consideration = true;
  public Oppertunity = false;
  public project = false;
  public fragrance = false;
  public date = false;
  public commonConfig;
  public selected: any = {};
  selectedSubTab: any;
  public selectedFacetCollection: any = [];
  public configdata: any;
  public configDataHeader: any;
  public initialFilterData: any = {};
  cloneMaster: any = {};
  cloneSelected: any = {};
  constructor() { }

  ngOnInit() {
    this.configDataHeader = scentportfolioFilterConfig[0];
    this.configdata = managementFilterConfig[0];
    this.commonConfig = commonFilterConfig[0];
    this.selectedSubTab = "Consideration";
    this.fetchAllMasterData();
  }
  public fetchAllMasterData() {
    this.initialFilterData.costbook = this.addFieldsForSelectedFact( orderBy(this.configdata.consideration.costBookData,
       "Description", this.commonConfig.acending), 'Costbook', 'Description') ;
  this.cloneMaster = cloneDeep(this.initialFilterData);

}

private addFieldsForSelectedFact(coll: any, groupName: string, displayFieldName: any, showGroupName: boolean = false) {
  if (coll) {
      coll.map((item: any) => {
          item.isChecked = false;
          item.GroupName = groupName;
          item.DisplayName = item[displayFieldName];
          item.showGroupName = showGroupName;
          return item;
      });
  }
  return coll;
}
  public navigateSubTab(tab) {
    if (tab === "Consideration") {
      this.Consideration = true;
      this.Oppertunity = false;
      this.project = false;
      this.fragrance = false;
      this.date = false;
    }
    if (tab === "Oppertunity") {
      this.Consideration = false;
      this.Oppertunity = true;
      this.project = false;
      this.fragrance = false;
      this.date = false;
    }
    if (tab === "Project") {
      this.Consideration = false;
      this.Oppertunity = false;
      this.fragrance = false;
      this.project = true;
      this.date = false;
    }
    if (tab === "Fragrance") {
      this.Consideration = false;
      this.Oppertunity = false;
      this.fragrance = true;
      this.project = false;
      this.date = false;
    }
    if (tab === "Time & Date") {
      this.Consideration = false;
      this.Oppertunity = false;
      this.fragrance = false;
      this.project = false;
      this.date = true;
    }
    this.selectedSubTab = tab;

  }
  public onAddCostBook(event) {
  this.cloneSelected.costbook = this.selected.costbook;
  this.assignSelectedFacetColletion();
  }
  public onSelectAllCostBook(event) {
    this.cloneSelected.costbook = this.selected.costbook;
    }
   public onRemoveCostBook(event) {
    this.cloneSelected.costbook = this.selected.costbook;
    this.assignSelectedFacetColletion();
    }
   public onRemoveAllCostBook(event) {
    this.cloneSelected.costbook = this.selected.costbook;
     }
     private assignSelectedFacetColletion() {
      let temp = [];
      mapValues(this.cloneSelected, (item: any) => {
          // tslint:disable-next-line:no-unused-expression
          item && temp.push(item);
      });
      temp = flattenDeep(temp);
      this.selectedFacetCollection = cloneDeep(temp);
      this.debouncer.next({
          selectedFacetCollection: this.selectedFacetCollection,
          selected: cloneDeep(this.selected),
      });
  }

  // to be implemented
onClickApplyFilters() {
  return null;
  }
  // to be implemented
  onClickCancelFilters() {
  return null;
  }

  // to be implemented
  onClickResetFilters() {
  return null;
  }
}
