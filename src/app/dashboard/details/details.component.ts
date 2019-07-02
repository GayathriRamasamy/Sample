import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModalOptions, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from "xlsx";
import * as momentImported from 'moment';
const moment = momentImported;
import { keyConfig, Config, imageConfig } from 'src/app/_config/dashboard.config';
import { DashboardService } from 'src/app/_services/+dashboard/dashboard.service';
import { detailsConfig } from 'src/app/_config/details.config';
import { ConfigService } from 'src/app/_services/+dashboard/config.service';
import { CustomDateComponent } from '../custom-date/custom-date.component';
import { AppBroadCastService } from 'src/app/_services';
import { InformationMessage } from 'src/app/_shared/messages/InformationMessage';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  @Input() public headerContent: String = '';
  @Input() public selectedSubTab: String;
  @Input() detailObject: Object;

  public config: any;
  public contentConfig: any;
  public selectedDate: String = '';
  public title: String = '';
  public downloadLabels = Config.downloadLabel;
  public icons = {
    'calenderIcon': imageConfig.calenderIcon,
    'downloadIcon': imageConfig.downloadIcon
  };


  public labels = {
    'sortByLabel': Config.sortByLabel,
    'dateLabel': Config.dateLabel,
    'filterPlaceholder': Config.filterPlaceholder
  }
  private datePopupOptions: NgbModalOptions = {
    keyboard: false,
    windowClass: "cutomDateModal",
    backdrop: "static",
    centered: true
  };
  public secLvlTab: object = {};
  public dateRanges: object = {};
  public sortByoptions: object = {};
  public selectedSortedOption: string;
  public searchText = "";
  public selectedSecLvlTab: string;
  public selectedSecLvlTabKey: string;

  public staticHeaders = [];
  public dynamicHeaders = [];
  public dynamicHeaderToDisplay;
  public contentsToDisplay;
  public filteredContent;
  public noResults = "No Results found !";
  public responseContent: any;
  public customDateRangeStartDate: string = '';
  public customDateRangeEndDate: string = '';
  public customDateComponentInput: any = {};
  //Restrict the asc ordering while using keyvalue pipe
  sortFn = (a, b) => 0;
  customDateObject: { startDate: string; endDate: string; };
  public selectedFacetCollection: any;
  isEnableSpdfilter = true;
  constructor(
    public activeModal: NgbActiveModal,
    private dashboardService: DashboardService,
    private configService: ConfigService,
    private modalService: NgbModal,
    private broadCastService: AppBroadCastService
  ) { }


  ngOnInit() {
    if(localStorage.getItem('enableDetail') === 'true') {
      this.filteredContent =  JSON.parse( localStorage.getItem('detailContent'));
      this.staticHeaders =  JSON.parse( localStorage.getItem('detailStaticHeader'));
      this.dynamicHeaderToDisplay = JSON.parse(localStorage.getItem('detailDynamicHeader'));
    } else {
      this.initializeValues();
    }
  }

  async initializeValues() {
    let dashboardName;
    // this.configService.loadDeatilsConfig();
    this.configService.dashboardName.subscribe((name) => {
      dashboardName = name;
    });

    await this.dashboardService.getDetailsConfig(dashboardName).toPromise().then((config) => {
      if (Object.keys(config).length) {
        this.config = config;
        this.broadCastService.onUpdateAppSpinnerPrompt('');

      } else {
        this.broadCastService.onUpdateAppSpinnerPrompt(InformationMessage.Loading);
      }
    });

    this.initializeTitle();

    this.secLvlTab = this.dashboardService.cloneObject['secLvlTab'];
    this.dateRanges = this.dashboardService.cloneObject['dateRanges'];
    this.sortByoptions = this.dashboardService.cloneObject['sortByOptions'];

    this.dashboardService.tabDetails.subscribe(
      tabData => {
        this.selectedSecLvlTab = tabData.secLvlTabValue;
        this.selectedSecLvlTabKey = tabData.secLvlTabKey;
      }
    );

    this.dashboardService.updateFilterSettings.subscribe(
      filterData => {
        this.selectedSortedOption = this.sortByoptions[filterData.sortedOption];
      }
    );
    this.contentConfig = this.config[detailsConfig.all];

    this.staticHeaders = this.contentConfig[detailsConfig.staticHeader];

    this.dynamicHeaders = this.contentConfig[detailsConfig.dynamicHeader];
    this.getDynamicHeader();
    this.getTableContents(this.selectedSecLvlTabKey, this.selectedDate);
  }

  // TO INITIALIZE THE TITLE OF THE DETAILS PAGE WITH SELECTED DATE RANGE
  initializeTitle() {
    this.dashboardService.filterDetails.subscribe(
      filterData => {
        this.selectedDate = filterData.dateValue;
      }
    );
    let title = this.config[detailsConfig.title];
    title = title.replace(detailsConfig.selectedDate, this.selectedDate);
    this.title = title;
  }

  public async getTableContents(selectedTabKey, selectedDate) {
    this.contentsToDisplay = [];
    let staticContentsKeys = this.contentConfig[detailsConfig.staticContent];
    let dynamicContentKeys = this.contentConfig[detailsConfig.dynamicContent];

    console.log(staticContentsKeys, dynamicContentKeys);
    setTimeout(() => {
      this.broadCastService.onUpdateAppSpinnerPrompt("Loading");
    }, 1000);
    await this.dashboardService.getDetailsContents(selectedDate, this.detailObject).subscribe((contents) => {
      if (Object.keys(contents).length) {
        this.responseContent = contents;
        let staticContents = [];
        let dynamicKeys = [];
        let dynamicContentTemplate;
        staticContents = contents;
        if (dynamicContentKeys) {
          dynamicContentTemplate = dynamicContentKeys[selectedTabKey];
          dynamicKeys = dynamicContentTemplate.match(/@\w*@/ig);
        }
        for (let i = 0; i < 2; i++) {
          let contentArray = [];
          for (let j = 0; j < staticContentsKeys.length; j++) {
            let staticContentTemplate = staticContentsKeys[j];
            let keys = staticContentTemplate.match(/@\w*@/ig);
            for (let k = 0; k < keys.length; k++) {
              let key = keys[k].substring(1, keys[k].length - 1);

//               if(key === 'FLAG') {
// // debugger;
//                 for(let flag = 0; flag < staticContents[i][key].length; flag++) {
//                   console.log('FLAGS => '+ flag)
//                 }
//               } else {
                staticContentTemplate = staticContentTemplate.replace(keys[k], staticContents[i][key]);  
              // }
            }
            contentArray.push(staticContentTemplate);
          }
          if (dynamicKeys) {
            for (let m = 0; m < dynamicKeys.length; m++) {
              let key = dynamicKeys[m].substring(1, dynamicKeys[m].length - 1);
              dynamicContentTemplate = dynamicContentTemplate.replace(dynamicKeys[m], staticContents[i][`${key}`]);

            }
            contentArray.push(dynamicContentTemplate);
          }
          this.contentsToDisplay.push(contentArray);
          this.searchContent('');
        }
        this.broadCastService.onUpdateAppSpinnerPrompt('');

      } else {
        this.broadCastService.onUpdateAppSpinnerPrompt(InformationMessage.Loading);

      }

    });
  }

  public getDynamicHeader() {
    if (this.selectedSecLvlTabKey) {
      this.dynamicHeaderToDisplay = this.dynamicHeaders[this.selectedSecLvlTabKey];
    }
  }

  public navigateSecLvlTab(tabdata) {
    this.selectedSecLvlTab = tabdata.value;
    this.selectedSecLvlTabKey = tabdata.key;
    this.detailObject["secondLevelTab"] = tabdata.key;
    this.getDynamicHeader();
    this.getTableContents(tabdata.key, this.selectedDate);
  }

  public pickDateRange(dateRange) {
    this.detailObject["dateRange"] = dateRange.key;
    if (dateRange.key === 'customRange') {
      let modelRef: NgbModalRef = this.modalService.open(
        CustomDateComponent,
        this.datePopupOptions
      );
      this.customDateObject = {
        startDate: '',
        endDate: ''
      };
      modelRef.componentInstance.customDateRange = this.customDateObject;
      modelRef.result.then((value) => {
        this.customDateObject = value ? value : '';
        if (this.customDateObject) {
          this.detailObject["startDate"] = this.customDateObject['startDate'];
          this.detailObject['endDate'] = this.customDateObject['endDate'];
          this.selectedDate = moment(this.customDateObject['startDate']).format(Config.DATE_FORMAT) + ' ' + 'to' + ' ' + moment(this.customDateObject['endDate']).format(Config.DATE_FORMAT);
          this.getTableContents(this.selectedSecLvlTabKey, this.selectedDate);
        }

      });
    } else {
      this.customDateObject = {
        startDate: '',
        endDate: ''
      }
      this.selectedDate = dateRange.value;
      this.getTableContents(this.selectedSecLvlTabKey, this.selectedDate);
    }
  }

  public toSortbyOption(option) {
    this.detailObject["sortBy"] = option.key;
    this.selectedSortedOption = option.value;
    this.getTableContents(this.selectedSecLvlTabKey, this.selectedDate);
  }
  public clearSearch() {
    this.searchText = '';
    this.searchContent(this.searchText);
  }
  public searchContent(searchData) {
    searchData = searchData.trim();
    searchData = searchData.toLowerCase();
    this.filteredContent = this.contentsToDisplay.filter((contents) => {
      let filteredValues = contents.filter((content) => {
        return content.toLowerCase().includes(searchData);
      });
      if (filteredValues.length) {
        return true;
      } else {
        return false;
      }
    });

    localStorage.setItem('detailContent', JSON.stringify(this.filteredContent));
    localStorage.setItem('detailStaticHeader', JSON.stringify(this.staticHeaders));
    localStorage.setItem('detailDynamicHeader', JSON.stringify(this.dynamicHeaderToDisplay));
  }
  // To be implemented
  public onPrintList() {
    localStorage.setItem('enableDetail', 'true');
    localStorage.setItem('enablePrint', 'true');

    let popup = window.open(
      "scentPortfolioDashboard/print",
      "_blank",
      "width=" +
      screen.width +
      ",height=" +
      screen.height +
      ",scrollbars=yes,fullscreen=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no"
    );
    popup.moveTo(0, 0);
  }

  public exportExcel() {
    let json = [];
    let regX = /(<([^>]+)>)/ig;
    let excelHeader: any;

    excelHeader = this.staticHeaders;
    excelHeader = JSON.stringify(excelHeader);
    excelHeader = JSON.parse(excelHeader.replace(regX, ""));

    let excelBody: any;
    excelBody = this.contentsToDisplay;
    excelBody = JSON.stringify(excelBody);
    excelBody = JSON.parse(excelBody.replace(regX, ""));

    //let json = [];
    for (var i = 0; i < excelBody.length; i++) {
      let tempArray = {};
      for (var j = 0; j < excelHeader.length; j++) {
        tempArray[excelHeader[j]] = excelBody[i][j]
      }
      json.push(tempArray);
    }

    this.exportToExcel(json, "IPC detail");
  }

  public exportToExcel(json: any, sheetName: string) {

    const EXCEL_EXTENSION = ".xlsx";

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

    const workbook: XLSX.WorkBook = {
      Sheets: {
        ScentPortfolio: worksheet
      },
      SheetNames: ["ScentPortfolio"]
    };

    XLSX.writeFile(workbook, sheetName + EXCEL_EXTENSION, {
      bookSST: true
    });
  }
}



