import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../search.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Config } from 'src/app/_config/dashboard.config';
import { DashboardService } from "src/app/_services/+dashboard/dashboard.service";
import { FilterService } from '../../../_services/+dashboard/filter.service';
import { SpdFilterComponent } from '../../../dashboard/filter/scentPortfolio-filter/spd-filter.component';
import { ToastrService } from 'ngx-toastr';
import { InformationMessage } from '../../messages/InformationMessage';


@Component({
  selector: 'app-saved-searches',
  templateUrl: './saved-searches.component.html',
  styleUrls: ['./saved-searches.component.scss']
})
export class SavedSearchesComponent implements OnInit {
  public listId = null;
  @Input() public searchModule: String = '';
  @Input() public key: String = '';
  @Input() public inSearch: String = '';
  @Input() public savedSearchList: any = [];
  @Input() public seletedFacetCollection: any = [];
  @Input() public selected: any = [];
  @Input() public set inputSelectedSearch(item: any) {
    // this.appBroadcastService.onUpdateAppSpinnerPrompt(InformationMessage.Loading);
    this.selectedSearch = item;
    this.selectedName = item.SearchName;
    this.listId = item.ID;
  }
  private selectedName: String = '';
  public selectedSearch: any = {};
  private selectedFilters: any = {};
  public deleteBtn = Config.buttons['delete'];
  public cancelBtn = Config.buttons['cancel'];
  public loadBtn = Config.buttons['load'];
  public filterName: String = '';
  public filterTerm: String = '';
  public filters: any = {};
  public filterObjects = {};

  public modalLabel = Config.filterLabel;
  constructor(private searchService: SearchService, public activeModal: NgbActiveModal,
    public dashboardService: DashboardService, public filterService: FilterService, private toastSservice: ToastrService) { }

  ngOnInit() {
    this.getSavedSearch();
  }
  private getSavedSearch() {
    if(this.listId !== null) {
      this.searchService.fetchSearchFilter(this.listId).subscribe((response) => {
        if (typeof response.SearchFilters === 'string') {
          response.SearchFilters = JSON.parse(response.SearchFilters);
        }
        this.selectedFilters = response;
        this.selectedSearch.SearchTerm = response.SearchTerm;
      });
    }
  }
  onKeyPress(evnt) {

    this.filterName = evnt;
  }
  onKeyPressTerm(evnt) {
    this.filterTerm = evnt;
  }
  public onSave() {
    this.filters.SearchName = this.filterName;
    this.filters.SearchTerm = this.filterTerm;
    this.filters.filterContent = this.selected;
    this.filterService.putfilters(this.filters).subscribe(value => {
      this.activeModal.close(value);
      this.toastSservice.success(InformationMessage.savedFilter);
      this.filterService.onUpdateScentPortfolioSavedDashboardSearch.next();
    });
  }
  private save() {

  }
  // To be implemented
  public onDeleteSavedSearch() {
    return null;
  }
  // To be implemented
  public onLoad() {
    return null;
  }
}
