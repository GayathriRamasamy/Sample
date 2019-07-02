import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import * as d3 from "d3";
import {
  NgbModalRef,
  NgbModal,
  NgbModalOptions
} from "@ng-bootstrap/ng-bootstrap";
import {  combineLatest } from 'rxjs';

// Utility
import { BubbleChartUtility } from "src/app/_shared/utility/bubble-chart-utility";
// Config
import {
  FRONT_END_CONFIG,
  BUBBLE_CHART_ICON_CONFIG,
  BUBBLE_CHART_CONFIG
} from "src/app/_config/bubble-chart/bubble-chart.config";
// Services
import { DashboardService } from "src/app/_services/+dashboard/dashboard.service";
import { BubbleChartService } from "src/app/_services/+dashboard/bubble-chart/bubble-chart.service";
import { ConfigService } from "src/app/_services/+dashboard/config.service";
import { ToastrService } from 'ngx-toastr';
// Component
import { BubbleChartOverlayComponent } from "../bubble-chart-overlay/bubble-chart-overlay.component";
import { AppBroadCastService } from '../../../_services/app.broadcast.service';
// Common
import { ErrorMessage } from "../../../_shared/messages/ErrorMessage";
import { AppDataService } from "src/app/_services";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-bubble-chart",
  templateUrl: "./bubble-chart.component.html",
  styleUrls: ["./bubble-chart.component.scss"]
})
export class BubbleChartComponent implements OnInit {
  
  enablePrint: boolean = false;
  count: number;
  @ViewChild('bubbleChartTooltip') bubChartTooltip: ElementRef;
  @ViewChild('groupLegendBodyContent') groupLegendBodyContent: ElementRef;
  // Overlay configuration
  private bubbleOverlayOptions: NgbModalOptions = {
    keyboard: false,
    size: "lg",
    windowClass: "bub-chart-overlay-panel",
    backdrop: true,
    centered: true
  };
  // Bubble chart - SVG selection
  private svg: any;
  // Chart
  private bubbleSize: string;
  private splitBy: string;
  private chart: Object;
  public isSplit: boolean;
  // Main legend mapping
  private colorCode: Array<string> = [];
  private colorDomain:  Array<string> = [];
  // Legend
  private legendHeader: any;
  private legendBody: any[];
  private legendBodyFormat: string;
  private mainLegend: Object;
  // Information icon
  public infoTip: string;
  public infoTipContent: string;
  private regExp: RegExp;
  // Label
  private chartDetail: string;
  private leftChartDetail: string;
  private rightChartDetail: string;
  private chartLabel: Object;
  // API
  private apiData: any;
  // Tooltip
  private tooltip: any;
  private tooltipHeader: Array<String>;
  private tooltipBody: Array<Object>;
  private tooltipHeaderTitle: Array<string> = [];
  private tooltipHeaderSubtitle:  Array<string> = [];
  // API payload
  private activeDateRange: string;
  private activeDateValue: string; // Legend header label - YOY
  private activeFirstLevelTab: string;
  private activeSecondLevelTab: string;
  private activeSecondLevelTabValue: string;
  private activeType: string;
  private activeSecondLevelTabToggle:  Array<string>;
  private activeHeaderToggle: string;
  private headerFilter: object;
  private headerTitleTemplate: string;
  // Dropdown option
  public enableDropDown: boolean = false;
  private dropDown: object;
  private activeDropDownOption: string;
  private activeDropDown: string;
  private customDateRangeStartDate: string;
  private customeDateRangeEndDate: string;
  // Icon
  public icon: Object;
  // Header
  private headerToggle:  Array<string>;
  public enableToggle: boolean = false;
  public headerTitle: string;
  public enableInfoTip: boolean;
  private prevSelectedDropDown: string;
  // For overlay
  private tooltipOverlayContent: Object;
  // config and utility
  private chartConfig: Object;
  private utility: any;
  // Disable KeyValue pipe order - HTML template
  public sortFn = (a, b) => 0;
  // Scroll legend
  public rightLegend: Array<string> = [];
  public leftLegend: Array<string> = [];
  public rightLegendTitle: Array<string> = [];
  public leftLegendTitle: Array<string> = [];
  public prevHeaderFilter: object;
  public prevDateRange: string;
  public prevType: string;
  public prevFirstLevelTab: string;
  public prevSecondLevelTab: string;
  public enableLoader: boolean = true;
  public enableGroupLegend: boolean = false;
  public prevChartConfig: any;
  public enableGroupLegendHeaderTitle: boolean = false; 
  public prevFilters: any;
  public filters: any;

  constructor(
    private dashboardService: DashboardService,
    private bubbleChartService: BubbleChartService,
    private ngbModalService: NgbModal,
    private configService: ConfigService,
    private toastrService: ToastrService,
    private broadCastService: AppBroadCastService,
    private appData: AppDataService
  ) {
    this.utility = new BubbleChartUtility();
  }

