import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as d3 from "d3";
// config
import {
  FRONT_END_BAR_CHART_CONFIG,
  BAR_CHART_CONFIG
} from "../../../_config/bar-chart/bar-chart.config";
// service
import { DashboardService } from "src/app/_services/+dashboard/dashboard.service";
import { BarChartService } from "src/app/_services/+dashboard/bar-chart/bar-chart.service";
import { ConfigService } from "../../../_services/+dashboard/config.service";
import { AppBroadCastService } from '../../../_services/app.broadcast.service';
import { ToastrService } from "ngx-toastr";
// common
import { ErrorMessage } from '../../../_shared/messages/ErrorMessage';
import { AppDataService } from "src/app/_services";

@Component({
  selector: "app-bar-chart",
  templateUrl: "./bar-chart.component.html",
  styleUrls: ["./bar-chart.component.scss"]
})
export class BarChartComponent implements OnInit {
  // Dynamic width 
  @ViewChild('chartXaxis') chartWidth: ElementRef;
  @ViewChild('barChartTooltip') chartTooltip: ElementRef;
  @ViewChild('barChartYAxisTooltip') chartYAxisTooltip: ElementRef;

  constructor(
    public http: HttpClient,
    private dashboardService: DashboardService,
    private barservice: BarChartService,
    private configService: ConfigService,
    private broadCastService: AppBroadCastService,
    private toastrService: ToastrService,
    private appData: AppDataService
  ) { }

  // Group Formation
  public groupData: any[] = [];
  public updatedData;
  public count;
  public totalCount;
  public apiData: {};
  public DD_Group;
  public DD_Sort;
  public initialGParm;
  public groupParam;
  public stackkey = [];
  

  public groupDetail = "";
  public config;
  public axisData = [];

  // Sort Functions
  public searchText: String = "";
  public searchData;
  public sortParam;
  public previousParam = "";
  public sortkey = BAR_CHART_CONFIG.sort;
  public selectedSortField;

  // Axis
  public yLabel: any;
  public YLabelData = [];
  public toolTipKeys = [];
  public yaxisHeight;
  public xAxis;
  public maxValue;

  // Tooltip
  public toolPotential = BAR_CHART_CONFIG.toolPotential;
  public toolLeft = BAR_CHART_CONFIG.toolLeft;
  public toolTop = BAR_CHART_CONFIG.toolTop;
  public colorArray = [];
  public domainArray = [];
  public color = [];
  public tooltipPersonalWashIcon = BAR_CHART_CONFIG.tooltipPersonalWashIcon;

  public legendArray: any;
  public legendKey = [];
  public colorCode = [];
  public legends = [];
  public regExp;

  public gridLine = BAR_CHART_CONFIG.gridline;
  public defaultSort = BAR_CHART_CONFIG.sort.ascending;
  public descending = BAR_CHART_CONFIG.sort.descending;
  public secLvlDropdownKey = BAR_CHART_CONFIG.legendKey;
  public sortby = BAR_CHART_CONFIG.sort.sortby;
  public style = BAR_CHART_CONFIG.style;
  public defaultHeight = BAR_CHART_CONFIG.defaultIPCHeight;
  public svgHeight = BAR_CHART_CONFIG.defaultSVGHeight;
  public defaultCount = BAR_CHART_CONFIG.defaultCount;

  public project = BAR_CHART_CONFIG.project;
  public potential: string = BAR_CHART_CONFIG.potential;
  public placeholder = BAR_CHART_CONFIG.placeholder;

  private tooltipBody: any;
  private tooltipHeader: any;
  private tooltipHeaderTitle: any;
  private tooltipHeaderSubtitle: any;
  private activeDateRange: string;
  private activeDateValue: string;
  private activeFirstLevelTab: string;
  private activeSecondLevelTab: string;
  private activeType: string;
  private activeSecondLevelTabToggle: string[];
  private activeHeaderToggle: string;
  private activeDropDownOption: string;
  private activeDashboard: string;
  private previousFirstLevelTab: string;
  private headerFilter: object;

  public sortByKey: string;
  public sortByValue: string;
  public groupByKey: string;
  public groupByValue: string;
  private groupByLabel: string;
  private stackSeries: any;
  private startDate: string;
  private endDate: string;
  private DD: any;
  private initial_DD_Sort: any;
  private searchInputData: string = '';
  public enableLoader: boolean = true;
  public sortParamValue: string;
  public yAxisTooltip: any;
  public yAxisTotalPopOverContent: any[] = [];
  public prevFilters: any;
  public filters: any;
  public yAxisPopOverContent: string[];
  public direction: string = 'ASC';
  public prevFirstLevelTab: string;
  public prevSecondLevelTab: string;
  public prevType: string;
  public prevDateRange: string;
  public prevHeaderToggle: string;
  public prevHeaderFilter: object;
  public prevDropdown: string = '';
  public selectedGroupObj: any;
  public searchFlag: boolean = false;
  public totalDataCount: any;
  public configData: Object;

  public enableGroupDetail: boolean = false;
  public sortByOption: any;
  public sortByAPI: any;
  public yAxisDomain: any[] = [];

  private interval;
  private delay = 100; // 100 milli second delay
  private limit = 100;
  private start = 0;
  private end = this.limit;
  private lazyFn;

   // Disable KeyValue pipe order - HTML template
   public sortFn = (a, b) => 0;

  peakValue: number = 0;
  width = BAR_CHART_CONFIG.barWidth;
  height =
    this.style.svg_height -
    BAR_CHART_CONFIG.margin.top -
    BAR_CHART_CONFIG.margin.bottom;

  ngOnInit() {
    if(localStorage.getItem('enablePrint') === 'true') {
      // Portfolio tabs
      this.dashboardService.tabDetails.subscribe(tabDetails => {
        this.activeFirstLevelTab = tabDetails.frstLvlTabKey;
        this.activeSecondLevelTab = tabDetails.secLvlTabKey;
      });
      this.dashboardService.legends.subscribe(data => {
        this.legendArray = data;
        this.colorArray = this.legendArray.colors;
        this.domainArray = this.legendArray.domains;
      });
      this.dashboardService.updateFilterSettings.subscribe(response => {
        this.startDate = response.startDate;
        this.endDate = response.endDate;
        this.headerFilter = response.headerFilter;
        this.activeDateRange = response.dateKey;
        this.activeType = response.sortedOption;
        this.filters = response.filters;
      });
      this.dashboardService.chartDetail.subscribe(chartChanges => {
        this.activeHeaderToggle = chartChanges.headerToggle;
        this.activeDropDownOption = chartChanges.dropDown;
      });
      this.configData = JSON.parse(localStorage.getItem('barChartConfig'));
      this.configSetup();
    } else {
      // Portfolio tabs
      this.dashboardService.tabDetails.subscribe(tabDetails => {
        this.activeFirstLevelTab = tabDetails.frstLvlTabKey;
        this.activeSecondLevelTab = tabDetails.secLvlTabKey;
        this.enableGroupDetail = false;
      });

         // Color Legends for Bar chart
         this.dashboardService.legends.subscribe(data => {
          this.legendArray = data;
          this.colorArray = this.legendArray.colors;
          this.domainArray = this.legendArray.domains;
          this.getConfigInfo();
        });
    } 
  }

