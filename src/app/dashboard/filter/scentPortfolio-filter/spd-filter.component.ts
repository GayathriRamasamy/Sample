import { Component, OnInit, EventEmitter, Output, Input, ViewChild, } from "@angular/core";
import { scentportfolioFilterConfig, SCENTPORTFOLIO_FILTER_MAPPING_CONFIG } from "../../../_config/filter/scentportfolioFilter.config";
import { commonFilterConfig } from "../../../_config/filter/commonFilter.config";
import { DecimalPipe } from '@angular/common';
import {
  map, orderBy, sortBy, uniqBy, filter, union, pullAllBy,
  intersectionBy, cloneDeep, mapValues, flattenDeep, findIndex, isEqual, round,
  differenceBy, each, find,
} from 'lodash';
import { DashboardService } from "src/app/_services/+dashboard/dashboard.service";
import { FilterService } from "src/app/_services/+dashboard/filter.service";

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { DataFilterSettings } from "src/app/_services/+dashboard/modal-setting";
import { AppBroadCastService, AppStateService, AppDataService } from "src/app/_services";
import { forkJoin } from "rxjs/internal/observable/forkJoin";
import { PumaMultiSelect } from "src/app/_shared/components/puma-multiple-select/puma-multiselect.component";
import { FacetComponent } from "src/app/_shared/components/facet/facet.component";
import { SliderComponent } from "src/app/_shared/components/slider/slider.component";
import { debug } from "util";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-scentPortfolio-filter",
  templateUrl: "./spd-filter.component.html",
  styleUrls: ["./spd-filter.component.scss"]
})
export class SpdFilterComponent implements OnInit {
  public debouncer: Subject<any> = new Subject();
  public debounceSubscription: Subscription;
  subCategories = "catogory";
  public lastSearch = [];
  public selectedFacetCollection: any = [];
  public presetFilter: any = {};
  public configData;
  public cloneMasterCategory: any;
  public cloneMasterbenefitPlatformOptions: any;
  public cloneMasterSales: any;
  public cloneMasterExclusivity: any;
  public cloneMasterShowOptions: any;
  public cloneMasterTestResults: any;
  public commonConfig;
  public mnc: any = {};
  public projectPotential: any = {};
  public selected: any = {};
  public list: any = {};
  public presetFiltersData;
  public resetMNCValue = [];
  public initialFilterData: any = {};
  public cloneMaster: any = {};
  public cloneSelected: any = {};
  check: Object[] = [];
  public MaxTitle = '(USD/kg)';
  private defaultCurrencyCode = 'USD';
  selectedFilters: any = {};
  subjectValues: DataFilterSettings;
  public savedSearchKey: string = '';
  public defaultSettings = {
    singleSelection: false,
    text: "All",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    showSearchFilter: true,
    showCheckAll: false,
    badgeShowLimit: 20,
    maxHeight: 250,
    lazyLoading: true
  };
  public settings = {
    singleSelection: false,
    text: "All",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    showSearchFilter: true,
    showCheckAll: false,
    badgeShowLimit: 99,
    lazyLoading: true
  };
  fieldsOptions = {
    codeBasedOptions: ['Appropriate Region', 'Appropriate Country', 'Test Countries', 'Test Region'],
    descBasedOptions: ['Category', 'SubCategory', 'Other Creative', 'EndUse', 'Product Numbers', 'Perfumer', "Exclusivity", 'Lead Creative', 'Project Status'],
    idBasedOptions: ["Sales", "Test Result", "Show Options"]
  }
  alreadySelectedFilters: any;
  @ViewChild(PumaMultiSelect) private pumaMulitiSelectedComponent: PumaMultiSelect;
  @ViewChild(SliderComponent) private sliderComponent: SliderComponent;


  @ViewChild(FacetComponent) public facetCom: FacetComponent;
  @Input() public key: string;
  public filterKey: string = 'savedSelectedFilters'

  min: number = 0;
  max: number = 20;

  minPotential: number = 0;
  maxPotential: number = 1000;

  // @Input() public set mncRange(value: any) {
  //   this.mnc.rangeValue = value;
  //   this.resetMNCValue = value;
  //   this.projectPotential.rangeValue = value;
  // }
  @Input() public set selectedFacets(value: any) {
    this.alreadySelectedFilters = value;
  }
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onFilterChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onApplyFilters: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onCancelFilters: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onResetFilters: EventEmitter<any> = new EventEmitter<any>();

  constructor(private dashboardService: DashboardService, private appData: AppDataService,
    private filterService: FilterService, private appBroadcastService: AppBroadCastService, private appState: AppStateService) {
    this.debounceSubscription = this.debouncer
      .subscribe((value) => {
        this.onFilterChange.emit(value)
      });
  }

  ngOnInit() {
    this.configData = scentportfolioFilterConfig[0];
    this.commonConfig = commonFilterConfig[0];
    // this.featchFilterData();
    // tslint:disable-next-line:max-line-length
    this.fetchAllMasterData();
    // this.initilizeSelectedFilters();

    // this.selected.subCategories = [];
    this.filterService.presetFilters.subscribe(data => {
      this.presetFilter = data;
      this.selected = cloneDeep(this.presetFilter);
      if (data != null) {
        this.initilizeSelectedFilters();
      }
    });

    this.filterService.categoryList.subscribe(value => {
      if (Object.keys(value)) {
        if (value.selectedCategoryList) {
          if (Object.values(value.selectedCategoryList).length) {
            this.changeCategory(cloneDeep(value.selectedCategoryList));
          }
        }
      }
    });
    this.dashboardService.updateFilterSettings.subscribe(values => {
      this.selectedFilters = values.filters;
    });
  }