  /**
   * // TODO: angular component initialization
   * Gets script version
   * @param - no params
   * @returns - void
   */
  ngOnInit() {
    this.enablePrint = JSON.parse(localStorage.getItem("enablePrint"));
    // Icon
    this.icon = {
      infoIcon: BUBBLE_CHART_ICON_CONFIG.informationIcon,
      overlayIcon: BUBBLE_CHART_ICON_CONFIG.overlayIcon,
      tooltipPersonalWashIcon: BUBBLE_CHART_ICON_CONFIG.tooltipPersonalWashIcon
    };

    // Chart label
    this.chartLabel = {
      currentYearLabel: FRONT_END_CONFIG.currentYearLabel,
      previousYearLabel: FRONT_END_CONFIG.previousYearLabel,
      previousYearData: FRONT_END_CONFIG.previousYearData,
      currentYearData: FRONT_END_CONFIG.currentYearData,
      yearOverYearKey: FRONT_END_CONFIG.yearOverYearLabel,
      activeSecondLevelTabLabel: FRONT_END_CONFIG.activeSecondLevelTab,
      activeDateRangeLabel: FRONT_END_CONFIG.activeDateRange
    };

    // Chart config
    this.chart = {
      simulationForceStrength: BUBBLE_CHART_CONFIG.simulationForceStrength,
      chartHeight: BUBBLE_CHART_CONFIG.bubbleChartHeight,
      chartWidth: BUBBLE_CHART_CONFIG.bubbleChartWidth,
      splitChartWidth: BUBBLE_CHART_CONFIG.yoyBubbleChartWidth,
      splitChartHeight: BUBBLE_CHART_CONFIG.yoyBubbleChartHeight,
      splitOpacity: BUBBLE_CHART_CONFIG.splitOpacity,
      rootNodeFillColor: BUBBLE_CHART_CONFIG.rootNodeFillColor,
      rootNodeStrokeColor: BUBBLE_CHART_CONFIG.rootNodeStrokeColor,
      mainLegendCategoryKey: FRONT_END_CONFIG.mainLegendCategoryKey,
      mainLegendColorKey: FRONT_END_CONFIG.mainLegendColorKey,
      group: FRONT_END_CONFIG.group
    };

    // Regular expression
    this.regExp = new RegExp(
      FRONT_END_CONFIG.regExpPattern,
      FRONT_END_CONFIG.regExpFlag
    );

    this.svg = d3.select(".bub-chart-svg").select("svg");

    // get change detection
    this.getSubscribe();
  }

  /**
   * // TODO: Get change detection from dashboard header
   * @param - no params
   * @returns - void
   */
  getSubscribe() {
    // tab details
    this.dashboardService.tabDetails.subscribe(tabDetail => {
      this.enableLoader = true;
      this.activeFirstLevelTab = tabDetail.frstLvlTabKey;
      this.activeSecondLevelTab = tabDetail.secLvlTabKey;
      this.activeSecondLevelTabValue = tabDetail.secLvlTabValue;
      // this.getConfig();
      if(localStorage.getItem("enablePrint") == "true") {
        this.chartConfig = JSON.parse(localStorage.getItem('bubbleChartConfig'));
        this.configSetup();
      } else {
        this.getConfig();
      }
    });
    // Main legend mapping
    this.dashboardService.legends.subscribe(legend => {
      this.mainLegend = legend;
      this.colorCode = this.mainLegend["colors"];
      this.colorDomain = this.mainLegend["domains"];
      if(localStorage.getItem("enablePrint") == "false") {
        localStorage.setItem('colorCode', JSON.stringify(this.colorCode));
        localStorage.setItem('colorDomain', JSON.stringify(this.colorDomain));
      }
    });
  }

  /**
   * // TODO: Get configuration from back-end
   * @param - no params
   * @returns - void
   */
  getConfig() {
    this.configService.chartConfig.subscribe(configuration => {
      if(configuration['bubbleChart']) {
        this.chartConfig = configuration['bubbleChart'];
        if((this.prevChartConfig !== this.chartConfig)) {
          this.prevChartConfig = this.chartConfig;
          this.isSplit = this.chartConfig['splitData']['isSplit'];
          this.configSetup();
          localStorage.setItem('bubbleChartConfig', JSON.stringify(this.chartConfig));
        }
      }
    });
  }