  /**
   * Formation of API data for group function and tooltip info
   * @param responseData
   * @param option
   * return void
   */
  getGroup(responseData, option) {
    // yet to implement
    this.width = this.chartWidth.nativeElement.clientWidth - 220;
    let dataArray = [];
    this.stackkey = [];
    let valueParam;
    this.updatedData = responseData;
    let stack = "";
    let maxKey = 0;
    let maxGroupKey = [];
    let innerTemplate = [];

    // Group based on the second level tabs
    // this.activeSecondLevelTab === BAR_CHART_CONFIG.product
    //   ? (valueParam = BAR_CHART_CONFIG.ingredient)
    //   : (valueParam = BAR_CHART_CONFIG.valuePotential);
    // if (this.activeSecondLevelTab === 'outflow') {
    //   valueParam = BAR_CHART_CONFIG.valuePotential;
    // }
    valueParam = this.configData[BAR_CHART_CONFIG.stackHeight];

    Object.keys(this.updatedData).forEach((data,i)  => {
      if(i === 0) {
        let ipcDetails = this.updatedData[data].ipc;
        Object.keys(ipcDetails).forEach(groupKey => {
          Object.keys(ipcDetails[groupKey][0]).forEach(key => {
            innerTemplate.push(key);
          })
        });
      }
    })

    Object.keys(this.updatedData).forEach((data,i)  => {
        let ipcDetails = this.updatedData[data]['ipc'], category: Array<string> = [];
        Object.keys(ipcDetails).forEach(groupKey => {
          category.push(groupKey);
          let count = Object.keys(this.updatedData[data]['ipc'][groupKey]).length;
          category.forEach(key => {
            if (!category.includes(key)) {
              this.updatedData[data].ipc[key]= [];
              // for(let i = 0;i< count;i++) {
                this.updatedData[data].ipc[key][0] = {};
                innerTemplate.forEach(template => {
                  this.updatedData[data].ipc[key][0][template] = 0;
                });
              // }
            }
          })
        });
    })


    Object.keys(this.updatedData).forEach(i => {
      let groupData = {}, category: Array<string> = [],
        ipcDetails = this.updatedData[i].ipc;
      this.axisData.push(this.updatedData[i]);
      // Iterate the object data for axis and tooltip
      Object.keys(ipcDetails).forEach((groupKey, index) => {
        let ipc = ipcDetails[groupKey];
        if (
          maxGroupKey[groupKey] === undefined ||
          maxGroupKey[groupKey] <= ipc.length
        ) {
          maxGroupKey[groupKey] = ipc.length;
        }
        for (let j = 0; j < ipc.length; j++) {
          let keys = groupKey + BAR_CHART_CONFIG.underscore + j;

          let value = ipc[j][valueParam];
          groupData[keys] = value;
          if(value !== 0) {
            groupData[keys + BAR_CHART_CONFIG.tooltipData] = ipcDetails[groupKey][j];
          }
          let count = Object.keys(this.updatedData[i]['ipc'][groupKey]).length;
          
          if (!this.stackkey.includes(keys)) {
            this.stackkey.push(keys);
          }
        }
      });
      dataArray.push(groupData);
      this.groupData = dataArray;
    });

    this.groupData.map((groupData, i) => {
        this.stackkey.forEach(key => {
          if(!groupData[key]) {
            groupData[key] = 0;
          }
        })
    })
    // Sorting
    this.searchData = this.groupData;
    this.sortFunction(this.groupByValue);
  }

  /**
   * Subscribe the config info for barchart
   * return void
   */
  getConfigInfo() {
    this.configService.chartConfig.subscribe(configuration => {
      if (configuration["barChart"]) {
        this.configData = configuration["barChart"];
        localStorage.setItem('barChartConfig', JSON.stringify(this.configData));
        this.configSetup();
      }
    });
  }

  /**
   * Showing the total count of bar charts
   * @param showData
   * return void
   */
  getShowingDetail(showData) {
    this.groupDetail = "";
    let configHeader = this.configData[FRONT_END_BAR_CHART_CONFIG.groupDetail];
    this.groupDetail = configHeader;
    for (let i = 0; i < showData.length; i++) {
      if (this.searchFlag == true && i == 1) {
        this.groupDetail = this.groupDetail.replace(
          BAR_CHART_CONFIG.showDetail[1],
          this.totalDataCount
        )
      } else {
        if(this.searchFlag == false) {
          this.totalDataCount = showData[1];
        }
        this.groupDetail = this.groupDetail.replace(
          BAR_CHART_CONFIG.showDetail[i],
          showData[i]
        );
      }
    }
    this.enableGroupDetail = true;
  }