  public fetchAllMasterData() {
    let promiseArray = [
      this.appData.getCached(this.appData.filterUrl.categories, []),
      this.appData.getCached(this.appData.filterUrl.subCategories, []),
      this.appData.getCached(this.appData.filterUrl.philosophy, []),
      this.appData.getCached(this.appData.filterUrl.inspirationBrand, []),
      this.appData.getCached(this.appData.filterUrl.inspirationBrandVariant, []),
      this.appData.getCached(this.appData.filterUrl.regions, []),
      this.appData.getCached(this.appData.filterUrl.contries, []),
      this.appData.getCached(this.appData.filterUrl.olfactiveFamily, []),
      this.appData.getCached(this.appData.filterUrl.olfactiveSubFamily, []),
      this.appData.getCached(this.appData.filterUrl.keywords, []),
      this.appData.getCached(this.appData.filterUrl.descriptors, []),
      this.appData.getCached(this.appData.filterUrl.creativeCenter, []),
      this.appData.getCached(this.appData.filterUrl.perfumers, []),
      this.appData.getCached(this.appData.filterUrl.sdm, []),
      this.appData.getCached(this.appData.filterUrl.endUse, []),
      this.appData.getCached(this.appData.filterUrl.projectTypes, []),
      this.appData.getCached(this.appData.filterUrl.consumerBenefitPlatforms, []),
      this.appData.getCached(this.appData.filterUrl.opportunityOwner, []),
      this.appData.getCached(this.appData.filterUrl.projectOwner, []),
      this.appData.getCached(this.appData.filterUrl.projectManager, []),
      this.appData.getCached(this.appData.filterUrl.projectStatus, []),
      this.appData.getCached(this.appData.filterUrl.finalResults, []),
      this.appData.getCached(this.appData.filterUrl.segments, []),
    ];
    setTimeout(() => {
      this.appBroadcastService.onUpdateAppSpinnerPrompt("Loading");
    }, 1000);
    forkJoin(promiseArray).subscribe((results: any) => {
      this.initialFilterData.category = this.addFieldsForSelectedFact(results[0], 'Category', 'Description');
      this.filterService.categoryList.next({
        initialCategoryList: this.initialFilterData.category,
        selectedCategoryList: {},
      });
      this.initialFilterData.subCategories = this.addFieldsForSelectedFact(orderBy(results[1], 'SubCategory', this.commonConfig.ascending), 'SubCategory', 'Description');
      this.initialFilterData.philosophy = this.addFieldsForSelectedFact(orderBy(results[2],
        "Description", this.commonConfig.ascending), 'Philosophy', 'Description');
      this.initialFilterData.cfBrandInspiration = this.addFieldsForSelectedFact(orderBy(results[3],
        "Description", this.commonConfig.ascending), 'Inspiration Brand', 'Description');
      this.initialFilterData.cfBrandVariantInspiration = this.addFieldsForSelectedFact(orderBy(results[4],
        "Description", this.commonConfig.ascending), 'Inspiration Brand Variant', 'Description');
      this.initialFilterData.suggestedRegion = this.addFieldsForSelectedFact(orderBy(results[5],
        "Region", this.commonConfig.ascending), 'Appropriate Region', 'Code');
      let testRegion = cloneDeep(this.initialFilterData.suggestedRegion);
      this.initialFilterData.testRegion = this.addFieldsForSelectedFact(orderBy(testRegion,
        "Region", this.commonConfig.ascending), 'Test Region', 'Code');
      this.appState.set('RegionData', this.initialFilterData.testRegion);
      this.initialFilterData.suggestedCountries = this.addFieldsForSelectedFact(orderBy(results[6],
        "Country", this.commonConfig.ascending), 'Appropriate Country', 'Description');
      let testCountries = cloneDeep(this.initialFilterData.suggestedCountries);
      this.initialFilterData.testCountries = this.addFieldsForSelectedFact(orderBy(testCountries,
        "Country", this.commonConfig.ascending), 'Test Countries', 'Description');
      this.initialFilterData.olfactiveFamilyData = this.addFieldsForSelectedFact(orderBy(results[7],
        "Description", this.commonConfig.ascending), 'Olfactive Family', 'Description');
      this.initialFilterData.olfactiveSubFamilyData = this.addFieldsForSelectedFact(orderBy(results[8],
        "Description", this.commonConfig.ascending), 'Olfactive SubFamily', 'Description');
      this.initialFilterData.keyword = this.addFieldsForSelectedFact(orderBy(results[9],
        "Description", this.commonConfig.ascending), 'Keyword', 'Description');
      this.initialFilterData.descriptors = this.addFieldsForSelectedFact(orderBy(results[10],
        "Description", this.commonConfig.ascending), 'Descriptors', 'Description');
      let leadCreativeData = results[11];
      let otherCreativeData = results[11];
      this.initialFilterData.leadCreative = this.addFieldsForSelectedFact(orderBy(leadCreativeData,
        "Description", this.commonConfig.ascending), 'Lead Creative', 'Description');
      otherCreativeData = cloneDeep(this.initialFilterData.leadCreative);
      this.initialFilterData.otherCreative = this.addFieldsForSelectedFact(orderBy(otherCreativeData,
        "Description", this.commonConfig.ascending), 'Other Creative', 'Description');
      this.initialFilterData.perfumer = this.addFieldsForSelectedFact(orderBy(results[12], 'UserID', this.commonConfig.ascending), 'Perfumer', 'UserID');
      this.initialFilterData.SDM = this.addFieldsForSelectedFact(orderBy(results[13], 'Description', this.commonConfig.ascending), 'SDM', 'DisplayName');
      this.initialFilterData.endUse = this.addFieldsForSelectedFact(orderBy(results[14],
        "Description", this.commonConfig.ascending), 'EndUse', 'Description');
      this.initialFilterData.productNumbers = this.addFieldsForSelectedFact(orderBy(results[15],
        "Description", this.commonConfig.ascending), 'Product Numbers', 'Description');
      this.initialFilterData.benefitPlatformOptions = this.addFieldsForSelectedFact(results[16],
        'Benefit', 'Description');
      this.initialFilterData.opportunityOwners = this.addFieldsForSelectedFact(orderBy(results[17],
        "name", this.commonConfig.ascending), 'Opportunity Owners', 'name');
      this.initialFilterData.projectOwner = this.addFieldsForSelectedFact(orderBy(results[18],
        "name", this.commonConfig.ascending), 'Project Owner', 'name');
      this.initialFilterData.projectManager = this.addFieldsForSelectedFact(orderBy(results[19], 'name', this.commonConfig.ascending), 'Project Manager', 'name');
      this.initialFilterData.projectStatus = this.addFieldsForSelectedFact(orderBy(results[20], 'Description', this.commonConfig.ascending), 'Project Status', 'Description');
      this.initialFilterData.finalResults = this.addFieldsForSelectedFact(orderBy(results[21], 'Description', this.commonConfig.ascending), 'Final Results', 'Description');

      this.initialFilterData.creativeSegments = this.addFieldsForSelectedFact(orderBy(results[22], 'description', this.commonConfig.ascending), 'Creative Segments', 'description');
      let marketSegment = cloneDeep(this.initialFilterData.creativeSegments);
      this, this.initialFilterData.marketSegment = this.addFieldsForSelectedFact(orderBy(marketSegment, 'description', this.commonConfig.ascending), 'Market Segments', 'description');

      this.initialFilterData.sales = this.addFieldsForSelectedFact(this.configData.sales,
        'Sales', 'Description');
      this.initialFilterData.exclusivity = this.addFieldsForSelectedFact(this.configData.exclusivityOptions,
        'Exclusivity', 'Description');
      this.initialFilterData.testResultsOptions = this.addFieldsForSelectedFact(this.configData.testResultsOptions,
        'Test Result', 'Description');
      this.initialFilterData.showOptions = this.addFieldsForSelectedFact(this.configData.showOptions,
        'Show Options', 'Description');
      this.initialFilterData.hasCapsuleData = this.addFieldsForSelectedFact(this.configData.hasCapsuleData,
        'Has Capsule', 'Description');
      this.mnc.rangeValue = this.configData.RangesValues.mncRange;
      this.min = this.mnc.rangeValue[0];
      this.max = this.mnc.rangeValue[1];
      this.minPotential = 0;
      this.maxPotential = 10;

      this.cloneMaster = cloneDeep(this.initialFilterData);
      if (Object.keys(this.alreadySelectedFilters).length > 0) {
        // this.selected = this.alreadySelectedFilters;
        // this.onAddSelectedFacets(this.alreadySelectedFilters);
      }
    });


    // this.cloneMaster = cloneDeep(this.initialFilterData);
    // this.initialFilterData.productTypes = this.addFieldsForSelectedFact(orderBy(this.configData.productType,
    //   "Description", this.commonConfig.ascending), 'ProductType', 'Description');

    // this.initialFilterData.customer = this.addFieldsForSelectedFact(orderBy(this.configData.countries,
    //   "Customer", this.commonConfig.ascending), 'Customer', 'Description');
    ;
    this.appBroadcastService.onUpdateAppSpinnerPrompt("");
  }