  /**
   * // TODO: Config setup
   * @param - no params
   * @returns - void
   */
  configSetup() {
    // enable group legend header title
    this.enableGroupLegendHeaderTitle  = false;
    // enable toggle
    this.enableToggle = false;
    // enable information pop over
    this.enableInfoTip = this.chartConfig[FRONT_END_CONFIG.enableInfoTipKey];
    // bubble size param setup
    this.bubbleSize = this.chartConfig[FRONT_END_CONFIG.potential];
    // header toggle
    this.headerToggle = this.chartConfig[FRONT_END_CONFIG.headerToggle];
    // drop down
    this.dropDown = this.chartConfig[FRONT_END_CONFIG.dropDown.key];
    // information pop over
    this.infoTip = this.chartConfig[FRONT_END_CONFIG.infoTip];
    // tooltip content
    this.tooltip = this.chartConfig[FRONT_END_CONFIG.tooltip.key];
    // tooltip header
    this.tooltipHeader = this.chartConfig[FRONT_END_CONFIG.tooltip.key][
        FRONT_END_CONFIG.tooltip.tooltipHeader.key];
    // tooltip body content
    this.tooltipBody = this.chartConfig[FRONT_END_CONFIG.tooltip.key][
        FRONT_END_CONFIG.tooltip.tooltipBody.key];
    // overlay - tooltip
    this.tooltipHeaderTitle = this.chartConfig[FRONT_END_CONFIG.tooltip.key][
        FRONT_END_CONFIG.tooltip.tooltipHeader.key][FRONT_END_CONFIG.tooltip.tooltipHeader.title];
    this.tooltipHeaderSubtitle = this.chartConfig[FRONT_END_CONFIG.tooltip.key][
        FRONT_END_CONFIG.tooltip.tooltipHeader.key][FRONT_END_CONFIG.tooltip.tooltipHeader.subTitle];
    // API data - chart key
    this.chartDetail = this.chartConfig[FRONT_END_CONFIG.split.key][
        FRONT_END_CONFIG.split.chartDetail];

    if (this.chartDetail.length || !this.chartDetail) {
      this.leftChartDetail = this.chartConfig[FRONT_END_CONFIG.split.key][
          FRONT_END_CONFIG.split.leftChartDetail];
      this.rightChartDetail = this.chartConfig[FRONT_END_CONFIG.split.key][
          FRONT_END_CONFIG.split.rightChartDetail];
    }

    // legend header
    if (this.isSplit) {
      this.legendHeader = this.chartConfig[FRONT_END_CONFIG.legend.key][
          FRONT_END_CONFIG.legend.split.key][FRONT_END_CONFIG.legend.split.header.key];
      this.legendBodyFormat = this.chartConfig[FRONT_END_CONFIG.legend.key][
          FRONT_END_CONFIG.legend.split.key][FRONT_END_CONFIG.legend.split.legendFormat];
      this.splitBy = this.chartConfig[FRONT_END_CONFIG.split.key][
          FRONT_END_CONFIG.split.splitBy];
  
    } else {
      this.legendHeader = this.chartConfig[FRONT_END_CONFIG.legend.key][
          FRONT_END_CONFIG.legend.group.key][FRONT_END_CONFIG.legend.group.header.key];
      this.legendBodyFormat = this.chartConfig[FRONT_END_CONFIG.legend.key][
          FRONT_END_CONFIG.legend.group.key][FRONT_END_CONFIG.legend.group.legendFormat];

      if(this.legendHeader[FRONT_END_CONFIG.legend.group.header.rightAlignment.key][FRONT_END_CONFIG.legend.group.header.rightAlignment.name].length > 0 
      && this.legendHeader[FRONT_END_CONFIG.legend.group.header.rightAlignment.key][FRONT_END_CONFIG.legend.group.header.rightAlignment.value].length > 0) {
        this.enableGroupLegendHeaderTitle = true;
      }
    }

    // tooltip overlay content
    this.tooltipOverlayContent = {
      line1: this.tooltipHeaderTitle,
      line2: this.tooltipHeaderSubtitle,
      body: this.tooltipBody
    };

    // dropdown option
    if (this.dropDown) {
      if (Object.keys(this.dropDown).length > 0) {
        this.enableDropDown = true;
        if(this.activeSecondLevelTab === BUBBLE_CHART_CONFIG.productTab) {
          this.activeDropDownOption = BUBBLE_CHART_CONFIG.defaultDropdownProduct;
          this.activeDropDown = this.dropDown[BUBBLE_CHART_CONFIG.defaultDropdownProduct];
        } else {
          this.activeDropDownOption = Object.keys(this.dropDown)[0];
          this.activeDropDown = this.dropDown[Object.keys(this.dropDown)[0]]; 
        }
        localStorage.setItem("activeDropDownOption", this.activeDropDownOption);
      } else {
        this.enableDropDown = false;
        this.activeDropDownOption = '';
        this.activeDropDown = '';
        localStorage.setItem("activeDropDownOption", this.activeDropDownOption);
      }
    }

    

    // header toggle
    if (Object.keys(this.headerToggle).length > 0) {
      this.activeHeaderToggle = Object.keys(this.headerToggle)[0];
      this.enableToggle = true;
    } else {
      this.enableToggle = false;
      this.activeHeaderToggle = '';
    }

    this.dashboardService.setChartDetail(
      this.activeHeaderToggle,
      this.activeDropDownOption
    );

    if(localStorage.getItem("enablePrint") == "true") {
      this.enableGroupLegend = true;
      this.renderChart(JSON.parse(localStorage.getItem('bubbleChartResponse')));
    }else {
    
      this.dashboardService.updateFilterSettings.subscribe(filterDetail => {
        this.headerFilter = filterDetail.headerFilter;
        this.activeDateRange = filterDetail.dateKey;
        this.activeDateValue = filterDetail.dateValue;
        this.activeType = filterDetail.sortedOption;
        this.customDateRangeStartDate = filterDetail.startDate;
        this.customeDateRangeEndDate = filterDetail.endDate;
        this.filters = filterDetail.filters;
        // debugger
        if( this.activeDateRange && this.activeType && this.activeFirstLevelTab && this.activeSecondLevelTab ) {
          if((this.prevHeaderFilter !==  this.headerFilter) ||
          (this.prevDateRange !==  this.activeDateRange) ||
          (this.prevType !==  this.activeType) ||
          (this.prevFirstLevelTab !== this.activeFirstLevelTab) ||
          (this.prevSecondLevelTab !== this.activeSecondLevelTab) ||
          (JSON.stringify(this.prevFilters) !== JSON.stringify(this.filters))
          ) 
            {
              this.prevHeaderFilter =  this.headerFilter;
              this.prevDateRange =  this.activeDateRange;
              this.prevType =  this.activeType;
              this.prevFirstLevelTab = this.activeFirstLevelTab;
              this.prevSecondLevelTab = this.activeSecondLevelTab;
              this.prevFilters = Object.assign({}, this.filters);
              this.loadChart();
            }
        }
      });
    }
  }

  /**
   * // TODO: Get bubble chart overlay component
   * @param - no params
   * @returns  void
   */
  getChartOverlay() {
    let modelRef: NgbModalRef;
    modelRef = this.ngbModalService.open(
      BubbleChartOverlayComponent,
      this.bubbleOverlayOptions
    );
    // pass data to overlay
    modelRef.componentInstance.overlayData = {
      yoy: this.isSplit,
      apiData: this.apiData,
      dropDown: this.dropDown,
      header: this.headerTitleTemplate,
      headerToggle: this.headerToggle,
      infoTip: this.infoTipContent,
      colorCode: this.colorCode,
      colorDomain: this.colorDomain,
      legendFormat: this.legendBodyFormat,
      legendHeader: this.legendHeader,
      dateValue: this.activeDateValue,
      firstLevelTab: this.activeFirstLevelTab,
      secondLevelTab: this.activeSecondLevelTab,
      dateRange: this.activeDateRange,
      sortedOption: this.activeType,
      tabToggle: this.activeSecondLevelTabToggle,
      filter: this.filters,
      tooltip: this.tooltipOverlayContent,
      activeDropdown: this.activeDropDownOption,
      headerFilter: this.headerFilter,
      startDate: this.customDateRangeStartDate,
      endDate: this.customeDateRangeEndDate,
      headerToggleOption: this.activeHeaderToggle,
      activeSecondLevelTabValue: this.activeSecondLevelTabValue
    };
  }