  /**
   * Config details updated in the paramters
   * like Group dropdown and Sort Dropdown
   */
  configSetup() {
    let sort = Object.assign({}, this.configData[FRONT_END_BAR_CHART_CONFIG.sort]);
    this.groupDetail = this.configData[FRONT_END_BAR_CHART_CONFIG.groupDetail];
    this.groupByLabel = this.groupDetail;
    this.DD_Group = this.configData[FRONT_END_BAR_CHART_CONFIG.group][
      FRONT_END_BAR_CHART_CONFIG.grouplist
    ];
    this.initialGParm = this.configData[FRONT_END_BAR_CHART_CONFIG.groupBy.key][
      FRONT_END_BAR_CHART_CONFIG.groupBy.default
    ];

    this.sortByKey = this.initialGParm;
    this.groupParam = this.DD_Group[this.initialGParm];
    this.DD = this.configData['dropDown'];
    this.initial_DD_Sort = sort;
    this.sortByKey = this.initialGParm;
    // default groupby key
    this.groupByKey = this.initialGParm;
    // default groupby value
    this.groupByValue = this.groupParam;
    this.selectedSortField = this.groupParam;
    this.sortParam = this.groupParam;
    this.sortByValue = this.sortParam;
    this.sortByOption = this.sortByKey;
    this.sortParamValue = this.sortParam;
    sort[this.initialGParm] = this.groupParam;
    this.DD_Sort = sort;

    this.selectedGroupObj = {
      key: Object.keys(this.DD_Sort).find(key => this.DD_Sort[key] === this.groupParam),
      value: this.DD_Sort[this.initialGParm]
    };

    this.xAxis = this.configData[FRONT_END_BAR_CHART_CONFIG.xaxis];
    this.yLabel = this.configData[FRONT_END_BAR_CHART_CONFIG.yaxis];
    this.regExp = new RegExp(
      BAR_CHART_CONFIG.regExpPattern,
      BAR_CHART_CONFIG.regExpFlag
    );

    // tooltip header
    this.tooltipHeader = this.configData[BAR_CHART_CONFIG.tooltip.key][
      BAR_CHART_CONFIG.tooltip.tooltipHeader.key
    ];
    // tooltip body content
    this.tooltipBody = this.configData[BAR_CHART_CONFIG.tooltip.key][
      BAR_CHART_CONFIG.tooltip.tooltipBody.key
    ];
    // overlay - tooltip
    this.tooltipHeaderTitle = this.configData[BAR_CHART_CONFIG.tooltip.key][
      BAR_CHART_CONFIG.tooltip.tooltipHeader.key][BAR_CHART_CONFIG.tooltip.tooltipHeader.title];
    this.tooltipHeaderSubtitle = this.configData[BAR_CHART_CONFIG.tooltip.key][
      BAR_CHART_CONFIG.tooltip.tooltipHeader.key][BAR_CHART_CONFIG.tooltip.tooltipHeader.subTitle];

      if(localStorage.getItem('enablePrint') === 'true') {
        this.apiData = JSON.parse(localStorage.getItem('barChartResponse'));
        this.activeDropDownOption = localStorage.getItem("activeDropDownOption");
        this.removeSVG();
        this.searchFlag = false;
        this.getGroup(this.apiData, false);
      } else {
          // this.initialLoading();
      // }
        // Sort option dropdown changes
        this.dashboardService.updateFilterSettings.subscribe(response => {
          this.startDate = response.startDate;
          this.endDate = response.endDate;
          this.headerFilter = response.headerFilter;
          this.activeDateRange = response.dateKey;
          this.activeType = response.sortedOption;
          this.filters = response.filters;
          this.dashboardService.chartDetail.subscribe(chartChanges => {
            this.activeHeaderToggle = chartChanges.headerToggle;
            this.activeDropDownOption = chartChanges.dropDown;
            if (this.activeSecondLevelTab && this.activeFirstLevelTab && this.activeDateRange) {
              if ((this.prevFirstLevelTab !== this.activeFirstLevelTab) ||
                (this.prevSecondLevelTab !== this.activeSecondLevelTab) ||
                (this.prevType !== this.activeType) ||
                (this.prevDateRange !== this.activeDateRange) ||
                (this.prevHeaderToggle !== this.activeHeaderToggle) ||
                (this.prevHeaderFilter !== this.headerFilter) ||
                (this.prevDropdown !== this.activeDropDownOption) ||
                (JSON.stringify(this.prevFilters) !== JSON.stringify(this.filters))
              ) {
                this.prevFirstLevelTab = this.activeFirstLevelTab;
                this.prevSecondLevelTab = this.activeSecondLevelTab;
                this.prevType = this.activeType;
                this.prevDateRange = this.activeDateRange;
                this.prevHeaderToggle = this.activeHeaderToggle;
                this.prevHeaderFilter = this.headerFilter;
                this.prevFilters = Object.assign({}, this.filters);
                this.prevDropdown = this.activeDropDownOption;

                if(this.activeSecondLevelTab === 'product') {
                  if(!this.DD[this.sortByKey]) {
                    this.sortByAPI = this.activeDropDownOption;
                  } else {
                    this.sortByAPI = this.sortByKey;
                  }
                } else if(this.activeSecondLevelTab === 'winrate'){
                  this.sortByAPI =  this.activeDropDownOption;
                } else {
                  this.sortByAPI =  '';
                }
                if((this.activeSecondLevelTab === 'winrate'  ) || 
                  (this.activeSecondLevelTab === 'product' )) {
                      if(this.activeDropDownOption.length > 1) {
                        this.prevDropdown = this.activeDropDownOption;
                        this.initialLoading();
                      }
                }else {
                  this.initialLoading();
                }
              }
            }
          });
        });
      }
  }

  /**
   * Update the Y Label keys and show the y-axis in the bar chart.
   * return void
   */
  getYLabel() {
    this.yAxisTotalPopOverContent = [];
    this.yAxisTooltip = d3
      .select(".bar-container")
      .select(".bar-chart-y-axis-tooltip")
      .style("display", "none")
      .style("position", "absolute")
      .style("opacity", "0");

    let check, ylabel = this.yLabel, yaxisData = [];
    if (this.updatedData) {
      let million = BAR_CHART_CONFIG.million;
      Object.values(this.updatedData).forEach(data => {
        let uniqueScentPortfolioNo: number;
        let uniqueScentPortfolioName: string = '';
        let scentPortfolioNames: Array<string> = [];
        let projectsNames: Array<string> = [];
        let uniqueProjectNo: number;
        let uniqueProjectName: string = '';
        if (data[this.configData[BAR_CHART_CONFIG.dataKey]]) {
          if (data[BAR_CHART_CONFIG.scentPortfolio]) {
            scentPortfolioNames = data[BAR_CHART_CONFIG.scentPortfolio].split(',')
            this.yAxisPopOverContent = scentPortfolioNames;
            if (scentPortfolioNames.length === 1) {
              uniqueScentPortfolioName = scentPortfolioNames[0];
            }
            else {
              uniqueScentPortfolioNo = scentPortfolioNames.length;
              uniqueScentPortfolioName = '';
            }
          }
          else if (data[BAR_CHART_CONFIG.projects]) {
            projectsNames = data[BAR_CHART_CONFIG.projects].split(',')
            this.yAxisPopOverContent = projectsNames;
            if (projectsNames.length === 1) {
              uniqueProjectName = projectsNames[0];
            } else {
              uniqueProjectNo = projectsNames.length;
              uniqueProjectName = '';
            }
          }
          this.yAxisTotalPopOverContent.push(this.yAxisPopOverContent);
        }
        let YlabelKeys = ylabel.match(this.regExp);
        let updateKey = this.yLabel;
        for (let j = 0; j < YlabelKeys.length; j++) {
          YlabelKeys[j] = YlabelKeys[j].substring(1, YlabelKeys[j].length - 1);
          let sortKey = this.selectedSortField.replace(/ /g, BAR_CHART_CONFIG.underscore);
          let selectSortKey = BAR_CHART_CONFIG[sortKey];
          if (
            this.activeSecondLevelTab === BAR_CHART_CONFIG.productTab &&
            selectSortKey === YlabelKeys[j]
          ) {
            updateKey = updateKey.replace(
              BAR_CHART_CONFIG.replaceKey +
              YlabelKeys[j] +
              BAR_CHART_CONFIG.replaceKey,
              BAR_CHART_CONFIG.boldOpenTag +
              data[YlabelKeys[j]] +
              BAR_CHART_CONFIG.boldCloseTag
            );
          } else if (
            this.activeSecondLevelTab !== BAR_CHART_CONFIG.productTab &&
            YlabelKeys[j].includes(this.toolPotential)
          ) {
            let value, format = d3.format('.2s');
            if(Math.floor(Math.log(data[YlabelKeys[j]]) / Math.LN10 + 1) > 3) {
              value = format(data[YlabelKeys[j]]);
            } else {
              value = data[YlabelKeys[j]];
            }
            updateKey = updateKey.replace(
              BAR_CHART_CONFIG.replaceKey +
              YlabelKeys[j] +
              BAR_CHART_CONFIG.replaceKey,
              value
            );
          } else {
            if (YlabelKeys[j] === BAR_CHART_CONFIG.portFolioName) {
              if (uniqueScentPortfolioName.length > 1) {
                updateKey = updateKey.replace(
                  BAR_CHART_CONFIG.replaceKey +
                  YlabelKeys[j] +
                  BAR_CHART_CONFIG.replaceKey,
                  uniqueScentPortfolioName
                );
              } else {
                updateKey = updateKey.replace(
                  BAR_CHART_CONFIG.replaceKey +
                  YlabelKeys[j] +
                  BAR_CHART_CONFIG.replaceKey,
                  'Scent Portfolio : ' +
                  uniqueScentPortfolioNo
                );
              }
            } else if (YlabelKeys[j] === BAR_CHART_CONFIG.projects) {
              if (uniqueProjectName.length > 1) {
                updateKey = updateKey.replace(
                  BAR_CHART_CONFIG.replaceKey + YlabelKeys[j] + BAR_CHART_CONFIG.replaceKey, uniqueProjectName
                )
              } else {
                updateKey = updateKey.replace(
                  BAR_CHART_CONFIG.replaceKey + YlabelKeys[j] + BAR_CHART_CONFIG.replaceKey, uniqueProjectNo
                )
              }
            } else {
              updateKey = updateKey.replace(
                BAR_CHART_CONFIG.replaceKey +
                YlabelKeys[j] +
                BAR_CHART_CONFIG.replaceKey,
                data[YlabelKeys[j]]
              );
            }

            Object.keys(this.DD).forEach(option => {
              if ((this.sortByAPI === option) && (this.sortByAPI === YlabelKeys[j])) {
                updateKey = updateKey.replace(
                  YlabelKeys[j],
                  YlabelKeys[j] + ' active-type'
                )
              }
            })
          }
        }
        yaxisData.push(updateKey);
      });
      this.YLabelData = yaxisData;

    } else {
      yaxisData = [];
      this.YLabelData = yaxisData;
    }
  }