  public initilizeSelectedFilters() {
    if (Object.keys(this.presetFilter).length > 0) {
      this.selected = cloneDeep(this.presetFilter);
      this.cloneSelected = cloneDeep(this.selected);
      this.onRetainFacetCollection();
      Object.keys(this.selected).forEach(data => {
        if (this.selected[data].length > 0) {
          for (let i = 0; i < this.selected[data].length; i++) {
            if (typeof this.selected[data][i] === 'object') {
              if (this.selected[data][i]['GroupName']) {
                let selectedItemArray = this.filterSelectedIttems(this.selected[data]);
                if (selectedItemArray.length) {
                  this.selectedFilters[SCENTPORTFOLIO_FILTER_MAPPING_CONFIG[this.selected[data][i]['GroupName']]] = selectedItemArray;
                } else {
                  delete this.selectedFilters[SCENTPORTFOLIO_FILTER_MAPPING_CONFIG[this.selected[data][i]['GroupName']]];
                }
              }
            }
          }
        }
      });
      this.updateFilterSubject();
      // this.selectedFilters = {};
    } else {
      this.selected = {
        mnc: [],
        benefitPlatformOptions: [],
        category: [],
        philosophy: [],
        suggestedRegion: [],
        suggestedCountries: [],
        olfactiveFamilyData: [],
        olfactiveSubFamilyData: [],
        keyword: [],
        descriptors: [],
        leadCreative: [],
        otherCreative: [],
        perfumer: [],
        SDM: [],
        endUse: [],
        sales: [],
        testResultsOptions: [],
        exclusivity: [],
        productNumbers: [],
        testRegion: [],
        testCountries: [],
        opportunityOwners: [],
        projectOwner: [],
        projectManager: [],
        projectStatus: [],
        finalResults: [],
        creativeSegments: [],
        marketSegment: []
      };
      this.cloneMaster.category = cloneDeep(this.initialFilterData.category);
      this.cloneMaster.exclusivity = cloneDeep(this.initialFilterData.exclusivity);
      this.cloneMaster.testResultsOptions = cloneDeep(this.initialFilterData.testResultsOptions);
      this.cloneMaster.sales = cloneDeep(this.initialFilterData.sales);
      this.cloneMaster.benefitPlatformOptions = cloneDeep(this.initialFilterData.benefitPlatformOptions);
      this.cloneMaster.showOptions = cloneDeep(this.initialFilterData.showOptions);
      this.cloneMaster.hasCapsuleData = cloneDeep(this.initialFilterData.hasCapsuleData);
      this.mnc.rangeValue = cloneDeep(this.configData.RangesValues.mncRange);
      this.cloneSelected = this.selected;
    }
  }

  private updateFilterSubject() {
    this.appState.set(this.filterKey, this.selectedFilters);
    this.filterService.updateFilterSubject(this.filterKey);
    // this.selectedFilters = {};
  }

  private updateLoadFilterSUbject(selectedFilters) {
    this.filterService.updateLoadFilterSubject(selectedFilters);
  }

  private filterSelectedIttems(selected) {
    let selectedFilterArray = [];
    selected.forEach(item => {
      if (item['Description']) {
        if (this.fieldsOptions.codeBasedOptions.includes(item['GroupName'])) {
          selectedFilterArray.push(item['Code'] + ' - ' + item['Description']);
        } else if (this.fieldsOptions.descBasedOptions.includes(item['GroupName'])) {
          selectedFilterArray.push(item['Description']);
        } else if (this.fieldsOptions.idBasedOptions.includes(item['GroupName'])) {
          selectedFilterArray.push(item['Id'] + ' - ' + item['Description']);
        }
        else {
          selectedFilterArray.push(item['ID'] + ' - ' + item['Description'])
        }
      } else if (item['name']) {
        selectedFilterArray.push(item['name']);
      } else {
        selectedFilterArray.push(item['DisplayName']);
      }
    });
    return selectedFilterArray;
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

  public onChangeCategory(evnt) {
    this.filterService.categoryList.next({
      initialCategoryList: this.initialFilterData.category,
      selectedCategoryList: evnt,
    });
  }


  public changeCategory(evnt) {
    this.selected.category = evnt;
    this.cloneMaster.category = evnt;
    this.cloneSelected.category = this.manageCheckBoxFacets(evnt);
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.category);
    if (selectedItemArray.length) {
      this.selectedFilters.CATEGORY = selectedItemArray;
    } else {
      delete this.selectedFilters.CATEGORY;
    }
    this.updateFilterSubject();
  }