  /**
  * // TODO: Get chart data 
  * @param - firstLevelTab: string, secondLevelTab: string, dateRange: string, type: string, tabToggle: Array<string>, yoy: boolean,
             headerToggle: string, selectedDropDown: string, filter: any[]
  * @returns - void
  */
  // get api and load chart
  loadChart() {
    this.broadCastService.onUpdateAppSpinnerPrompt('Getting Bubble chart Data...');
    this.bubbleChartService
      .getBubbleChartData(
        this.activeFirstLevelTab,
        this.activeSecondLevelTab,
        this.activeDateRange,
        this.activeType,
        this.activeSecondLevelTabToggle,
        this.isSplit,
        this.activeHeaderToggle,
        this.activeDropDownOption,
        this.headerFilter,
        this.customDateRangeStartDate,
        this.customeDateRangeEndDate,
        this.filters,
        this.dashboardService.dashboardPermission['WriteFlag']
      )
      .subscribe(response => {
        if(Object.keys(response).length >= 2) {
          this.enableGroupLegend = true;
          localStorage.setItem('bubbleChartResponse', JSON.stringify(response));
          this.renderChart(response);
          this.broadCastService.onUpdateAppSpinnerPrompt('');
        } else {
          this.enableGroupLegend = false;
          d3.select('.bub-chart-svg').select('svg').select('.bub-chart-group').html(' ');
          this.rightLegend = [];
          this.rightLegendTitle = [];
          this.broadCastService.onUpdateAppSpinnerPrompt('');
          this.enableLoader = false;
          this.toastrService.error(`No data found for bubble chart!`);
        }
      }, (error: HttpErrorResponse) => {
        // console.log(error.stat);
        this.toastrService.error(ErrorMessage.BubbleChartResponseFailure);
        d3.select('.bub-chart-svg').select('svg').select('.bub-chart-group').html(' ');
        this.rightLegend = [];
        this.rightLegendTitle = [];
        this.enableLoader = false;
        this.broadCastService.onUpdateAppSpinnerPrompt('');
      });
  }

  /**
   * // TODO: Render chart
   * Gets script version
   * @param - response: object
   * @returns - void
   */
  renderChart(response: object) {
    this.apiData = response;
    this.getInfoTip();
    this.getHeaderTitle();
    this.getChart(this.apiData, this.isSplit);
  }

  /**
   * // TODO: To activate header toggle
   * Gets script version
   * @param - toggle: string
   * @returns - void
   */
  activateToggle(toggle: string) {
    this.activeHeaderToggle = toggle;
    this.dashboardService.setChartDetail(
      this.activeHeaderToggle,
      this.activeDropDownOption
    );
    // load chart after config setup
    this.loadChart();
  }

  /**
   * // TODO: Dropdown option selection
   * @param - selectedOption: string, value: string
   * @returns -void
   */
  getDropDownSelection(selectedOption: string, value: string) {
    this.activeDropDownOption = selectedOption;
    this.activeDropDown = value;
    this.dashboardService.setChartDetail(
      this.activeHeaderToggle,
      this.activeDropDownOption
    );
    // load chart after config setup
    this.loadChart();
  }

  /**
   * // TODO: TO get information pop over and change template
   * Gets script version
   * @param - no params
   * @returns - void
   */
  getInfoTip() {
    let apiData = this.apiData[FRONT_END_CONFIG.infoTipKey];
    let infoTipKeys: Array<string> = [];
    infoTipKeys = this.infoTip.match(this.regExp);
    let updatedInfoTipHeader = this.infoTip;
    for (let j = 0; j < infoTipKeys.length; j++) {
      infoTipKeys[j] = infoTipKeys[j].substring(1, infoTipKeys[j].length - 1);
      if (apiData[infoTipKeys[j]]) {
        if (infoTipKeys[j] === 'totalPotential') {
          let format = d3.format('.2s');
          updatedInfoTipHeader = updatedInfoTipHeader.replace(
            FRONT_END_CONFIG.replaceKey + infoTipKeys[j] + FRONT_END_CONFIG.replaceKey,
            format(apiData[infoTipKeys[j]])
          );
        } else {
          updatedInfoTipHeader = updatedInfoTipHeader.replace(
            FRONT_END_CONFIG.replaceKey + infoTipKeys[j] + FRONT_END_CONFIG.replaceKey,
            apiData[infoTipKeys[j]]
          );
        }
      } else if (infoTipKeys[j] === this.chartLabel["activeDateRangeLabel"]) {
        updatedInfoTipHeader = updatedInfoTipHeader.replace(
          FRONT_END_CONFIG.replaceKey + infoTipKeys[j] + FRONT_END_CONFIG.replaceKey,
          this.activeDateValue
        );
      }
      else {
        updatedInfoTipHeader = updatedInfoTipHeader.replace(
          FRONT_END_CONFIG.replaceKey + infoTipKeys[j] + FRONT_END_CONFIG.replaceKey,
          '0'
        );
      }
    }
    this.infoTipContent = updatedInfoTipHeader;
    // set active class  - dropdown changes
    if (this.enableDropDown) {
      this.infoTipContent = this.infoTipContent.replace(
        " " + BUBBLE_CHART_CONFIG.infoTipActiveClass,
        ""
      );
      this.infoTipContent = this.infoTipContent.replace(
        new RegExp(this.activeDropDownOption, "g"),
        this.activeDropDownOption + " " + BUBBLE_CHART_CONFIG.infoTipActiveClass
      );
    }
  }