  /**
   * Initial chart loading
   * @param no params
   * return void
   */
  initialLoading() {
    this.getChartData(false);
  }

  /**
   * Data API call
   * @param enableSort: boolean
   * return void
   */
  getChartData(enableSort: boolean) {
    let param = {
      scentPortfolio: this.activeFirstLevelTab,
      sortBy: this.activeType,
      groupBy: this.groupByKey,
      dropdown: this.sortByAPI,
      headerTab: this.activeHeaderToggle,
      headerFilter: this.headerFilter,
      startDate: this.startDate,
      endDate: this.endDate,
      customFilter: this.searchText,
      orderBy: {
        [this.sortByKey]: this.direction
      },
      filter: this.filters
    };
    this.broadCastService.onUpdateAppSpinnerPrompt('Getting Bar chart details.....');
    this.barservice.getBarData(
      this.activeSecondLevelTab,
      param, 
      this.activeDateRange, 
      this.dashboardService.dashboardPermission['WriteFlag']
    ).subscribe(
      data => {
        if (Object.keys(data).length >= 1) {
          if (data) {
            this.resetScrollFields();
            // Color Legends for Bar chart
            this.dashboardService.legends.subscribe(legend => {
              this.legendArray = legend;
              this.colorArray = this.legendArray.colors;
              this.domainArray = this.legendArray.domains;
              this.apiData = data ;
            });
            localStorage.setItem('barChartResponse', JSON.stringify(data));
            this.removeSVG();
            this.searchFlag = false;
            this.getGroup(this.apiData, enableSort);
            this.broadCastService.onUpdateAppSpinnerPrompt('');
          }
        } else {
          this.toastrService.error(`No data found for bar chart!`);
          this.removeSVG();
          this.broadCastService.onUpdateAppSpinnerPrompt('');
        }
      },
      error => {
        this.toastrService.error(ErrorMessage.BarChartResponseFailure);
        this.removeSVG();
        this.broadCastService.onUpdateAppSpinnerPrompt('');
      }
    );
  }

  /**
   * Plot the X-axis based on second level tab.
   * return void
   */
  getXaxis() {
    d3.selectAll("#Xaxis")
      .select("svg")
      .remove();

    let svg = d3
      .select("#Xaxis")
      .append("svg")
      .attr(
        "width",
        this.width + BAR_CHART_CONFIG.margin.right + 8
      )
      .attr("height", BAR_CHART_CONFIG.axis.X_height)
      .append("g")
      .attr(
        "transform",
        "translate(" +
        this.style.tickCount +
        "," +
        BAR_CHART_CONFIG.margin.top +
        ")"
      );

    let x = d3.scaleLinear().range([0, this.width]);

    x.domain([0, this.peakValue]).nice();

    svg
      .append("g")
      .attr("transform", "translate(0," + 0 + ")")
      .call(this.xAxisFormat(x))
      .style("font-size", this.style.fontSize)
      .select("path")
      .style("display", "none");
  }

  /**
   * Plot the X axis format based on value
   * @param potential or ingredient
   */
  xAxisFormat(xValue) {
    let million = BAR_CHART_CONFIG.million;
    // X axis data shown in percentage based on second level tab
    if (this.activeSecondLevelTab === 'product') {
      let formatPercent = d3.format(".0%");
      return d3
        .axisTop(xValue)
        .tickSize(0)
        .ticks(10)
        .tickFormat(d => {
          return this.getTickFormat(d);
        });
    } else if (this.activeSecondLevelTab === 'inflow') {
      // X axis data shown in potential based on second level tab
      return d3
        .axisTop(xValue)
        .tickSize(0)
        .ticks(10)
        .tickFormat(function (d: any, i) {
          let format = d3.format('.2s');
          if(Math.floor(Math.log(d) / Math.LN10 + 1) > 3) {
            return format(d);
          } else {
            return d;
          }
        })
    } else if (this.activeSecondLevelTab === 'outflow') {
      return d3
        .axisTop(xValue)
        .tickSize(0)
        .ticks(10)
        .tickFormat(function (d: any, i) {
          let format = d3.format('.2s');
          if(Math.floor(Math.log(d) / Math.LN10 + 1) > 3) {
            return format(d);
          } else {
            return d;
          }
        })
    } else if(this.activeSecondLevelTab === 'winrate'){
        // X axis data shown in potential based on second level tab
        return d3
          .axisTop(xValue)
          .tickSize(0)
          .ticks(10)
          .tickFormat(function (d: any, i) {
            let format = d3.format('.2s');
            if(Math.floor(Math.log(d) / Math.LN10 + 1) > 3) {
              return format(d);
            } else {
              return d;
            }
          })
    } else {
      return d3
      .axisTop(xValue)
      .tickSize(0)
      .ticks(10)
      .tickFormat(function (d: any, i) {
        let format = d3.format('.2s');
        if(Math.floor(Math.log(d) / Math.LN10 + 1) > 3) {
          return format(d);
        } else {
          return d;
        }
      })
    }
  }