  public onChangeSales(evnt) {
    this.selected.sales = evnt;
    this.cloneSelected.sales = this.manageCheckBoxFacets(evnt);
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.sales);
    if (selectedItemArray.length) {
      this.selectedFilters.SALES = selectedItemArray;
    } else {
      delete this.selectedFilters.SALES;
    }
    this.updateFilterSubject();
  }

  public onChangeExclusivity(evnt) {
    this.selected.exclusivity = evnt;
    this.cloneSelected.exclusivity = this.manageCheckBoxFacets(evnt);
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.exclusivity);
    if (selectedItemArray.length) {
      this.selectedFilters.EXCLUSIVITY = selectedItemArray;
    } else {
      delete this.selectedFilters.EXCLUSIVITY;
    }
    this.updateFilterSubject();
  }

  public onChangeHasCapsule(ent) {
    this.selected.hasCapsuleData = ent;
    this.cloneSelected.hasCapsuleData = this.manageCheckBoxFacets(ent);
    if (this.selected.hasCapsuleData.length) {
      this.selected.hasCapsuleData.forEach(item => {
        if (item['isChecked']) {
          this.selectedFilters.TECHNOLOGY = ['ENCAPSULATION'];

        } else {
          delete this.selectedFilters.TECHNOLOGY;
        }
      });
    } else {
      delete this.selectedFilters.TECHNOLOGY;
    }
    this.assignSelectedFacetColletion();
    this.updateFilterSubject();
  }

  public onChangeShowOptions(ent) {
    this.selected.showOptions = ent;
    this.selected.showOptions.forEach(item => {
      if (item['isChecked']) {
        if (item['value'] === 'doNotUse') {
          this.selectedFilters.DONOTUSEFLAG = true;
        } else {
          this.selectedFilters.NONEWUSEFLAG = true;
        }
      } else {
        if (item['value'] === 'doNotUse') {
          delete this.selectedFilters.DONOTUSEFLAG;
        } else {
          delete this.selectedFilters.NONEWUSEFLAG;
        }
      }
    });
    this.cloneSelected.showOptions = this.manageCheckBoxFacets(ent);
    this.assignSelectedFacetColletion();
    this.updateFilterSubject();
  }

  public onChangeTestResultsOptions(evnt) {
    this.selected.testResultsOptions = evnt;
    this.cloneSelected.testResultsOptions = this.manageCheckBoxFacets(evnt);
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.testResultsOptions);
    if (selectedItemArray.length) {
      this.selectedFilters.TESTRESULTSOPTIONS = selectedItemArray;
    } else {
      delete this.selectedFilters.TESTRESULTSOPTIONS;
    }
    this.updateFilterSubject();
  }

  public onChangeBenefitPlatformOptions(evnt) {
    this.selected.benefitPlatformOptions = evnt;
    this.cloneSelected.benefitPlatformOptions = this.manageCheckBoxFacets(evnt);
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.benefitPlatformOptions);
    if (selectedItemArray.length) {
      this.selectedFilters.BENEFITPLATFORMS = selectedItemArray;
    } else {
      delete this.selectedFilters.BENEFITPLATFORMS;
    }
    this.updateFilterSubject();
  }

  public onAddSuggestedRegion(ent) {
    this.cloneSelected.suggestedRegion = this.selected.suggestedRegion;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.suggestedRegion);
    let key = Object.keys(this.configData.inspirationData)[3];
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }

  public onRemoveAllSuggestedRegion() {
    this.selected.suggestedRegion = [];
    let key = Object.keys(this.configData.inspirationData)[3];
    this.cloneSelected.suggestedRegion = this.selected.suggestedRegion;
    this.assignSelectedFacetColletion();
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }

  public onRemoveSuggestedRegion(ent) {
    this.cloneSelected.suggestedRegion = this.selected.suggestedRegion;
    this.assignSelectedFacetColletion();
  }

  public onAddTestRegion(ent) {
    this.cloneSelected.testRegion = this.selected.testRegion;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.testRegion);
    let key = 'TESTREGIONS';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }

  public onRemoveTestRegion(ent) {
    this.cloneSelected.testRegion = this.selected.testRegion;
    this.assignSelectedFacetColletion();
  }

  public onSelectAllTestRegion(ent) {
    this.cloneSelected.testRegion = this.selected.testRegion;
  }

  public onRemoveAllTestRegion(ent) {
    this.selected.testRegion = [];
    this.cloneSelected.testRegion = this.selected.testRegion;
    let key = 'TESTREGIONS';
    this.assignSelectedFacetColletion();
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }

  public onAddOpportunityOwner(ent) {
    this.cloneSelected.opportunityOwners = this.selected.opportunityOwners;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.opportunityOwners);
    let key = 'OPPORTUNITYOWNERS';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }

  public onRemoveOpportunityOwner(ent) {
    this.cloneSelected.opportunityOwners = this.selected.opportunityOwners;
    this.assignSelectedFacetColletion();
  }

  public onSelectAllOpportunityOwner(ent) {
    this.cloneSelected.opportunityOwners = this.selected.opportunityOwners;
  }

  public onRemoveAllOpportunityOwner() {
    this.selected.opportunityOwners = [];
    this.cloneSelected.opportunityOwners = this.selected.opportunityOwners;
    let key = 'OPPORTUNITYOWNERS';
    this.assignSelectedFacetColletion();
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }

  public onAddProjectOwner(ent) {
    this.cloneSelected.projectOwner = this.selected.projectOwner;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.projectOwner);
    let key = 'PROJECTOWNERNAME';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }

  public onSelectAllprojectOwner(ent) {
    this.cloneSelected.projectOwner = this.selected.projectOwner;
  }

  public onRemoveAllprojectOwner(ent) {
    this.selected.projectOwner = [];
    this.cloneSelected.projectOwner = this.selected.projectOwner;
    let key = 'PROJECTOWNERNAME';
    this.assignSelectedFacetColletion();
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }

  public onAddProjectStatus(ent) {
    this.cloneSelected.projectStatus = this.selected.projectStatus;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.projectStatus);
    let key = 'PROJECTSTATUS';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }

  public onSelectAllProjectStatus(ent) {
    this.cloneSelected.projectStatus = this.selected.projectStatus;
  }

  public onRemoveAllProjectStatus(ent) {
    this.selected.projectStatus = [];
    this.cloneSelected.projectStatus = this.selected.projectStatus;
    let key = 'PROJECTSTATUS';
    this.assignSelectedFacetColletion();
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }

  public onAddProjectManager(ent) {
    this.cloneSelected.projectManager = this.selected.projectManager;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.projectManager);
    let key = 'PROJECTMANAGERNAME';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }

  public onSelectAllprojectManager(ent) {
    this.cloneSelected.projectManager = this.selected.projectManager;
  }

  public onRemoveAllprojectManager(ent) {
    this.selected.projectManager = [];
    this.cloneSelected.projectManager = this.selected.projectManager;
    let key = 'PROJECTMANAGERNAME';
    this.assignSelectedFacetColletion();
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }

  public onAddFinalResults(ent) {
    this.cloneSelected.finalResults = this.selected.finalResults;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.finalResults);
    let key = 'FINALRESULTS';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }
  public onSelectAllFinalResults(ent) {
    this.cloneSelected.finalResults = this.selected.finalResults;
  }
  public onRemoveAllFinalResults(ent) {
    this.selected.finalResults = [];
    this.cloneSelected.finalResults = this.selected.finalResults;
    let key = 'FINALRESULTS';
    this.assignSelectedFacetColletion();
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }

  public onAddCreativeSegments(ent) {
    this.cloneSelected.creativeSegments = this.selected.creativeSegments;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.creativeSegments);
    let key = 'CREATIVESEGMENTS';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }
  public onSelectAllCreativeSegments(ent) {
    this.cloneSelected.creativeSegments = this.selected.creativeSegments;
  }
  public onRemoveAllCreativeSegments(ent) {
    this.selected.creativeSegments = [];
    this.cloneSelected.creativeSegments = this.selected.creativeSegments;
    let key = 'CREATIVESEGMENTS';
    this.assignSelectedFacetColletion();
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }

  public onAddMarketSegments(ent) {
    this.cloneSelected.marketSegment = this.selected.marketSegment;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.marketSegment);
    let key = 'MARKETSEGMENTS';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }
  public onSelectAllMarketSegments(ent) {
    this.cloneSelected.marketSegment = this.selected.marketSegment;
  }
  public onRemoveAllMarketSegments(ent) {
    this.selected.marketSegment = [];
    this.cloneSelected.marketSegment = this.selected.marketSegment;
    let key = 'MARKETSEGMENTS';
    this.assignSelectedFacetColletion();
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }
  public onAddTestCountries(ent) {
    this.cloneSelected.testCountries = this.selected.testCountries;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.testCountries);
    let key = 'TESTCOUNTRIES';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }
  public onRemoveTestCountries(ent) {
    this.cloneSelected.testCountries = this.selected.testCountries;
    this.assignSelectedFacetColletion();
  }
  public onSelectAllTestCountries(ent) {
    this.cloneSelected.testCountries = this.selected.testCountries;
  }
  public onRemoveAllTestCountries(ent) {
    this.selected.testCountries = [];
    this.cloneSelected.testCountries = this.selected.testCountries;
    let key = 'TESTCOUNTRIES';
    this.assignSelectedFacetColletion();
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }
  public onAddInspirationBrandVariant(ent) {
    this.cloneSelected.cfBrandVariantInspiration = this.selected.cfBrandVariantInspiration;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.cfBrandVariantInspiration);
    let key = Object.keys(this.configData.inspirationData)[2];
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();

  }

  public onAddSubCategory(ent) {
    this.cloneSelected.subCategories = this.selected.subCategories;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.subCategories);
    let key = 'SUBCATEGORY';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }
  public onRemoveSubCategory(ent) {
    return null;
  }
  public onSelectAllSubCategory(ent) {
    return null;
  }
  public onRemoveAllSubCategory(ent) {
    this.selected.subCategories = [];
    this.cloneSelected.subCategories = this.selected.subCategories;
    this.assignSelectedFacetColletion();
    let key = 'SUBCATEGORY';
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }

  public onAddLeadCreative(ent) {
    this.cloneSelected.leadCreative = this.selected.leadCreative;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.leadCreative);
    let key = 'LEADCREATIVECENTERDESC';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }
  public onRemoveLeadCreative(ent) {
    this.cloneSelected.leadCreative = this.selected.leadCreative;
    this.assignSelectedFacetColletion();
  }
  public onSelectAllLeadCreative(ent) {
    this.cloneSelected.leadCreative = this.selected.leadCreative;
  }
  public onRemoveAllLeadCreative(ent) {
    this.selected.creative = [];
    this.cloneSelected.creative = this.selected.creative;
    this.assignSelectedFacetColletion();
    let key = 'LEADCREATIVECENTERDESC';
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }

  public onAddOtherCreative(ent) {
    this.cloneSelected.otherCreative = this.selected.otherCreative;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.otherCreative);
    let key = 'OTHERCREATIVECENTERDESC';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }
  public onRemoveOtherCreative(ent) {
    this.cloneSelected.otherCreative = this.selected.otherCreative;
    this.assignSelectedFacetColletion();
  }
  public onSelectAllOtherCreative(ent) {
    this.cloneSelected.otherCreative = this.selected.otherCreative;
  }
  public onRemoveAllOtherCreative(ent) {
    this.selected.otherCreative = [];
    this.cloneSelected.otherCreative = this.selected.otherCreative;
    this.assignSelectedFacetColletion();
    let key = 'OTHERCREATIVECENTERDESC';
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }
  public onAddEndUse(ent) {
    this.cloneSelected.endUse = this.selected.endUse;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.endUse);
    let key = 'ENDUSE';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }
  public onRemoveEndUse(ent) {
    this.cloneSelected.endUse = this.selected.endUse;
    this.assignSelectedFacetColletion();
  }
  public onSelectAllEndUse(ent) {
    this.cloneSelected.endUse = this.selected.endUse;
  }
  public onRemoveAllEndUse(ent) {
    this.selected.endUse = [];
    this.cloneSelected.endUse = this.selected.endUse;
    this.assignSelectedFacetColletion();
    let key = 'ENDUSE';
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }
  public onAddProductNumber(ent) {
    this.cloneSelected.productNumbers = this.selected.productNumbers;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.productNumbers);
    let key = 'PRODUCTTYPDESC';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }
  public onRemoveProductNumber(ent) {
    this.cloneSelected.productNumbers = this.selected.productNumbers;
    this.assignSelectedFacetColletion();
  }
  public onSelectAllProductNumber(ent) {
    this.cloneSelected.productNumbers = this.selected.productNumbers;
  }
  public onRemoveAllProductNumber(ent) {
    this.selected.productNumbers = [];
    this.cloneSelected.productNumbers = this.selected.productNumbers;
    this.assignSelectedFacetColletion();
    let key = 'PRODUCTTYPDESC';
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }

  public onAddDescriptors(ent) {
    this.cloneSelected.descriptors = this.selected.descriptors;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.descriptors);
    let key = 'DESCRIPTOR';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }

  public onAddAllDescriptors(ent) {
    return null;
  }
  public onRemoveAllDescriptors(ent) {
    this.selected.descriptors = [];
    this.cloneSelected.descriptors = this.selected.descriptors;
    this.assignSelectedFacetColletion();
    let key = 'DESCRIPTOR';
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }
  public onAddSuggestedCountry(ent) {
    this.cloneSelected.suggestedCountries = this.selected.suggestedCountries;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.suggestedCountries);
    let key = Object.keys(this.configData.inspirationData)[4];
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }
  public onRemoveSuggestedCountry(ent) {
    this.cloneSelected.suggestedCountries = this.selected.suggestedCountries;
    this.assignSelectedFacetColletion();
  }

  public onSelectAllSuggestedCountry(ent) {
    this.cloneSelected.suggestedCountries = this.selected.suggestedCountries;
  }
  public onRemoveAllSuggestedCountry(ent) {
    this.selected.suggestedCountries = [];
    this.cloneSelected.suggestedCountries = this.selected.suggestedCountries;
    this.assignSelectedFacetColletion();
    let key = Object.keys(this.configData.inspirationData)[4];
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }
  public onAddKeyword(ent) {
    this.cloneSelected.keyword = this.selected.keyword;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.keyword);
    let key = 'KEYWORDSDESC';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }
  public onRemoveKeyword(ent) {
    this.cloneSelected.keyword = this.selected.keyword;
    this.assignSelectedFacetColletion();
  }
  public onSelectAllKeyword(ent) {
    this.cloneSelected.keyword = this.selected.keyword;
  }
  public onRemoveAllKeyword(ent) {
    this.selected.keyword = [];
    this.cloneSelected.keyword = this.selected.keyword;
    this.assignSelectedFacetColletion();
    let key = 'KEYWORDSDESC';
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }
  public onAddOlfactiveSubFamily(ent) {
    this.cloneSelected.olfactiveSubFamilyData = this.selected.olfactiveSubFamilyData;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.olfactiveSubFamilyData);
    let key = 'OLFACTIVESUBFAMILYDESC';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }

    this.updateFilterSubject();
  }
  public onRemoveOlfactiveSubFamily(ent) {
    this.cloneSelected.olfactiveSubFamilyData = this.selected.olfactiveSubFamilyData;
    this.assignSelectedFacetColletion();
  }
  public onSelectAllOlfactiveSubFamily(ent) {
    this.cloneSelected.olfactiveSubFamilyData = this.selected.olfactiveSubFamilyData;
  }
  public onRemoveAllOlfactiveSubFamily(ent) {
    this.selected.olfactiveSubFamilyData = [];
    this.cloneSelected.olfactiveSubFamilyData = this.selected.olfactiveSubFamilyData;
    this.assignSelectedFacetColletion();
    let key = 'OLFACTIVESUBFAMILYDESC';
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }

  public onAddOlfactiveFamily(ent) {
    this.cloneSelected.olfactiveFamilyData = this.selected.olfactiveFamilyData;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.olfactiveFamilyData);
    let key = 'OLFACTIVEFAMILYDESC';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }
  public onRemoveOlfactiveFamily(ent) {
    this.cloneSelected.olfactiveFamily = cloneDeep(this.selected.olfactiveFamily);
    this.assignSelectedFacetColletion();
  }
  public onSelectAllOlfactiveFamily(ent) {
    this.cloneSelected.olfactiveFamily = this.selected.olfactiveFamily;
  }
  public onRemoveAllOlfactiveFamily(ent) {
    this.selected.olfactiveFamilyData = [];
    this.cloneSelected.olfactiveFamilyData = this.selected.olfactiveFamilyData;
    this.assignSelectedFacetColletion();
    let key = 'OLFACTIVEFAMILYDESC';
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }
  public onAddPerfumer(ent) {
    this.cloneSelected.perfumer = cloneDeep(this.selected.perfumer);
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.perfumer);
    let key = 'PERFUMER';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }
  public onRemovePerfumer(ent) {
    this.cloneSelected.perfumer = this.selected.perfumer;
    this.assignSelectedFacetColletion();
  }
  public onSelectAllPerfumer(ent) {
    this.cloneSelected.perfumer = this.selected.perfumer;
  }
  public onRemoveAllPerfumer(ent) {
    this.selected.perfumer = [];
    this.cloneSelected.perfumer = this.selected.perfumer;
    this.assignSelectedFacetColletion();
    let key = 'PERFUMER';
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }

  public onAddSDM(ent) {
    this.cloneSelected.SDM = this.selected.SDM;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.SDM);
    let key = 'SDM';
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }
  public onRemoveSDM(ent) {
    this.cloneSelected.SDM = this.selected.SDM;
    this.assignSelectedFacetColletion();
  }
  public onSelectAllSDM(ent) {
    this.cloneSelected.SDM = this.selected.SDM;
  }
  public onRemoveAllSDM(ent) {
    this.selected.SDM = [];
    this.cloneSelected.SDM = this.selected.SDM;
    this.assignSelectedFacetColletion();
    let key = 'SDM';
    delete this.selectedFilters[key];
    this.updateFilterSubject();
  }
  public onAddPhilosophy(ent) {

    this.cloneSelected.philosophy = this.selected.philosophy;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.philosophy);
    let key = Object.keys(this.configData.inspirationData)[0];
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }


  public onRemovePhilosophy(ent) {
    this.cloneSelected.philosophy = this.selected.philosophy;
    this.assignSelectedFacetColletion();

  }
  public onSelectAllPhilosophy(ent) {
    this.cloneSelected.philosophy = this.selected.philosophy;
  }
  public onRemoveAllPhilosophy(ent) {
    this.selected.philosophy = [];
    this.cloneSelected.philosophy = this.selected.philosophy;
    this.assignSelectedFacetColletion();
    let key = Object.keys(this.configData.inspirationData)[0];
    delete this.selectedFilters[key];
    this.updateFilterSubject();

  }


  public onAddInspirationBrand(ent) {
    this.cloneSelected.cfBrandInspiration = this.selected.cfBrandInspiration;
    this.assignSelectedFacetColletion();
    let selectedItemArray = this.filterSelectedIttems(this.cloneSelected.cfBrandInspiration);
    let key = Object.keys(this.configData.inspirationData)[1];
    if (selectedItemArray.length) {
      this.selectedFilters[key] = selectedItemArray;
    } else {
      delete this.selectedFilters[key];
    }
    this.updateFilterSubject();
  }


  public onRemoveAllInspirationBrand(ent) {
    this.selected.cfBrandInspiration = [];
    this.cloneSelected.cfBrandInspiration = this.selected.cfBrandInspiration;
    this.assignSelectedFacetColletion();
    let key = Object.keys(this.configData.inspirationData)[1];
    delete this.selectedFilters[key];
    this.updateFilterSubject();

  }

  public onRemoveAllonAddInspBrandVariant(ent) {
    this.selected.cfBrandVariantInspiration = [];
    this.cloneSelected.cfBrandVariantInspiration = this.selected.cfBrandVariantInspiration;
    this.assignSelectedFacetColletion();
    let key = Object.keys(this.configData.inspirationData)[2];
    delete this.selectedFilters[key];
    this.updateFilterSubject();

  }
  public onChangeMNC(selectedMNC) {
    this.selected.mnc = selectedMNC;
    let key = 'MNC';
    if (selectedMNC[0] === 0 && selectedMNC[1] === 20) {
      delete this.selectedFilters[key];
    } else {
      this.selectedFilters[key] = this.selected.mnc;
    }
    this.updateFilterSubject();
    this.mncManipulation();
  }

  public onChangeProjectPotential(selectedPotential) {
    this.selected.projectPotential = selectedPotential;
    let values = cloneDeep(selectedPotential);
    values.forEach((item, i) => {
      values[i] = round(item * 1000000)
    });
    let key = 'TOTALPOTENTIALVALUE';
    if (selectedPotential[0] === 0 && selectedPotential[1] === 20) {
      delete this.selectedFilters[key];
    } else {
      this.selectedFilters[key] = values;
    }
    this.updateFilterSubject();
    this.potentialManipulation();
  }

  public onRetainFacetCollection() {
    let categoryRes = this.initialFilterData.category.map(obj => this.selected.category.find(o => o.Id === obj.Id) || obj);
    let benefitPlatformOptions = this.initialFilterData.benefitPlatformOptions.map(obj => this.selected.benefitPlatformOptions.find(o => o.Id === obj.Id) || obj);
    let exclusivity = this.initialFilterData.exclusivity.map(obj => this.selected.exclusivity.find(o => o.Id === obj.Id) || obj);
    let testResultsOptions = this.initialFilterData.testResultsOptions.map(obj => this.selected.testResultsOptions.find(o => o.Id === obj.Id) || obj);
    let sales = this.initialFilterData.sales.map(obj => this.selected.sales.find(o => o.Id === obj.Id) || obj);
    // tslint:disable-next-line:max-line-length
    this.cloneMaster.benefitPlatformOptions = cloneDeep(benefitPlatformOptions);
    this.cloneSelected.benefitPlatformOptions = this.manageCheckBoxFacets(this.selected.benefitPlatformOptions);
    this.cloneMaster.category = cloneDeep(categoryRes);
    this.cloneSelected.category = this.manageCheckBoxFacets(this.selected.category);
    // tslint:disable-next-line:max-line-length
    this.cloneMaster.exclusivity = cloneDeep(exclusivity);
    this.cloneSelected.exclusivity = this.manageCheckBoxFacets(this.selected.exclusivity);
    // tslint:disable-next-line:max-line-length
    this.cloneMaster.testResultsOptions = cloneDeep(testResultsOptions);
    this.cloneSelected.testResultsOptions = this.manageCheckBoxFacets(this.selected.testResultsOptions);
    // // tslint:disable-next-line:max-line-length
    this.cloneMaster.sales = cloneDeep(sales);
    this.cloneSelected.sales = this.manageCheckBoxFacets(this.selected.sales);
  }

  public onSelectAllSuggestedRegion(ent) {
    this.cloneSelected.suggestedRegion = this.selected.suggestedRegion;
  }

  public onSelectAllInspirationBrand(ent) {
    this.cloneSelected.cfBrandInspiration = this.selected.cfBrandInspiration;
  }
  public onSelectonAddInspirationBrandVariant(ent) {
    this.cloneSelected.cfBrandVariantInspiration = this.selected.cfBrandVariantInspiration;
  }

  public onAddProductType(ent) {
    this.cloneSelected.productTypes = this.selected.productTypes;
    this.assignSelectedFacetColletion();
  }
  public onRemoveProductType(ent) {
    this.cloneSelected.productTypes = this.selected.productTypes;
    this.assignSelectedFacetColletion();
  }
  public onSelectAllProductType(ent) {
    this.cloneSelected.productTypes = this.selected.productTypes;
  }
  public onRemoveAllProductType(ent) {
    this.cloneSelected.productTypes = this.selected.productTypes;
  }

  public onAddSelectedFacets(selecetdItem) {
    let selectedArray = {
      olfactiveSubFamily: [],
      olfacticeFamily: [],
      philosophy: [],
      inspirationBrand: [],
      cfBrandVariantInspiration: [],
      suggestedRegion: [],
      suggestedCountries: [],
      olfactiveFamilyData: [],
      keyword: [],
      descriptors: [],
      leadCreative: [],
      otherCreative: [],
      perfumer: [],
      SDM: [],
      subCategories: [],
      endUse: [],
      productNumbers: [],
      testRegion: [],
      testCountries: []
    };
    selecetdItem.forEach(item => {
      let tempArray = [];
      switch (item.GroupName) {
        case "Category":
          this.selected.category = this.addFilteredItem(this.cloneMaster.category, item);
          this.cloneMaster.category = cloneDeep(this.selected.category);
          this.cloneSelected.category = (this.manageCheckBoxFacets(this.selected.category));
          break;
        case 'Benefit':
          this.selected.benefitPlatformOptions = this.addFilteredItem(this.cloneMaster.benefitPlatformOptions, item);
          this.cloneMaster.benefitPlatformOptions = cloneDeep(this.selected.benefitPlatformOptions);
          this.cloneSelected.benefitPlatformOptions = this.manageCheckBoxFacets(this.selected.benefitPlatformOptions);
          break;
        case "Exclusivity":
          this.selected.exclusivity = this.addFilteredItem(this.cloneMaster.exclusivity, item);
          this.cloneMaster.exclusivity = cloneDeep(this.selected.exclusivity);
          this.cloneSelected.exclusivity = this.manageCheckBoxFacets(this.selected.exclusivity);
          break;
        case 'Sales':
          this.selected.sales = this.addFilteredItem(this.cloneMaster.sales, item);
          this.cloneMaster.sales = cloneDeep(this.selected.sales);
          this.cloneSelected.sales = this.manageCheckBoxFacets(this.selected.sales);
          break;
        case 'Test Result':
          this.selected.testResultsOptions = this.addFilteredItem(this.cloneMaster.testResultsOptions, item);
          this.cloneMaster.testResultsOptions = cloneDeep(this.selected.testResultsOptions);
          this.cloneSelected.testResultsOptions = this.manageCheckBoxFacets(this.selected.testResultsOptions);
          break;
        case 'Show Options':
          this.selected.showOptions = this.addFilteredItem(this.cloneMaster.showOptions, item);
          this.cloneMaster.showOptions = cloneDeep(this.selected.showOptions);
          this.cloneSelected.showOptions = this.manageCheckBoxFacets(this.selected.showOptions);
          break;
        case "Olfactive SubFamily":
          selectedArray.olfactiveSubFamily.push(item);
          this.selected.olfactiveSubFamilyData = selectedArray.olfactiveSubFamily;
          break;
        case 'Philosophy':
          selectedArray.philosophy.push(item);
          this.selected.philosophy = selectedArray.philosophy;
          break;
        case 'Inspiration Brand':
          selectedArray.inspirationBrand.push(item);
          this.selected.cfBrandInspiration = selectedArray.inspirationBrand;
          break;
        case 'Inspiration Brand Variant':
          selectedArray.cfBrandVariantInspiration.push(item);
          this.selected.cfBrandVariantInspiration = selectedArray.cfBrandVariantInspiration;
          break;
        case 'Appropriate Region':
          selectedArray.suggestedRegion.push(item);
          this.selected.suggestedRegion = selectedArray.suggestedRegion;
          break;
        case 'Appropriate Country':
          selectedArray.suggestedCountries.push(item);
          this.selected.suggestedCountries = selectedArray.suggestedCountries;
          break;
        case 'Olfactive Family':
          selectedArray.olfactiveFamilyData.push(item);
          this.selected.olfactiveFamilyData = selectedArray.olfactiveFamilyData;
          break;
        case 'Keyword':
          selectedArray.keyword.push(item);
          this.selected.keyword = selectedArray.keyword;
          break;
        case 'Descriptors':
          selectedArray.descriptors.push(item);
          this.selected.descriptors = selectedArray.descriptors;
          break;
        case 'Lead Creative':
          selectedArray.leadCreative.push(item);
          this.selected.leadCreative = selectedArray.leadCreative;
          break;
        case 'Other Creative':
          selectedArray.otherCreative.push(item);
          this.selected.otherCreative = selectedArray.otherCreative;
          break;
        case 'Perfumer':
          selectedArray.perfumer.push(item);
          this.selected.perfumer = selectedArray.perfumer
          break;
        case 'SDM':
          selectedArray.SDM.push(item);
          this.selected.SDM = selectedArray.SDM;
          break;
        case 'SubCategory':
          selectedArray.subCategories.push(item);
          this.selected.subCategories = selectedArray.subCategories;
          break;
        case 'EndUse':
          selectedArray.endUse.push(item);
          this.selected.endUse = selectedArray.endUse;
          break;
        case 'Product Numbers':
          selectedArray.productNumbers.push(item);
          this.selected.productNumbers = selectedArray.productNumbers;
          break;
        case 'Test Region':
          selectedArray.testRegion.push(item);
          this.selected.testRegion = selectedArray.testRegion;
          break;
        case 'Test Countries':
          selectedArray.testCountries.push(item);
          this.selected.testCountries = selectedArray.testCountries;
          break;
      }
    });
  }

  public onRemoveSelectedFacet(removedItem) {
    switch (removedItem.GroupName) {
      case 'Philosophy':
        this.selected.philosophy.splice(findIndex(this.selected.philosophy, removedItem), 1);
        this.onAddPhilosophy(removedItem);
        break;
      case 'Inspiration Brand':
        this.selected.cfBrandInspiration.splice(findIndex(this.selected.cfBrandInspiration, removedItem), 1);
        this.onAddInspirationBrand(removedItem);
        break;
      case 'Inspiration Brand Variant':
        this.selected.cfBrandVariantInspiration.splice(findIndex(this.selected.cfBrandVariantInspiration, removedItem), 1);
        this.onAddInspirationBrandVariant(removedItem);
        break;
      case 'Appropriate Region':
        this.selected.suggestedRegion.splice(findIndex(this.selected.suggestedRegion, removedItem), 1);
        this.onAddSuggestedRegion(removedItem);
        break;
      case 'Appropriate Country':
        this.selected.suggestedCountries.splice(findIndex(this.selected.suggestedCountries, removedItem), 1);
        this.onAddSuggestedCountry(removedItem);
        break;
      case 'Olfactive Family':
        this.selected.olfactiveFamilyData.splice(findIndex(this.selected.olfactiveFamilyData, removedItem), 1);
        this.onAddOlfactiveFamily(removedItem);
        break;
      case 'Olfactive SubFamily':
        this.selected.olfactiveSubFamilyData.splice(findIndex(this.selected.olfactiveSubFamilyData, removedItem), 1);
        this.onAddOlfactiveSubFamily(removedItem);
        break;
      case 'Descriptors':
        this.selected.descriptors.splice(findIndex(this.selected.descriptors, removedItem), 1);
        this.onAddDescriptors(removedItem);
        break;
      case 'SubCategory':
        this.selected.subCategories.splice(findIndex(this.selected.subCategories, removedItem), 1);
        this.onAddSubCategory(removedItem);
        break;
      case 'Keyword':
        this.selected.keyword.splice(findIndex(this.selected.keyword, removedItem), 1);
        this.onAddKeyword(removedItem);
        break;
      case 'Lead Creative':
        this.selected.leadCreative.splice(findIndex(this.selected.leadCreative, removedItem), 1);
        this.onAddLeadCreative(removedItem);
        break;
      case 'Other Creative':
        this.selected.otherCreative.splice(findIndex(this.selected.otherCreative, removedItem), 1);
        this.onAddOtherCreative(removedItem);
        break;
      case 'Perfumer':
        this.selected.perfumer.splice(findIndex(this.selected.perfumer, removedItem), 1);
        this.onAddPerfumer(removedItem);
        break;
      case 'SDM':
        this.selected.SDM.splice(findIndex(this.selected.SDM, removedItem), 1);
        this.onAddSDM(removedItem);
        break;
      case 'EndUse':
        this.selected.endUse.splice(findIndex(this.selected.endUse, removedItem), 1);
        this.onAddEndUse(removedItem);
        break;
      case 'Product Type':
        this.selected.productTypes.splice(findIndex(this.selected.productTypes, removedItem), 1);
        this.onRemoveProductType(removedItem);
        break;
      case 'Product Numbers':
        this.selected.productNumbers.splice(findIndex(this.selected.productNumbers, removedItem), 1);
        this.onAddProductNumber(removedItem);
        break;
      case 'Test Region':
        this.selected.testRegion.splice(findIndex(this.selected.testRegion, removedItem), 1);
        this.onAddTestRegion(removedItem);
        break;
      case 'Test Countries':
        this.selected.testCountries.splice(findIndex(this.selected.testCountries, removedItem), 1);
        this.onAddTestCountries(removedItem);
        break;
      case 'Benefit':
        this.selected.benefitPlatformOptions = this.removeFilteredItem(this.cloneMaster.benefitPlatformOptions, removedItem);
        this.cloneMaster.benefitPlatformOptions = cloneDeep(this.selected.benefitPlatformOptions);
        this.cloneSelected.benefitPlatformOptions = this.manageCheckBoxFacets(this.selected.benefitPlatformOptions);
        this.assignSelectedFacetColletion();
        this.onChangeBenefitPlatformOptions(this.cloneSelected.benefitPlatformOptions);
        break;
      case 'Category':
        this.selected.category = this.removeFilteredItem(this.cloneMaster.category, removedItem);
        this.cloneMaster.category = cloneDeep(this.selected.category);
        this.cloneSelected.category = (this.manageCheckBoxFacets(this.selected.category));
        this.assignSelectedFacetColletion();
        this.onChangeCategory(this.cloneMaster.category);

        break;
      case 'Show Options':
        this.selected.showOptions = this.removeFilteredItem(this.cloneMaster.showOptions, removedItem);
        this.cloneMaster.showOptions = cloneDeep(this.selected.showOptions);
        this.cloneSelected.showOptions = this.manageCheckBoxFacets(this.selected.showOptions);
        this.assignSelectedFacetColletion();
        this.onChangeShowOptions(this.cloneSelected.showOptions);
        break;
      case 'Sales':
        this.selected.sales = this.removeFilteredItem(this.cloneMaster.sales, removedItem);
        this.cloneMaster.sales = cloneDeep(this.selected.sales);
        this.cloneSelected.sales = (this.manageCheckBoxFacets(this.selected.sales));
        this.assignSelectedFacetColletion();
        this.onChangeSales(this.cloneSelected.sales);
        break;
      case 'Exclusivity':
        this.selected.exclusivity = this.removeFilteredItem(this.cloneMaster.exclusivity, removedItem);
        this.cloneMaster.exclusivity = cloneDeep(this.selected.exclusivity);
        this.cloneSelected.exclusivity = (this.manageCheckBoxFacets(this.selected.exclusivity));
        this.assignSelectedFacetColletion();
        this.onChangeExclusivity(this.cloneSelected.exclusivity);
        break;
      case 'Test Result':
        this.selected.testResultsOptions = this.removeFilteredItem(this.cloneMaster.testResultsOptions, removedItem);
        this.cloneMaster.testResultsOptions = cloneDeep(this.selected.testResultsOptions);
        this.cloneSelected.testResultsOptions = (this.manageCheckBoxFacets(this.selected.testResultsOptions));
        this.assignSelectedFacetColletion();
        this.onChangeTestResultsOptions(this.cloneSelected.testResultsOptions);
        break;
      case 'Has Capsule':
        this.selected.hasCapsuleData = this.removeFilteredItem(this.cloneMaster.hasCapsuleData, removedItem);
        this.cloneMaster.hasCapsuleData = cloneDeep(this.selected.hasCapsuleData);
        this.cloneSelected.hasCapsuleData = (this.manageCheckBoxFacets(this.selected.hasCapsuleData));
        this.assignSelectedFacetColletion();
        this.onChangeHasCapsule(this.cloneSelected.hasCapsuleData);
        break;
      case 'MNC':
        this.mnc.rangeValue = [0, 20];
        this.min = 0;
        this.max = 20;
        this.onChangeMNC([0, 20]);
        this.selected.mnc = cloneDeep([0, 20]);
        this.mncManipulation();
        break;
      case 'POTENTIAL':
        this.projectPotential.rangeValue = [0, 20];
        this.minPotential = 0;
        this.maxPotential = 20;
        this.onChangeProjectPotential([0, 20]);
        this.selected.projectPotential = cloneDeep([0, 20]);
        this.potentialManipulation();
        break;
      case 'Opportunity Owners':
        this.selected.opportunityOwners.splice(findIndex(this.selected.opportunityOwners, removedItem), 1);
        this.onAddOpportunityOwner(removedItem);
        break;
      case 'Project Owner':
        this.selected.projectOwner.splice(findIndex(this.selected.projectOwner, removedItem), 1);
        this.onAddProjectOwner(removedItem);
        break;
      case 'Project Manager':
        this.selected.projectManager.splice(findIndex(this.selected.projectManager, removedItem), 1);
        this.onAddProjectManager(removedItem);
        break;
      case 'Project Status':
        this.selected.projectStatus.splice(findIndex(this.selected.projectStatus, removedItem), 1);
        this.onAddProjectStatus(removedItem);
        break;
      case 'Final Results':
        this.selected.finalResults.splice(findIndex(this.selected.finalResults, removedItem), 1);
        this.onAddFinalResults(removedItem);
        break;
      case 'Creative Segments':
        this.selected.creativeSegments.splice(findIndex(this.selected.creativeSegments, removedItem), 1);
        this.onAddCreativeSegments(removedItem);
        break;
      case 'Market Segments':
        this.selected.marketSegment.splice(findIndex(this.selected.marketSegment, removedItem), 1);
        this.onAddMarketSegments(removedItem);
        break;
    }
  }


  public onChangeCategories(selectedCategories) {
    this.selected.categoriesList = selectedCategories;
    this.cloneSelected.categoriesList = this.manageCheckBoxFacets(selectedCategories);
    this.assignSelectedFacetColletion();
  }
  removeFilteredItem(coll: any, removedItem: any): any {
    coll.map(item => {
      if (item.DisplayName === removedItem.DisplayName) {
        item.isChecked = false;
      }
    });
    return coll;
  }
  addFilteredItem(coll: any, addItem: any): any {
    coll.map(item => {
      if (item.DisplayName === addItem.DisplayName) {
        item.isChecked = true;
      }
    });
    return coll;
  }

  private mncManipulation() {
    let selectedMNCRange: any = {};
    if (this.selected.mnc && !isEqual(this.selected.mnc, [round(this.selected.mnc[0]), round(this.selected.mnc[1])])) {
      selectedMNCRange = {
        GroupName: 'MNC',
        // tslint:disable-next-line:max-line-length
        DisplayName: `(${this.defaultCurrencyCode})/kg: ` + new DecimalPipe('en-Us').transform(this.selected.mnc[0], '1.2-2') + ' to ' +
          new DecimalPipe('en-Us').transform(this.selected.mnc[1], '1.2-2'),
        showGroupName: false
      };
    } else {
      delete this.selected['mnc'];
    }
    this.cloneSelected.mnc = selectedMNCRange.DisplayName !== undefined ? selectedMNCRange : undefined;
    this.assignSelectedFacetColletion();
  }

  private potentialManipulation() {
    let selectedPotentialRange: any = {};
    if (this.selected.projectPotential && !isEqual(this.selected.projectPotential, [round(0), round(20)])) {
      selectedPotentialRange = {
        GroupName: 'POTENTIAL',
        // tslint:disable-next-line:max-line-length
        DisplayName: `(${this.defaultCurrencyCode}): ` + new DecimalPipe('en-Us').transform(this.selected.projectPotential[0], '1.2-2') + ' to ' +
          new DecimalPipe('en-Us').transform(this.selected.projectPotential[1], '1.2-2'),
        showGroupName: false
      };
    } else {
      delete this.selected['projectPotential'];
    }
    this.cloneSelected.projectPotential = selectedPotentialRange.DisplayName !== undefined ? selectedPotentialRange : undefined;

    this.assignSelectedFacetColletion();
  }

  private manageCheckBoxFacets(coll) {
    return filter(coll, (e: any) => e.isChecked === true);
  }

  private assignSelectedFacetColletion() {
    let temp = [];
    mapValues(this.cloneSelected, (item: any) => {
      item && temp.push(item);
    });
    temp = flattenDeep(temp);
    this.selectedFacetCollection = cloneDeep(temp);
    this.debouncer.next({
      selectedFacetCollection: this.selectedFacetCollection,
      selected: cloneDeep(this.selected),
      list: cloneDeep(this.list)
    });
  }

  public onRemoveBrandVariant(item: any) {
    this.cloneSelected.brandVariantList = cloneDeep(this.selected.brandVariantList);
  }

  // to be implemented
  onClickApplyFilters() {
    this.min = 0;
    this.max = 20;
    this.mnc.rangeValue = [0, 20];
    this.minPotential = 0;
    this.maxPotential = 20;
    this.projectPotential.rangeValue = [0, 20];
    let temp = { selected: cloneDeep(this.selected), list: cloneDeep(this.list) };
    this.onApplyFilters.emit(temp);
  }
  // to be implemented
  onClickCancelFilters() {
    this.min = 0;
    this.max = 20;
    this.mnc.rangeValue = [0, 20];
    this.minPotential = 0;
    this.maxPotential = 20;
    this.projectPotential.rangeValue = [0, 20];
    let temp = this.appState.get(this.key);
    if (temp) {
      this.selected = cloneDeep(temp.selectedFilterOptions.selected);
      this.onRetainFacetCollection();
      this.selectedFacetCollection = cloneDeep(temp.selectedFacetCollection);
      this.list = cloneDeep(temp.selectedFilterOptions.list);
      let updatedSubjectValues = cloneDeep(temp.subjectValues);
      this.cloneSelected = cloneDeep(this.selected);
      this.selectedFilters = {};
      this.selectedFilters = updatedSubjectValues;
    } else {
      this.selectedFilters = {};
      this.initilizeSelectedFilters();
      this.filterService.categoryList.next(cloneDeep(this.initialFilterData.category));
    }
    this.assignSelectedFacetColletion();
    this.updateFilterSubject();
    // if (this.selected.mnc) {
    //   this.mnc.rangeValue = [this.selected.mnc[0], this.selected.mnc[1]];
    // } else {
    //   this.mnc.rangeValue = [this.resetMNCValue[0], this.resetMNCValue[1]];
    // }
    let tempObject = {
      category: cloneDeep(this.cloneMaster.category)
    }
    this.onCancelFilters.emit(tempObject);
  }


  // to be implemented
  onClickResetFilters() {
    this.initilizeSelectedFilters();
    this.assignSelectedFacetColletion();
    this.selectedFilters = {};
    this.updateFilterSubject();
    this.onResetFilters.emit();
  }

}