  /**
   * // TODO: Get header title and change template
   * @param - no params
   * @returns - void
   */
  getHeaderTitle() {
    // header title
    if (this.isSplit) {
      this.headerTitle = this.chartConfig[FRONT_END_CONFIG.headerTitle.key][
          FRONT_END_CONFIG.headerTitle.splitFormat];
    } else {
      this.headerTitle = this.chartConfig[FRONT_END_CONFIG.headerTitle.key][
          FRONT_END_CONFIG.headerTitle.groupFormat];
    }
    this.headerTitleTemplate = this.headerTitle;
    let apiData = this.apiData[FRONT_END_CONFIG.infoTipKey];
    let headerTitleKeys: Array<string> = this.headerTitle.match(this.regExp);
    let updatedHeaderTitle = this.headerTitle;
    for (let j = 0; j < headerTitleKeys.length; j++) {
      headerTitleKeys[j] = headerTitleKeys[j].substring(1, headerTitleKeys[j].length - 1);
      if (apiData[headerTitleKeys[j]]) {
       if(Math.floor(Math.log(apiData[headerTitleKeys[j]]) / Math.LN10 + 1) > 3) {
        let format = d3.format(".2s");
         updatedHeaderTitle = updatedHeaderTitle.replace(
          FRONT_END_CONFIG.replaceKey + headerTitleKeys[j] + FRONT_END_CONFIG.replaceKey,
          format(apiData[headerTitleKeys[j]])
        );
       } else {
        updatedHeaderTitle = updatedHeaderTitle.replace(
          FRONT_END_CONFIG.replaceKey + headerTitleKeys[j] + FRONT_END_CONFIG.replaceKey,
          apiData[headerTitleKeys[j]]
        );
       }
      } else if ( headerTitleKeys[j] === this.chartLabel["activeSecondLevelTabLabel"]) {
        updatedHeaderTitle = updatedHeaderTitle.replace(
          FRONT_END_CONFIG.replaceKey + headerTitleKeys[j] + FRONT_END_CONFIG.replaceKey,
          this.activeSecondLevelTabValue
        );
      } else {
        updatedHeaderTitle = updatedHeaderTitle.replace(
          FRONT_END_CONFIG.replaceKey + headerTitleKeys[j] + FRONT_END_CONFIG.replaceKey,
          '0'
        );
      }
    }
    this.headerTitle = updatedHeaderTitle;
    // set active class  - dropdown changes
    if (this.enableDropDown) {
      this.headerTitle = this.headerTitle.replace(
        " " + BUBBLE_CHART_CONFIG.headerTitleActiveClass,
        ""
      );
      this.headerTitle = this.headerTitle.replace(
        this.activeDropDownOption,
        this.activeDropDownOption + " " + BUBBLE_CHART_CONFIG.headerTitleActiveClass
      );
    }
  }