  getTickFormat(d: d3.AxisDomain): string {
    if(this.sortByAPI === 'LINESOFFORMULA') {
      return d + '';
    } else {
      return d + "%";
    }
  }

  /**
   * Subscribe the grouping data based on Group Type
   * @param groupType
   */
  getGroupData(groupType) {
    this.selectedGroupObj = groupType;
    this.groupByValue = groupType.value;
    this.groupByKey = groupType.key;
    this.sortParam = groupType.value;
    this.sortByKey = groupType.key;
    this.direction = "ASC";
    this.DD_Sort = Object.assign({}, this.configData[FRONT_END_BAR_CHART_CONFIG.sort]);
    let sortby = this.DD_Sort;
    sortby[this.groupByKey] = this.groupByValue;
    this.DD_Sort = sortby;
    this.selectedSortField = groupType.value;
    this.groupParam = groupType.value;
    this.sortByValue = groupType.value;
    if(this.activeSecondLevelTab === 'product') {
      if(!this.DD[this.sortByKey]) {
        this.sortByAPI = this.activeDropDownOption;
      } else {
        this.sortByAPI = this.sortByKey;
      }
    }
    // API call
    this.getChartData(false);
  }

  /**
   * Subscribe the data and sorting subscribed data based on sort key
   * @param key
   */
  getSortData(key) {
    this.sortParam = key.value;
    this.sortByValue = key.value;
    this.sortParamValue = this.sortParam;
    // this.sortByKey = key.key;
    if (this.sortByKey === key.key) {
      if (this.direction === BAR_CHART_CONFIG.sort.ascending) {
        this.direction = 'DESC';
      } else {
        this.direction = 'ASC';
      }
    } else {
      this.sortByKey = key.key;
      this.direction = 'ASC';
    }
    if(this.activeSecondLevelTab === 'product') {
      if(!this.DD[this.sortByKey]) {
        this.sortByAPI = this.activeDropDownOption;
      } else {
        this.sortByAPI = this.sortByKey; 
      }
    }
    this.DD_Sort = Object.assign({}, this.configData[FRONT_END_BAR_CHART_CONFIG.sort]);
    
    let sortby = this.DD_Sort;
    sortby[this.groupByKey] = this.groupByValue;
    this.DD_Sort = sortby;
    this.getChartData(true);
  }

  /**
   * Implement the bar chart based on group Type
   * @param groupType
   */
  groupByFunction(groupType) {
    // Initialize the svg element
    d3.selectAll("#barchart")
      .select("svg")
      .remove();

    let count = Object.keys(this.groupData).length;

    this.totalCount = count;
    this.groupParam = groupType;
    this.count = count;

    let showArray = [this.count, this.totalCount, this.groupParam];

    this.yaxisHeight = this.defaultHeight * count;

    this.getShowingDetail(showArray);

    // Formation of stacks
    let stack = d3
      .stack()
      .keys(this.stackkey)
      .offset(d3.stackOffsetNone);

    // Assign the response data for axis
    this.axisData = this.groupData;

    // Create a stack layers based on grouping data
    let layers = stack(this.groupData);

    this.stackSeries = layers;

    // Implement the x and y domain
    let x = d3.scaleLinear().range([0, this.width]);

    let y = d3
      .scaleBand()
      .range([0, this.defaultHeight * this.count])
      .padding(0.8);


    // Configure the SVG elements
    let svg = d3
      .select("#barchart")
      .append("svg")
      .attr(
        "width",
        this.width + BAR_CHART_CONFIG.margin.right
      )
      .attr("height", this.defaultHeight * this.count)
      .append("g")
      .attr(
        "transform",
        "translate(" + BAR_CHART_CONFIG.margin.left + "," + 0 + ")"
      );

    this.peakValue = d3.max(layers[layers.length - 1], data => {
        return data[1]
    });

    x.domain([0, this.peakValue]).nice();

    Object.keys(this.updatedData).forEach(data => {
      this.yAxisDomain.push(data);
    })


    y.domain(
      this.yAxisDomain.map(function (data, i) {
        return data;
      })
    );

     // Draw the grid lines for X Axis
    let xAxisGrid = d3
      .axisTop(x)
      .tickSize(-this.gridLine * this.count).ticks(10)
      .scale(x).tickFormat(function (d: any, i) {
        let format = d3.format('.2s');
        if(Math.floor(Math.log(d) / Math.LN10 + 1) > 3) {
          return format(d);
        } else {
          return d;
        }
    });

    let xGrid = svg
      .append("g")
      .attr("class", "x-axis-grid")
      .attr("transform", "translate(0," + 0 + ")")
      .attr("stroke-opacity", 1)
      .style("color", "#e7e7e7")
      .style("display", "inline")
      .call(xAxisGrid);

    // Draw the grid lines for X Axis
    let yAxisGrid = d3
      .axisLeft(y)
      .tickSize(-this.gridLine * this.count)
      .scale(y);

    let yGrid = svg
      .append("g")
      .attr("class", "y-axis-grid")
      .attr("transform", "translate(0," + 0 + ")")
      .attr("stroke-opacity", 1)
      .style("color", "#e7e7e7")
      .style("display", "inline")
      .call(yAxisGrid);

    yGrid.selectAll(".tick").attr("transform", function (data, i) {
      return `translate (0, ${i * 72})`;
    });

    this.lazyFn = this.debounced(this.delay, () => {
      let layersCopy = Object.assign([], layers);
      layersCopy.forEach((layer, idx) => {
        layersCopy[idx] = layer.slice(this.start, this.end);
        layersCopy[idx].key = layer.key;
        layersCopy[idx].index = layer.index;
      })
      this.lazyLoadData(svg, layersCopy, x);
    });
    if(this.groupData.length > this.limit){
      this.lazyFn();
      document.getElementById('bar-container-scroll').addEventListener('scroll', this.lazyFn, false);
    }else{
      this.lazyLoadData(svg, layers, x);
    }


    // invoking X and Y axis
    this.getXaxis();
    this.getYLabel();

    d3.selectAll('.classify-list').selectAll('.liclass').data(this.YLabelData).enter()
    .append('li').attr('class', 'liclass').html(function(d) {
      return  `${d}`;
    })
    .selectAll('.pop-over-content')
    .on("mouseover",(d,i, nodes) => {
        d3.select(nodes[i]).style("cursor", "pointer");
        d3.selectAll(".bar-chart-y-axis-tooltip")
          .html(`<div class="bar-chart-y-axis-tooltip-content"></div>`)
          .style("display", "inline")
          .style("opacity", "1").style('z-index', '1');
        
        let content = this.yAxisTotalPopOverContent[Math.floor((nodes[i]['offsetTop'] - 40) / 72)];
          d3.selectAll(".bar-chart-y-axis-tooltip")
            .selectAll(".bar-chart-y-axis-tooltip-content")
            .selectAll('span')
            .data(content)
            .enter()
            .append('span').text(d => {
              return d+'';
            }).append('br');
      })
      .on("mousemove", (d, i,nodes) => {
        let tooltipWidth = this.chartYAxisTooltip.nativeElement.clientWidth;
        let toolTipHeight = this.chartYAxisTooltip.nativeElement.clientHeight;
        let tooltip = d3.selectAll(".bar-chart-y-axis-tooltip")
          .selectAll('.bar-chart-y-axis-tooltip-content');

        if(this.defaultHeight * this.count > nodes[i]['offsetTop']) {
          if((this.defaultHeight * this.count -  nodes[i]['offsetTop']) <= toolTipHeight) {
            tooltip.
               attr('class', 'bar-chart-y-axis-tooltip-content')
               .classed( 'top-center-tooltip', true);
 
            d3.selectAll(".bar-chart-y-axis-tooltip")
                 .style("left", `${nodes[i]['offsetLeft']}px`)
                 .style(
                   "top",
                   `${ nodes[i]['offsetTop'] -  toolTipHeight - 5
                   }px`
                 );
           } else {
             tooltip.
               attr('class', 'bar-chart-y-axis-tooltip-content')
               .classed('bottom-center-tooltip', true);
             d3.selectAll(".bar-chart-y-axis-tooltip")
                 .style("left", `${nodes[i]['offsetLeft']}px`)
                 .style(
                   "top",
                   `${ nodes[i]['offsetTop'] + 20
                   }px`
                 );
           }
        }  else {
          if((this.defaultHeight * this.count -  nodes[i]['offsetTop']) <= toolTipHeight) {
            tooltip.
               attr('class', 'bar-chart-y-axis-tooltip-content')
               .classed( 'top-center-tooltip', true);
 
            d3.selectAll(".bar-chart-y-axis-tooltip")
                 .style("left", `${nodes[i]['offsetLeft']}px`)
                 .style(
                   "top",
                   `${ nodes[i]['offsetTop'] -  toolTipHeight - 5
                   }px`
                 );
           } else {
             tooltip.
               attr('class', 'bar-chart-y-axis-tooltip-content')
               .classed('bottom-center-tooltip', true);
             d3.selectAll(".bar-chart-y-axis-tooltip")
                 .style("left", `${nodes[i]['offsetLeft']}px`)
                 .style(
                   "top",
                   `${ nodes[i]['offsetTop'] + 20
                   }px`
                 );
           }
        }
        })
      .on("mouseout", d => {
        d3.select(".bar-chart-y-axis-tooltip")
          .style("display", "none")
          .style("opacity", "0");
      });

    // this.enableLoader = false;
    // this.stackkey = [];
  }

