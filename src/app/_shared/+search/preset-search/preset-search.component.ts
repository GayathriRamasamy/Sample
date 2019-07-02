import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FilterService } from "../../../_services/+dashboard/filter.service";
import { SpdFilterComponent } from "../../../dashboard/filter/scentPortfolio-filter/spd-filter.component";
import { AppCancelConfirmationDialogService } from "../../../app.cancel.confirmation.dialog.service";
import { DashboardService } from "src/app/_services/+dashboard/dashboard.service";
@Component({
  // tslint:disable-next-line:component-selector
  selector: "myprefix-preset-search",
  templateUrl: "./preset-search.component.html",
  styleUrls: ["./preset-search.component.scss"]
})
export class PresetSearchComponent implements OnInit {

  public seletedFacetCollection: any = [];
  public filterId = null;
  @Input() public searchModule: string = '';
  @Input() public key: string = '';
  @Input() public set inputSelectedSearch(item: any) {
      this.selectedSearch = item;
      this.selectedName = item.SearchName;
      this.filterId = item.ID;
  }
  private selectedName: string = '';
  public selectedSearch: any = {};
  private sub: any;
  @Input() public savedSearchList: any = [];
  private selectedFilters: any = {};

  constructor(
    public activeModal: NgbActiveModal,
    public filterService: FilterService,
    private conformation: AppCancelConfirmationDialogService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.getSavedSearch();
  }
  private getSavedSearch() {
    this.filterService
      .fetchSearchFilter(this.filterId)
      .subscribe(response => {
        this.selectedFilters = JSON.parse(response.SearchFilters);
        this.filterId = response.ID;
        if (typeof response.SearchFilters === "string") {
          response.SearchFilters = JSON.parse(response.SearchFilters);
        }
        this.selectedSearch.SearchTerm = response.SearchTerm;
        this.selectedSearch.SearchName = response.SearchName;
        this.seletedFacetCollection = this.selectedFilters.selectedFacetCollection;
      });

  }

  public onLoad() {
    this.filterService.getPresetSelectedFacets(this.seletedFacetCollection);
    this.filterService.getPresetFilters(this.selectedFilters.selected);
    this.filterService.onUpdateScentPortfolioSavedDashboardSearch.next();
    this.activeModal.close();
  }

  public onDeleteSavedSearch() {
    this.conformation.confirm("Do you want to delete?").then(respose => {
      if (respose === true) {
        this.filterService.deleteFilter(this.filterId).subscribe(response => {
          this.activeModal.close();
          this.filterService.onUpdateScentPortfolioSavedDashboardSearch.next();
        });
      }
      this.activeModal.close("close");
    });
  }

  public onChangeSavedSearch(selecteSearch) {
    // this.appBroadcastService.onUpdateAppSpinnerPrompt(InformationMessage.Loading);
    this.filterId = selecteSearch.ID;
    this.getSavedSearch();
    this.filterService.onUpdateScentPortfolioSavedDashboardSearch.next();
  }

}