  /**
   * // TODO: Plot bubble chart
   * @param - apiResponse: object, yoy: boolean
   * @returns - void
   */
  getChart(apiData: any, yoy: boolean) {
    //  reset chart
    this.svg.select(".bub-chart-group").html(" ");
    this.svg.select(".bub-chart-yoy").html(" ");

    // Looping - apiData
    let chartDetail: Array<object> = [];
    let currentYearDetail: Array<object> = [];
    let previousYearDetail: Array<object> = [];
    // Legend and BubbleChart input
    let currentYearLegend: Array<string> = [];
    let chartInput: any = [];
    let previousYearLegend: Array<string> = [];
    // Common
    let svg: any;
    let bubble: any;
    let circlePack: any;
    let pack: any;
    let nodes: any;
    let sortedNode: any[] = [];
    let splitBy: string = this.splitBy;
    let simulation: any;
    // Group
    let selectedGraph: string;
    // Yoy
    let currentYearPercent: number = 0,
      previousYearPercent: number = 0;
    let currentYearAngle: number = 0,
      previousYearAngle: number = 0;
    let currentYearRadians: number = 0,
      previousYearRadians: number = 0;
    let totalPreviousYearRadius: number = 0,
      totalCurrentYearRadius: number = 0;
    // allocation of space between center of the circle to bubble
    let noOfCategory: number = 0;
    //  tooltip
    let tooltip = d3
        .select(".bub-chart-container")
        .select(".bub-chart-tooltip")
        .style("position", "absolute").style('z-index', 100);
    // to define space between center of the origin and category region
    noOfCategory = this.colorDomain.length;
    // color code
    let colors: any;
    if(localStorage.getItem("enablePrint") == "true") {
      colors= d3
        .scaleOrdinal()
        .range(JSON.parse(localStorage.getItem('colorCode')))
        .domain(JSON.parse(localStorage.getItem('colorDomain')));
    } else {
      // color code
      colors= d3
        .scaleOrdinal()
        .range(this.colorCode)
        .domain(this.colorDomain);
    }
    svg = d3
      .select(".bub-chart-content")
      .select(".bub-chart-svg")
      .select("svg");

    if (yoy) {
      Object.keys(apiData).forEach(category => {
        Object.keys(apiData[category]).forEach(categoryDetail => {
          switch (categoryDetail) {
            case this.leftChartDetail: {
              apiData[category][categoryDetail].forEach(chartContent => {
                chartContent[`${this.chart["group"]}`] = category;
                chartContent[`${FRONT_END_CONFIG.yearOnYearKey}`] = true;
              });
              chartDetail.push(apiData[category][categoryDetail]);
              break;
            }
            case this.rightChartDetail: {
              apiData[category][categoryDetail].forEach(chartContent => {
                chartContent[`${this.chart["group"]}`] = category;
                chartContent[`${FRONT_END_CONFIG.yearOnYearKey}`] = false;
              });
              chartDetail.push(apiData[category][categoryDetail]);
              break;
            }
            case this.chartDetail: {
              apiData[category][categoryDetail].forEach(chartContent => {
                chartContent[`${this.chart["group"]}`] = category;
              });
              chartDetail.push(apiData[category][categoryDetail]);
              break;
            }
            case this.chartLabel["currentYearLabel"]: {
              apiData[category][categoryDetail][ `${this.chart["group"]}`] = category;
              apiData[category][categoryDetail]['color'] = colors(category);
              currentYearDetail.push(apiData[category][categoryDetail]);
              break;
            }
            case this.chartLabel["previousYearLabel"]: {
              apiData[category][categoryDetail][`${this.chart["group"]}`] = category;
              apiData[category][categoryDetail]['color'] = colors(category);
              previousYearDetail.push(apiData[category][categoryDetail]);
              break;
            }
          }
        });
      });


      // Conversion from Object to Array of object
      chartInput = [].concat(...chartDetail);
      currentYearLegend = [].concat(...currentYearDetail);
      previousYearLegend = [].concat(...previousYearDetail);

      // Circle pack
      circlePack = data =>
        d3
          .pack()
          .size([this.chart["splitChartWidth"], this.chart["splitChartHeight"]])
          .padding(0)(
          d3.hierarchy({ children: data }).sum(hierarchyData => {
            return hierarchyData[`${this.bubbleSize}`];
          })
        );
      // Input to circle packing 
      pack = circlePack(chartInput);
    } else {
      Object.keys(apiData).forEach(category => {
        Object.keys(apiData[category]).forEach(categoryDetail => {
          if (
            categoryDetail === this.leftChartDetail ||
            categoryDetail === this.chartDetail ||
            categoryDetail === this.rightChartDetail
          ) {
            apiData[category][categoryDetail].forEach(chartContent => {
              chartContent[`${this.chart["group"]}`] = category;
            });
            chartDetail.push(apiData[category][categoryDetail]);
          } else if (categoryDetail === this.chartLabel["currentYearLabel"]) {
            apiData[category][categoryDetail][`${this.chart["group"]}`] = category;
            apiData[category][categoryDetail]['color'] = colors(category);
            currentYearDetail.push(apiData[category][categoryDetail]);
          }
        });
      });

      // Conversion from Object to Array of object
      currentYearLegend = [].concat(...currentYearDetail);
      chartInput = [].concat(...chartDetail);

      // Circle pack
      circlePack = data =>
        d3
          .pack()
          .size([this.chart["chartWidth"], this.chart["chartHeight"]])
          .padding(0)(
          d3.hierarchy({ children: data }).sum(hierarchyData => {
            return hierarchyData[`${this.bubbleSize}`];
          })
        );
      // Input to circle packing 
      pack = circlePack(chartInput);
    }

    // YOY - outer circle
    if (yoy) {
      svg
        .select(".bub-chart-yoy")
        .append("circle")
        .attr("cx", 220)
        .attr("cy", 100)
        .attr("r", 100)
        .style("stroke", this.chart["rootNodeStrokeColor"])
        .attr("fill", this.chart["rootNodeFillColor"]);
    }

    //  graph selection
    if (yoy) {
      selectedGraph = ".bub-chart-yoy";
    } else {
      selectedGraph = ".bub-chart-group";
    }

    let totalRadius: number = 0;
    //  graph setup
    bubble = svg
      .select(`${selectedGraph}`)
      .selectAll("circle")
      .data(pack.descendants())
      .enter()
      .append("circle");

    // circle pack
    bubble
      .style("fill", (data, index) => {
        if (!data["children"]) {
          return colors(data["data"][`${this.chart["group"]}`]);
        } else {
          return this.chart["rootNodeFillColor"];
        }
      })
      .attr("r", function(data, index) {
        totalRadius += data.r;
        return data.r;
      })
      .style("stroke", (data, index) => {
        if (index === 0) {
          return this.chart["rootNodeStrokeColor"];
        } else {
          return null;
        }
      })
      .style("opacity", (data, index) => {
        if (data["data"][`${this.splitBy}`]) {
          return this.chart["splitOpacity"];
        } else {
          return null;
        }
      });

      simulation = d3.forceSimulation().force(
        "collision",
        d3.forceCollide().radius(function(data, index) {
          if (!data['children']) {
            return +data["r"];
          }
        })
      );

    nodes = pack.leaves();

    nodes.forEach(function(data) {
      if (data.value !== 0) {
        sortedNode.push(data);
      }
    });

    
    simulation.nodes(sortedNode);

    sortedNode.forEach((data, index) => {
      if (data["data"][`${this.splitBy}`]) {
        totalPreviousYearRadius += data.r;
        data[
          `${this.chartLabel["previousYearData"]}`
        ] = totalPreviousYearRadius;
      } else {
        totalCurrentYearRadius += data.r;
        data[`${this.chartLabel["currentYearData"]}`] = totalCurrentYearRadius;
      }
    });

    // percentage calculation
    currentYearPercent = this.utility.getPercentage(
      totalCurrentYearRadius,
      totalRadius
    );
    previousYearPercent = this.utility.getPercentage(
      totalPreviousYearRadius,
      totalRadius
    );
    // angle calculation
    currentYearAngle = this.utility.getAngle(currentYearPercent);
    previousYearAngle = this.utility.getAngle(previousYearPercent);
    // radians calculation
    currentYearRadians = this.utility.getRadians(currentYearAngle);
    previousYearRadians = this.utility.getRadians(previousYearAngle);

    bubble
      .on("mouseover", (data, index, nodes) => {
        //  tooltip body
        let tooltipList: string = "";
        for (let index = 0; index < this.tooltipBody.length; index++) {
          // format replacement
          let template: string = this.tooltipBody[index][FRONT_END_CONFIG.tooltip.tooltipBody.format];
          let templateKeys: Array<string> = template.match(this.regExp);
          for (let i = 0; i < templateKeys.length; i++) {
            templateKeys[i] = templateKeys[i].substring( 1,templateKeys[i].length - 1);
            if( templateKeys[i] === 'potential' ) {
              let format = d3.format('.2s');
              template = template.replace(
                FRONT_END_CONFIG.replaceKey + templateKeys[i] + FRONT_END_CONFIG.replaceKey,
                format(data["data"][templateKeys[i]])
              );
            } else {
              template = template.replace(
                FRONT_END_CONFIG.replaceKey + templateKeys[i] + FRONT_END_CONFIG.replaceKey,
                data["data"][templateKeys[i]]
              );
            }
          
          }
          // html setup - for indentation
          if ( this.tooltipBody[index][ FRONT_END_CONFIG.tooltip.tooltipBody.indent] &&
            this.tooltipBody[index][FRONT_END_CONFIG.tooltip.tooltipBody.indentationLevel] !== 0
          ) {
            if (
              this.tooltipBody[index][ FRONT_END_CONFIG.tooltip.tooltipBody.label].length > 0
            ) {
              tooltipList += `<tr><td style="padding-left: ${this.tooltipBody[index]
                [FRONT_END_CONFIG.tooltip.tooltipBody.indentationLevel] *10}px;">
                ${this.tooltipBody[index][FRONT_END_CONFIG.tooltip.tooltipBody.label]}
                </tr> <td class="align-right">${template}</td></tr>`;
            } else {
              tooltipList += `<tr><td style="padding-left: ${this.tooltipBody[index]
                [FRONT_END_CONFIG.tooltip.tooltipBody.indentationLevel] *10}px;">
                ${this.tooltipBody[index][ FRONT_END_CONFIG.tooltip.tooltipBody.format]}
                </td></tr>`;
            }
          } else {
            if (
              this.tooltipBody[index][FRONT_END_CONFIG.tooltip.tooltipBody.label].length > 0
            ) {
              tooltipList += `<tr><td>${ this.tooltipBody[index]
                [FRONT_END_CONFIG.tooltip.tooltipBody.label]}</td> 
                <td class="align-right">${template}</td></tr>`;
            } else {
              tooltipList += `<tr><td>${template}</td></tr>`;
            }
          }
        }

        // tooltip title - line 1
        let tooltipTitle: string = "";
        for (let index = 0; index < this.tooltipHeaderTitle.length; index++) {
          tooltipTitle += `<span class="first-child-right-bar">
            ${data["data"][this.tooltipHeaderTitle[index]]}</span>`;
        }
        let flags: Array<string> = data["data"][FRONT_END_CONFIG.flag];

        if(flags) {
          if(flags.length > 0) {
            for (let index = 0; index < flags.length; index++) {
              tooltipTitle += `<span class="img-flag">
              <img src="./assets/icon/worklist.flags/${data["data"][FRONT_END_CONFIG.flag][index]}.svg">
                </span>`;
            }
          }
        } 
      
        // tooltip title - line 2
        let tooltipSubTitle: string = "";
        for (let index = 0;index < this.tooltipHeaderSubtitle.length;index++) {
          tooltipSubTitle += `<h5>${data["data"][this.tooltipHeaderSubtitle[index]]}</h5>`;
        }

        if (index !== 0) {
          d3.select(nodes[index]).style("cursor", "pointer");
          tooltip
            .html(
              `
                  <div class="chart-tooltip-card bub-chart-tooltip-card">
                       <div class="chart-tooltip-header">
                           <div class="chart-tooltip-header-icon">
                             <img src="./assets/img/${BUBBLE_CHART_ICON_CONFIG[
                               data['data'][FRONT_END_CONFIG.icon]]
                              }.png">
                           </div>
                           <div class="chart-tooltip-header-ipc-detail">
                               <div class="chart-tooltip-header-ipc-icon-detail">
                                   ${tooltipTitle}
                               </div>
                               <div class="chart-tooltip-header-ipc">
                                   ${tooltipSubTitle}
                               </div>
                           </div>
                       </div>
                       <div class="chart-tooltip-content">
                         <table>
                             ${tooltipList}
                         </table>
                       </div>
                   </div>
                   `
            )
            .style("display", "inline");
        }
      })
      .on("mousemove", (data, index) => {
        if (index !== 0) {
          tooltip.style("display", "inline");

          if ( d3.event.offsetX >= this.bubChartTooltip.nativeElement.clientWidth / 2) {
            tooltip
              .select("div")
              .classed("chart-tooltip-card", true)
              .classed("bub-chart-tooltip-card", true);
            tooltip
              .style("top",d3.event.layerY -(this.bubChartTooltip.nativeElement.clientHeight + 7) - (d3.event.offsetY - data.y + data.r) +"px")
              .style("left", d3.event.layerX - this.bubChartTooltip.nativeElement.clientWidth / 2 -(d3.event.offsetX - (data.x - data.r) - (data.r - 5)) +"px");
          } else {
            tooltip
              .select("div")
              .classed("right-side-tooltip", true)
              .classed("bub-chart-tooltip-card", true);
            tooltip
              .style("top", d3.event.layerY - (this.bubChartTooltip.nativeElement.clientHeight + 7) - (d3.event.offsetY - data.y + data.r) +"px")
              .style("left", d3.event.layerX -(d3.event.offsetX - (data.x - data.r) - (data.r - 7)) +"px");
          }
        }
      })
      .on("mouseout", function(data, index) {
        tooltip.style("display", "none");
      })
      .on("click", (data, index, n) => {
        if (index !== 0) {
         window.open("/" + data["data"][`${FRONT_END_CONFIG.navigationUrl}`]); 
        }
      });
 
  bubble
    .attr("cx", function(data, index) {
      return data.x;
    })
    .attr("cy", function(data, index) {
      return data.y;
    });

    this.enableLoader = false;
    // Legend
    this.getLegend(yoy, colors, previousYearLegend, currentYearLegend);
    // to change legend header - dropdown changes
    this.prevSelectedDropDown = this.activeDropDownOption;
  }