  /**
   * Bar chart - Sort Function based on Grouped Data
   * @param key  -- Sorting key as a parameter
   */
  sortFunction(sortKey) {
    this.DD_Sort = Object.assign({}, this.configData[FRONT_END_BAR_CHART_CONFIG.sort]);
    let sortby = this.DD_Sort;
    sortby[this.groupByKey] = this.groupByValue;
    this.DD_Sort = sortby;

    if (this.selectedSortField === this.previousParam) {
      this.sortkey.direction =
        this.sortkey.direction === this.sortkey.ascending
          ? this.sortkey.descending
          : this.sortkey.ascending;
    } else {
      this.sortkey.direction = this.sortkey.descending;
    }

    let direction = this.sortkey.direction;
    this.previousParam = this.selectedSortField;
    this.sortParam = sortKey;
    let value = this.searchData;
    let count = Object.keys(value).length;
    this.totalCount = count;

    this.groupByFunction(this.groupByValue);
  }

  /**
   * Emit the entered search data
   * @param data
   */
  getSearchData(): void {
    this.searchFlag = true;
    let param = {
      scentPortfolio: this.activeFirstLevelTab,
      sortBy: this.activeType,
      groupBy: this.groupByKey,
      dropdown: this.sortByAPI,
      headerTab: this.activeHeaderToggle,
      headerFilter: this.headerFilter,
      startDate: this.startDate,
      endDate: this.endDate,
      orderBy: {
        [this.sortByKey]: this.direction
      },
      customFilter: this.searchText,
      filter: this.filters
    };
    this.broadCastService.onUpdateAppSpinnerPrompt('Getting Bar chart details.....');
    this.barservice.getBarData(
      this.activeSecondLevelTab,
      param, 
      this.activeDateRange, 
      this.dashboardService.dashboardPermission['WriteFlag']
    ).subscribe(
      data => {
        if (Object.keys(data).length >= 1) {
          if (data) {       
            this.resetScrollFields();
            this.apiData = data;
            let option = false;
            this.removeSVG();
            this.getGroup(this.apiData, option);
            this.broadCastService.onUpdateAppSpinnerPrompt('');
          }
        } else {
          this.toastrService.error(`No data found for bar chart!`);
          this.removeSVG();
          this.broadCastService.onUpdateAppSpinnerPrompt('');
        }
      },
      error => {
        this.toastrService.error(ErrorMessage.BarChartResponseFailure);
        this.removeSVG();
        this.broadCastService.onUpdateAppSpinnerPrompt('');
      }
    );
  }

  public clearSearch() {
    this.searchText = "";
    // this.getSearchData();
    this.searchFlag = false;
    let param = {
      scentPortfolio: this.activeFirstLevelTab,
      sortBy: this.activeType,
      groupBy: this.groupByKey,
      dropdown: this.sortByAPI,
      headerTab: this.activeHeaderToggle,
      headerFilter: this.headerFilter,
      startDate: this.startDate,
      endDate: this.endDate,
      orderBy: {
        [this.sortByKey]: this.direction
      },
      customFilter: this.searchText,
      filter: this.filters
    };
    this.broadCastService.onUpdateAppSpinnerPrompt('Getting Bar chart details.....');
    this.barservice.getBarData(
      this.activeSecondLevelTab,
      param, 
      this.activeDateRange, 
      this.dashboardService.dashboardPermission['WriteFlag']
    ).subscribe(
      data => {
        if (Object.keys(data).length >= 1) {
          if (data) {      
            this.resetScrollFields();  
            this.apiData = data;
            let option = false;
            this.removeSVG();
            this.getGroup(this.apiData, option);
            this.broadCastService.onUpdateAppSpinnerPrompt('');
          }
        } else {
          this.toastrService.error(`No data found for bar chart!`);
          this.removeSVG();
          this.broadCastService.onUpdateAppSpinnerPrompt('');
        }
      },
      error => {
        this.toastrService.error(ErrorMessage.BarChartResponseFailure);
        this.removeSVG();
        this.broadCastService.onUpdateAppSpinnerPrompt('');
      }
    );
  }