  /**
   * // TODO: Plot Legend details
   * @param - yoy: boolean, colors: Array<string>, previousYearLegend: Array<string>, currentYearLegend: Array<string>
   * @returns - void
   */
  getLegend(
    yoy: boolean,
    colors: Array<string>,
    previousYearLegend: Array<string>,
    currentYearLegend: Array<string>
  ) {
    if (yoy) {
      // Legend body
      let previousYearLegendBodyContent: Array<string> = [];
      let currentYearLegendBodyContent: Array<string> = [];
      // Header
      let previousYearLegendTitle: Array<string> = [];
      let currentYearLegendTitle: Array<string> = [];
      // legend header
      Object.keys(this.legendHeader).forEach(data => {
        if (data === FRONT_END_CONFIG.legend.split.header.rightAlignment.key) {
          Object.keys(this.legendHeader[data]).forEach(subElement => {
            // template changes
            previousYearLegendTitle = this.changeTemplate(
              this.legendHeader[data][subElement],
              this.apiData[FRONT_END_CONFIG.totalPreviousYearLabel],
              previousYearLegendTitle
            );
          });
        } else if ( data === FRONT_END_CONFIG.legend.split.header.leftAlignment.key) {
          Object.keys(this.legendHeader[data]).forEach(subElement => {
            currentYearLegendTitle = this.changeTemplate(
              this.legendHeader[data][subElement],
              this.apiData[FRONT_END_CONFIG.totalCurrentYearLabel],
              currentYearLegendTitle
            );
          });
        }
      });

      for(let i = 0; i < currentYearLegend.length; i++) {
        currentYearLegendBodyContent = this.changeLegendTemplate(this.legendBodyFormat, currentYearLegend[i], currentYearLegendBodyContent);
      }

      for(let i = 0; i < previousYearLegend.length; i++) {
        previousYearLegendBodyContent = this.changeLegendTemplate(this.legendBodyFormat, currentYearLegend[i], previousYearLegendBodyContent);
      }

      this.leftLegend = currentYearLegendBodyContent;
      this.rightLegend = previousYearLegendBodyContent;
      this.rightLegendTitle = previousYearLegendTitle;
      this.leftLegendTitle = currentYearLegendTitle;

    } else {
      let currentYearLegendContent: Array<any> = [];
      // change legend template - dropdown changes
      if (this.activeDropDownOption.length > 0 && this.enableGroupLegendHeaderTitle) {
        let template: string = JSON.stringify(this.legendHeader);
        if (template.includes(FRONT_END_CONFIG.dropDownKey)) {
          template = template.replace(new RegExp(FRONT_END_CONFIG.percentage, 'g'), '');
          template = template.replace(
            FRONT_END_CONFIG.replaceKey + FRONT_END_CONFIG.dropDownKey + FRONT_END_CONFIG.replaceKey,
            FRONT_END_CONFIG.replaceKey + this.activeDropDownOption + FRONT_END_CONFIG.replaceKey
          );
          template = template.replace(
            FRONT_END_CONFIG.dropDownKey,
            this.activeDropDownOption
          );
        } else {
          template = template.replace(new RegExp(FRONT_END_CONFIG.percentage, 'g'), '');
          template = template.replace(
            this.prevSelectedDropDown, 
            FRONT_END_CONFIG.replaceKey + this.activeDropDownOption +FRONT_END_CONFIG.replaceKey
          );
          template = template.replace(
            this.prevSelectedDropDown,
            this.activeDropDownOption
          );
        }
        this.legendHeader = JSON.parse(template);
      }


      // Legend Header
      let currentYearLegendTitle: Array<string> = [];
      Object.keys(this.legendHeader).forEach(data => {
        if (data === FRONT_END_CONFIG.legend.split.header.rightAlignment.key) {
          Object.keys(this.legendHeader[data]).forEach(subElement => {
            if(this.legendHeader[data][subElement].length > 0) {
              currentYearLegendTitle = this.changeTemplate(
                this.legendHeader[data][subElement],
                this.apiData[FRONT_END_CONFIG.totalCurrentYearLabel],
                currentYearLegendTitle
              );
            }
          });
        }
      });

      for(let i = 0; i < currentYearLegend.length; i++) {
        currentYearLegendContent = this.changeLegendTemplate(this.legendBodyFormat, currentYearLegend[i], currentYearLegendContent);
      }

      this.rightLegend = currentYearLegendContent;
      this.rightLegendTitle = currentYearLegendTitle;
    }
  }