  getDropdown(x) {
    this.groupDetail =
      BAR_CHART_CONFIG.showLabel +
      " " +
      x +
      " " +
      BAR_CHART_CONFIG.ofLable +
      " " +
      this.totalCount +
      " " +
      this.groupParam;
  }

  /**
   * remove the svg element of barchart every search
   */
  removeSVG() {
    let count = 0;
    this.count = count;
    this.getDropdown(count);
    d3.selectAll("#barchart")
      .select("svg")
      .remove();
    d3.selectAll("#Yaxis")
      .select("svg")
      .remove();
    d3.selectAll('.classify-list').html(' ');
    d3.select('.plotXaxis').select('svg').html(' ');
    this.YLabelData = [];
  }


  getTooltip(tooltip, data) {
    let tooltipList: string = "";
    for (let index = 0; index < this.tooltipBody.length; index++) {
      // format replacement
      let currentFormat: string = this.tooltipBody[index][
        BAR_CHART_CONFIG.tooltip.tooltipBody.format
      ];
      let keysOfCurrentFormat: string[] = currentFormat.match(this.regExp);
      for (let i = 0; i < keysOfCurrentFormat.length; i++) {
        keysOfCurrentFormat[i] = keysOfCurrentFormat[i].substring(
          1,
          keysOfCurrentFormat[i].length - 1
        );
        if (keysOfCurrentFormat[i] === 'potential' && keysOfCurrentFormat[i].length > 3) {
          let format = d3.format('.2s');
          format(+keysOfCurrentFormat[i])
          currentFormat = currentFormat.replace(
            BAR_CHART_CONFIG.replaceKey +
            keysOfCurrentFormat[i] +
            BAR_CHART_CONFIG.replaceKey,
            format(+data["data"][d3.event.path[1].id + BAR_CHART_CONFIG.tooltipData][
              keysOfCurrentFormat[i]
            ])
          );
        } else {
          currentFormat = currentFormat.replace(
            BAR_CHART_CONFIG.replaceKey +
            keysOfCurrentFormat[i] +
            BAR_CHART_CONFIG.replaceKey,
            data["data"][d3.event.path[1].id + BAR_CHART_CONFIG.tooltipData][
            keysOfCurrentFormat[i]
            ]
          );
        }

      }
      // html setup - for indentation
      if (
        this.tooltipBody[index][BAR_CHART_CONFIG.tooltip.tooltipBody.indent] &&
        this.tooltipBody[index][
        BAR_CHART_CONFIG.tooltip.tooltipBody.indentationLevel
        ] !== 0
      ) {
        if (
          this.tooltipBody[index][BAR_CHART_CONFIG.tooltip.tooltipBody.label]
            .length > 0
        ) {
          tooltipList += `<tr><td style="padding-left: ${this.tooltipBody[
            index
          ][BAR_CHART_CONFIG.tooltip.tooltipBody.indentationLevel] * 10}px;">
                  ${
            this.tooltipBody[index][
            BAR_CHART_CONFIG.tooltip.tooltipBody.label
            ]
            }
              </td> <td class="align-right">${currentFormat}</td></tr>`;
        } else {
          tooltipList += `<tr><td style="padding-left: ${this.tooltipBody[
            index
          ][BAR_CHART_CONFIG.tooltip.tooltipBody.indentationLevel] * 10}px;">
                  ${
            this.tooltipBody[index][
            BAR_CHART_CONFIG.tooltip.tooltipBody.label
            ]
            }
          </td><td></td></tr>`;
        }
      } else {
        if (
          this.tooltipBody[index][BAR_CHART_CONFIG.tooltip.tooltipBody.label]
            .length > 0
        ) {
          tooltipList += `<tr><td>${
            this.tooltipBody[index][BAR_CHART_CONFIG.tooltip.tooltipBody.label]
            }</td> <td class="align-right">${currentFormat}</td></tr>`;
        } else {
          tooltipList += `<tr><td>${currentFormat}</td><td></td></tr>`;
        }
      }
    }

    // tooltip title - line 1
    let tooltipTitle: string = "";
    for (let index = 0; index < this.tooltipHeaderTitle.length; index++) {
      tooltipTitle += `<span class="first-child-right-bar">${
        data["data"][d3.event.path[1].id + BAR_CHART_CONFIG.tooltipData][
        this.tooltipHeaderTitle[index]
        ]
        }</span>`;
    }

    let flags: Array<string> = data['data'][d3.event.path[1]['id'] + BAR_CHART_CONFIG.tooltipData][BAR_CHART_CONFIG.flag];

    if(flags) {
      if(flags.length > 0) {
        for (let index = 0; index < flags.length; index++) {
          if(data['data'][d3.event.path[1]['id'] + BAR_CHART_CONFIG.tooltipData]
          [BAR_CHART_CONFIG.flag][index] !== 'null' && data['data'][d3.event.path[1]['id'] + BAR_CHART_CONFIG.tooltipData]
          [BAR_CHART_CONFIG.flag][index] ) {
            tooltipTitle += `<span class="img-flag">
            <img src="./assets/icon/worklist.flags/${data['data'][d3.event.path[1]['id'] + BAR_CHART_CONFIG.tooltipData]
                    [BAR_CHART_CONFIG.flag][index]}.svg" />
              </span>`;
          }
        }
      }
    } 
  
    // tooltip title - line 2
    let tooltipSubTitle: string = "";
    for (let index = 0; index < this.tooltipHeaderSubtitle.length; index++) {
      tooltipSubTitle += `<h5>${
        data["data"][d3.event.path[1].id + BAR_CHART_CONFIG.tooltipData][
        this.tooltipHeaderSubtitle[index]
        ]
        }</h5>`;
    }


    let tooltipContent = `<div class="chart-tooltip-header">
    <div class="chart-tooltip-header-icon">
      <img src="./assets/img/${
        BAR_CHART_CONFIG[
        data['data'][d3.event.path[1]['id'] + BAR_CHART_CONFIG.tooltipData]
        [BAR_CHART_CONFIG.icon]]}.png">
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
`;
    tooltip.html(
      ` <div class="chart-tooltip-card bar-chart-tooltip-card">
      ${tooltipContent}
      </div>
      `
    );
  }



  private lazyLoadData(svg, layers, x) {

    let stack = d3
      .stack()
      .keys(this.stackkey)
      .offset(d3.stackOffsetNone);

    let color;
    if(localStorage.getItem('enablePrint') === 'true') {
      let data = JSON.parse(localStorage.getItem('columnChartLegend'));
      color =  d3.scaleOrdinal(data['colors']).domain(data['domains']);
      localStorage.setItem('enablePrint', 'false');
    }else {
      color = d3.scaleOrdinal(this.colorArray).domain(this.domainArray);
    }

    // Color formation of each layer
    let layer;
    if(svg.selectAll(".layer").size() == 0 ) {
      layer = svg.selectAll(".layer")
        .data(stack(this.groupData.slice(this.start, this.end)))
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("transform", "translate(0,25)")
        .style("fill", (data, i) => {
          let key = data.key.replace(/_\S*/, '');
          return color(key);
        })
        .attr("id", function (data, i) {
          return data.key;
        });
    }else {
      layer = svg.selectAll(".layer")
        .data(stack(this.groupData.slice(this.start, this.end)));
    }

    let rect = layer
      .selectAll("rect"+ this.start)
      .data(layers => {
        return layers;
      })
      .enter()
      .append("rect")
      .attr("transform", (data, i) => {
        return `translate (0, ${(this.start + i) * 72})`;
      })
      .attr("height", BAR_CHART_CONFIG.rectHeight);

    // Configure the Tooltip functions
    let tooltip = d3
      .select(".bar-chart-tooltip")
      .style("opacity", 0)
      .style("position", "absolute");

    let that = this;
    // Formation of rectangle layer in each bar chart
    rect
      .attr("width", function (data) {
        if (isNaN(data[0])) {
          return 0;
        } else if (isNaN(data[1])) {
          return 0;
        } else {
          return x(data[1]) - x(data[0]);
        }
      })
      .attr("x", function (data) {
        return x(data[0]);
      })
      .on("click", (data, index, n) => {
        window.open(data['data'][d3.event.path[1]['id'] + BAR_CHART_CONFIG.tooltipData][BAR_CHART_CONFIG.navigationUrl]);
      })
      .on("mouseover", (data, index, node) => {
        tooltip.style("opacity", "1").style("display", "inline");
      })
      .on("mousemove", (data, index, nodes) => {
        let yPosition = d3.select(nodes[index]).attr('transform').split(',')[1].replace(')', '');
        this.getTooltip(tooltip, data);
        let tooltipWidth = this.chartTooltip.nativeElement.clientWidth;
        let toolTipHeight = this.chartTooltip.nativeElement.clientHeight;

        if(this.defaultHeight * this.count < toolTipHeight) {
          if (d3.event.offsetX < tooltipWidth) {
            tooltip
              .select("div")
              .attr("class", "bar-chart-tooltip-card")
              .classed("start-tooltip-header", true);
            tooltip
              .style("display", "inline")
              .style("opacity", "1")
              .style("left", `${d3.event.layerX }px`)
              .style(
                "top",
                `${ +yPosition + 62
                  }px`
              );
          }
          else if ((d3.event.offsetX >= tooltipWidth / 2) && (d3.event.offsetX < (this.width + 20 - tooltipWidth / 2))) {
            tooltip
              .select("div")
              .attr("class", "bar-chart-tooltip-card")
              .classed("middle-tooltip-header", true);
            tooltip
              .style("display", "inline")
              .style("opacity", "1")
              .style("left", `${d3.event.layerX - tooltipWidth / 2}px`)
              .style(
                "top",
                `${ +yPosition + 62
                  }px`
              );
          } else if(d3.event.offsetX >= (this.width + 20 - tooltipWidth / 2)){
            tooltip
              .select("div")
              .attr("class", "bar-chart-tooltip-card")
              .classed("end-tooltip-header", true);
            tooltip
              .style("display", "inline")
              .style("opacity", "1")
              .style("left", `${d3.event.layerX - tooltipWidth }px`)
              .style(
                "top",
                `${ +yPosition + 62
                  }px`
              );
          }
        } else {
          if((this.defaultHeight * this.count - d3.event.offsetY) <= toolTipHeight) {
            if (d3.event.offsetX < tooltipWidth) {
              tooltip
                .select("div")
                .attr("class", "bar-chart-tooltip-card")
                .classed("right-side-tooltip", true);
              tooltip
                .style("display", "inline")
                .style("opacity", "1")
                .style("left", `${d3.event.layerX}px`)
                .style(
                  "top",
                  `${ +yPosition - toolTipHeight + 17
                    }px`
                );
            } else if ((d3.event.offsetX >= tooltipWidth / 2) && (d3.event.offsetX < (this.width + 20 - tooltipWidth / 2))) {
              tooltip
                .select("div")
                .attr("class", "bar-chart-tooltip-card")
                .classed("chart-tooltip-card", true);
              tooltip
                .style("display", "inline")
                .style("opacity", "1")
                .style("left", `${d3.event.layerX - tooltipWidth / 2}px`)
                .style(
                  "top",
                  `${+yPosition - toolTipHeight + 17}px`
                );
            } else if(d3.event.offsetX >= (this.width + 20 - tooltipWidth / 2)){
              tooltip
                .select("div")
                .attr("class", "bar-chart-tooltip-card")
                .classed("left-side-bar-chart-tooltip", true);
              tooltip
                .style("display", "inline")
                .style("opacity", "1")
                .style("left", `${d3.event.layerX - tooltipWidth }px`)
                .style(
                  "top",
                  `${+yPosition - toolTipHeight + 17}px`
                );
            }
          } else {
            if (d3.event.offsetX < tooltipWidth) {
              tooltip
                .select("div")
                .attr("class", "bar-chart-tooltip-card")
                .classed("start-tooltip-header", true);
              tooltip
                .style("display", "inline")
                .style("opacity", "1")
                .style("left", `${d3.event.layerX }px`)
                .style(
                  "top",
                  `${ +yPosition + 62
                    }px`
                );
            }
            else if ((d3.event.offsetX >= tooltipWidth / 2) && (d3.event.offsetX < (this.width + 20 - tooltipWidth / 2))) {
              tooltip
                .select("div")
                .attr("class", "bar-chart-tooltip-card")
                .classed("middle-tooltip-header", true);
              tooltip
                .style("display", "inline")
                .style("opacity", "1")
                .style("left", `${d3.event.layerX - tooltipWidth / 2}px`)
                .style(
                  "top",
                  `${ +yPosition + 62
                    }px`
                );
            } else if(d3.event.offsetX >= (this.width + 20 - tooltipWidth / 2)){
              tooltip
                .select("div")
                .attr("class", "bar-chart-tooltip-card")
                .classed("end-tooltip-header", true);
              tooltip
                .style("display", "inline")
                .style("opacity", "1")
                .style("left", `${d3.event.layerX - tooltipWidth }px`)
                .style(
                  "top",
                  `${ +yPosition + 62
                    }px`
                );
            }
          }
        }

       
       
      })
      .on("mouseout", function (data, i) {
        d3.select(this).attr("stroke", data => {
          return 0;
        });
        tooltip.style("opacity", "0").style("display", "none");
      });
    if(this.groupData.length > this.limit) {
      if (this.end == this.groupData.length) {
        this.resetScrollFields();
      }else {
        this.start = this.end;
        this.end = this.end + this.limit > this.groupData.length ? this.groupData.length : this.end + this.limit;
      }
    }
  }

  private resetScrollFields() {
    document.getElementById('bar-container-scroll').removeEventListener('scroll', this.lazyFn, false);
    this.enableLoader = false;
    this.stackkey = [];
    this.start = 0;
    this.end = this.limit;
  }

  private debounced(delay, fn) {
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    }
  }
}