  /**
   * // TODO: Change template from back-end
   * @param - (template: string, apiData: any, result: any[]
   * @returns - Array<string>
   */
  changeTemplate(template: string, apiData: string, result: Array<string>): Array<string> {
    let templateKeys: Array<string> = template.match(this.regExp);
    if (templateKeys !== null) {
      for (let i = 0; i < templateKeys.length; i++) {
        if (templateKeys[i] === FRONT_END_CONFIG.replaceKey + this.chartLabel["activeDateRangeLabel"] + FRONT_END_CONFIG.replaceKey) {
          template = template.replace(templateKeys[i], this.activeDateValue);
        } else {
          if(this.chartConfig[FRONT_END_CONFIG.legendFormat][this.activeDropDownOption] === FRONT_END_CONFIG.percentageValue) {
            template = template.replace(
              templateKeys[i],
              apiData[templateKeys[i].substring(1, templateKeys[i].length - 1)] + FRONT_END_CONFIG.percentage
            );
          } else {
            template = template.replace(
              templateKeys[i],
              apiData[templateKeys[i].substring(1, templateKeys[i].length - 1)]
            );
          }
        }
      }
      result.push(template);
    } else if (templateKeys === null && template.length > 0) {
      result.push(template);
    }
    return result;
  }

  /**
  * // TODO: Change template from back-end
  * @param - (template: string, apiData: any, result: any[]
  * @returns - Array<object>
  */
  changeLegendTemplate(template: string, apiData: string, result: any): any {
    let templateKeys: Array<string> = template.match(this.regExp);
    if (templateKeys !== null) {
      for (let i = 0; i < templateKeys.length; i++) {
        if (templateKeys[i] === FRONT_END_CONFIG.replaceKey + this.chartLabel["activeDateRangeLabel"] + FRONT_END_CONFIG.replaceKey) {
          template = template.replace(templateKeys[i], this.activeDateValue);
        } else if (Math.floor(Math.log(apiData[templateKeys[i].substring(1, templateKeys[i].length - 1)]) / Math.LN10 + 1) > 3){
          let format = d3.format('.2s');
          template = template.replace(
            templateKeys[i],
            format(apiData[templateKeys[i].substring(1, templateKeys[i].length - 1)])
          );
        } else {
          template = template.replace(
            templateKeys[i],
            apiData[templateKeys[i].substring(1, templateKeys[i].length - 1)]
          );
        }
      }
      result.push({color: apiData['color'], template: template});
    } else if (templateKeys === null && template.length > 0) {
      result.push({color: apiData['color'], template: template});
    }
    return result;
  }
}
