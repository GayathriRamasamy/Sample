import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import * as d3 from "d3";
import { TitleCasePipe } from "@angular/common";
import {
  NgbModalRef,
  NgbModal,
  NgbModalOptions
} from "@ng-bootstrap/ng-bootstrap";
import { combineLatest } from "rxjs";
// Config
import {
  FRONT_END_COLUMN_CHART_CONFIG,
  COLUMN_CHART_CONFIG,
  ICON_CONFIG
} from "src/app/_config/column-chart/column-chart.config";
// Service
import { ColumnChartService } from "src/app/_services/+dashboard/column-chart/column-chart.service";
import { DashboardService } from "src/app/_services/+dashboard/dashboard.service";
import { ConfigService } from "src/app/_services/+dashboard/config.service";
import { ToastrService } from "ngx-toastr";
// Component
import { DetailsComponent } from "../../details/details.component";
import { AppBroadCastService } from "../../../_services/app.broadcast.service";
// Common
import { ErrorMessage } from "../../../_shared/messages/ErrorMessage";
@Component({
  selector: "app-column-chart",
  templateUrl: "./column-chart.component.html",
  styleUrls: ["./column-chart.component.scss"],
  providers: [TitleCasePipe]
})
export class ColumnChartComponent implements OnInit {
  enablePrint: boolean = false;
  // Dynamic width - chart
  @ViewChild("columnChart") chartWidth: ElementRef;
  // Dynamic content - Tooltip
  @ViewChild("columnChartTooltip") chartTooltip: ElementRef;
  // X-axis popover
  @ViewChild("columnChartXaxisTooltip") chartXaxisTooltip: ElementRef;
  //
  @ViewChild("columnChartContent") columnChartContent: ElementRef;
  // Toggles(eg-Include exclusive projects & etc.,)
  private activeSecondLevelTabToggle: Array<string>;
  // yoy toggle
  private yoyToggle: boolean;
  private yearOverYearKey: string = COLUMN_CHART_CONFIG.yearOverYearLabel;
  public detailsLabel: string = ICON_CONFIG.detailBtn;
  // Header Tab
  public columnChartTabs: Object;
  private columnChartTabIndex: number;
  private currentTab: string;
  private currentTabXaxisKey: string;
  // Header changes triggering
  private activeDropdown: string;
  private activeDateRange: string;
  private activeTopLevelTab: string;
  private activeSecondLevelTab: string;
  private activeType: string;
  private filter: string;
  private tooltipBody: any;
  private activeHeaderToggle: string;
  private headerFilter: object;
  // key value pipe order
  public sortFn = (a, b) => 0;
  // Bar - peak value
  private peakValue: number = 0;
  // Regular expression
  private regExp: RegExp;
  // chart
  private stack: any;
  private yoy: boolean;
  private stackSeries: Array<any>;
  private columnChartData: any;
  private svg: d3.Selection<HTMLDivElement, {}, HTMLElement, any>;
  private graph: d3.Selection<HTMLDivElement, {}, HTMLElement, any>;
  private xScale: any;
  private yScale: any;
  private xAxisLabels: any;
  private stackSeriesKeys: string[] = [];
  private xaxisBarKey: any;
  private tabName: string;
  private xAxisSvg: any;
  private xAxisgraph: any;
  private yAxisSvg: any;
  private yAxisgraph: any;
  private chartBodyGraph: any;
  private chartBodySvg: any;
  private color: any;
  private layer: any;
  private bars: any;
  private toolTip: any;
  private legend: Object;
  private xAxisTooltip: any;
  private chartConfig: Object;
  // line chart
  private pathLength: any;
  private pathAnimation: any;
  private linePlot: any;
  private line: any;
  private linePlotData: any = [];
  private customDateRangeStartDate: string;
  private customDateRangeEndDate: string;
  public prevFirstLevelTab: string;
  public prevSecondLevelTab: string;
  public prevType: string;
  public prevDateRange: string;
  public prevHeaderToggle: string;
  public prevHeaderFilter: any;
  public prevDropdown: string;
  public prevColor: Array<string> = [];
  public prevDomain: Array<string> = [];
  public prevFilters: any;
  public filters: any;
  public prevLegend: Object;
  public enableChart: boolean = false;
  // Details page config
  private detailsPageConfig: NgbModalOptions = {
    keyboard: false,
    windowClass: "customDetailsModal",
    backdrop: "static"
  };

  /**
  * // TODO: Component instance - Initialization
  * @param -  columnChartService: ColumnChartService, modalService: NgbModal,
              dashboardService: DashboardService, titleCasePipe: TitleCasePipe, 
              configService: ConfigService
  * @returns - void
  */
  constructor(
    private columnChartService: ColumnChartService,
    private modalService: NgbModal,
    private dashboardService: DashboardService,
    private titleCasePipe: TitleCasePipe,
    private configService: ConfigService,
    private broadCastService: AppBroadCastService,
    private toastrService: ToastrService
  ) {}

  /**
   * // TODO: Component initialization
   * @param - - no params
   * @returns - void
   */
  ngOnInit() {
    this.enablePrint = JSON.parse(localStorage.getItem("enablePrint"));

    this.dashboardService.tabDetails.subscribe(tabDetail => {
      this.activeTopLevelTab = tabDetail.frstLvlTabKey;
      this.activeSecondLevelTab = tabDetail.secLvlTabKey;
      this.getColumnChartConfig();
    });

    if (localStorage.getItem("enablePrint") == "true") {
      this.chartConfig = JSON.parse(localStorage.getItem("columnChartConfig"));
      this.getConfigSetup();
    } else {
      this.dashboardService.tabDetails.subscribe(tabDetail => {
        this.activeTopLevelTab = tabDetail.frstLvlTabKey;
        this.activeSecondLevelTab = tabDetail.secLvlTabKey;
        this.getColumnChartConfig();
      });
    }
  }

  /**
   * // TODO: Details overlay page navigation
   * @param - no params
   * @returns - void
   */
  navigateDetails() {
    let modelRef: NgbModalRef;
    modelRef = this.modalService.open(DetailsComponent, this.detailsPageConfig);
    let obj = {
      scentPortfolio: this.activeTopLevelTab,
      sortBy: this.activeType,
      dropdown: this.activeDropdown,
      headerTab: FRONT_END_COLUMN_CHART_CONFIG.default_detail_header_tab,
      filter: this.filters,
      startDate: this.customDateRangeStartDate,
      endDate: this.customDateRangeEndDate,
      secondLevelTab: this.activeSecondLevelTab,
      dateRange: this.activeDateRange
    };
    modelRef.componentInstance.detailObject = obj;
  }

  /**
   * // TODO: Get Column chart config
   * @param - no params
   * @returns - void
   */
  getColumnChartConfig() {
    this.configService.chartConfig.subscribe(configuration => {
      if (configuration["columnChart"]) {
        this.chartConfig = configuration["columnChart"];
        localStorage.setItem(
          "columnChartConfig",
          JSON.stringify(configuration["columnChart"])
        );
        this.getConfigSetup();
      }
    });
  }

  /**
   * // TODO: Config setup
   * @param - no params
   * @returns - void
   */
  getConfigSetup() {
    // Regular expression
    this.regExp = new RegExp(
      COLUMN_CHART_CONFIG.regExpPattern,
      COLUMN_CHART_CONFIG.regExpFlag
    );
    this.columnChartTabIndex = COLUMN_CHART_CONFIG.defaultTabIndex;
    this.columnChartTabs = this.chartConfig[
      FRONT_END_COLUMN_CHART_CONFIG.headerTabData
    ];
    this.currentTab = Object.keys(this.columnChartTabs)[0];
    this.currentTabXaxisKey = Object.keys(this.columnChartTabs)[0];
    // tooltip body
    this.tooltipBody = this.chartConfig[
      FRONT_END_COLUMN_CHART_CONFIG.tooltip.key
    ][FRONT_END_COLUMN_CHART_CONFIG.tooltip.tooltipBody.key];

    if (localStorage.getItem("enablePrint") == "true") {
      this.legend = JSON.parse(localStorage.getItem("columnChartLegend"));
      this.activeDropdown = localStorage.getItem("activeDropDownOption");
      this.getColumnChart(
        this.columnChartTabIndex,
        this.currentTab,
        this.currentTabXaxisKey
      );
    } else {
      this.dashboardService.legends.subscribe(legend => {
        this.legend = legend;
        localStorage.setItem("columnChartLegend", JSON.stringify(this.legend));
        if (this.prevLegend !== this.legend) {
          // filter changes
          this.dashboardService.updateFilterSettings.subscribe(filterDetail => {
            this.headerFilter = filterDetail.headerFilter;
            this.activeDateRange = filterDetail.dateKey;
            this.activeType = filterDetail.sortedOption;
            this.customDateRangeStartDate = filterDetail.startDate;
            this.customDateRangeEndDate = filterDetail.endDate;
            this.filters = filterDetail.filters;
            //Bubble chart changes
            this.dashboardService.chartDetail.subscribe(response => {
              this.activeHeaderToggle = response.headerToggle;
              this.activeDropdown = response.dropDown;
              if (
                this.activeDateRange &&
                this.activeSecondLevelTab &&
                this.activeTopLevelTab
              ) {
                if (
                  this.prevFirstLevelTab !== this.activeTopLevelTab ||
                  this.prevSecondLevelTab !== this.activeSecondLevelTab ||
                  this.prevType !== this.activeType ||
                  this.prevDateRange !== this.activeDateRange ||
                  this.prevHeaderToggle !== this.activeHeaderToggle ||
                  this.prevHeaderFilter !== this.headerFilter ||
                  this.prevDropdown !== this.activeDropdown ||
                  this.prevLegend !== this.legend ||
                  JSON.stringify(this.prevFilters) !==
                    JSON.stringify(this.filters)
                ) {
                  this.prevFirstLevelTab = this.activeTopLevelTab;
                  this.prevSecondLevelTab = this.activeSecondLevelTab;
                  this.prevType = this.activeType;
                  this.prevDateRange = this.activeDateRange;
                  this.prevHeaderToggle = this.activeHeaderToggle;
                  this.prevHeaderFilter = this.headerFilter;
                  this.prevDropdown = this.activeDropdown;
                  this.prevLegend = this.legend;
                  this.prevFilters = Object.assign({}, this.filters);
                  this.enableChart = false;
                  if (
                    this.activeSecondLevelTab === "winrate" ||
                    this.activeSecondLevelTab === "product"
                  ) {
                    if (this.activeDropdown.length > 1) {
                      this.prevDropdown = this.activeDropdown;
                      this.getColumnChart(
                        this.columnChartTabIndex,
                        this.currentTab,
                        this.currentTabXaxisKey
                      );
                    }
                  } else {
                    this.getColumnChart(
                      this.columnChartTabIndex,
                      this.currentTab,
                      this.currentTabXaxisKey
                    );
                  }
                }
              }
            });
          });
        }
      });
    }
  }

  /**
   * // TODO: Get Column chart
   * @param - index: number, clickedTab: string, xaxisBarKey: string
   * @returns - void
   */
  getColumnChart(index: number, clickedTab: string, xaxisBarKey: string) {
    this.columnChartTabIndex = index;
    this.currentTab = clickedTab;
    this.currentTabXaxisKey = xaxisBarKey;
    if (localStorage.getItem("enablePrint") == "true") {
      this.columnChartTabIndex = JSON.parse(
        localStorage.getItem("columnChartTabIndex")
      );
      this.renderColumnChart(
        JSON.parse(localStorage.getItem("columnChartResponse")),
        xaxisBarKey,
        clickedTab
      );
    } else {
      this.callClickedTab(
        this.activeTopLevelTab,
        this.activeSecondLevelTab,
        clickedTab,
        xaxisBarKey
      );
    }
  }

  /**
   * // TODO: Load data for clicked tab
   * @param - outerTab: string, innerTab: string, xaxisBarKey: string
   * @returns - void
   */
  callClickedTab(
    topLevelTab: string,
    outerTab: string,
    innerTab: string,
    xaxisBarKey: string
  ) {
    this.broadCastService.onUpdateAppSpinnerPrompt(
      "Getting Column chart data...."
    );
    this.columnChartService
      .getChartData(
        topLevelTab,
        innerTab,
        outerTab,
        this.yoyToggle,
        this.activeType,
        this.filters,
        this.customDateRangeStartDate,
        this.customDateRangeEndDate,
        this.activeDropdown,
        this.activeHeaderToggle,
        this.activeDateRange,
        this.headerFilter,
        this.dashboardService.dashboardPermission["WriteFlag"]
      )
      .subscribe(
        (response: any) => {
          if (response) {
            if (Object.keys(response["currentYear"]).length >= 1) {
              this.enableChart = true;
              localStorage.setItem(
                "columnChartTabIndex",
                JSON.stringify(this.columnChartTabIndex)
              );
              localStorage.setItem(
                "columnChartResponse",
                JSON.stringify(response)
              );
              this.renderColumnChart(response, xaxisBarKey, innerTab);
            } else {
              d3.select(".column-chart-bars-svg").html(" ");
              d3.select(".column-chart-xaxis-svg").html(" ");
              d3.select(".column-chart-yaxis-svg").html(" ");
              this.toastrService.error(`No data found for column chart`);
              this.broadCastService.onUpdateAppSpinnerPrompt("");
            }
          } else {
            this.toastrService.error(`No data found for column chart`);
            this.broadCastService.onUpdateAppSpinnerPrompt("");
          }
        },
        error => {
          this.toastrService.error(ErrorMessage.ColumnChartResponseFailure);
          d3.select(".column-chart-bars-svg").html(" ");
          d3.select(".column-chart-xaxis-svg").html(" ");
          d3.select(".column-chart-yaxis-svg").html(" ");
          this.broadCastService.onUpdateAppSpinnerPrompt("");
        }
      );
  }

  renderColumnChart(response, xaxisBarKey, innerTab) {
    this.prevFirstLevelTab = this.activeTopLevelTab;
    this.stackSeries = [];
    this.stackSeriesKeys = [];
    this.columnChartData = [];
    let innerArray = [];
    // Color code
    this.color = d3
      .scaleOrdinal(this.legend["colors"])
      .domain(this.legend["domains"]);

    // Color domains
    this.stackSeriesKeys = this.legend["domains"];
    let innerTemplate: Array<string> = [];

    // To get Inner Template - (eg- avg_patented_ingredient and etc.,)
    Object.keys(response[COLUMN_CHART_CONFIG.currentYear]).forEach(
      (axisData, currentYearDataIndex) => {
        Object.keys(
          response[COLUMN_CHART_CONFIG.currentYear][axisData][
            this.chartConfig[FRONT_END_COLUMN_CHART_CONFIG.dataKey]
          ]
        ).forEach((chartData, chartDataIndex) => {
          Object.keys(
            response[COLUMN_CHART_CONFIG.currentYear][axisData][
              this.chartConfig[FRONT_END_COLUMN_CHART_CONFIG.dataKey]
            ][chartData]
          ).map((categoryData, categoryDataIndex) => {
            innerTemplate.push(categoryData);
          });
        });
      }
    );

    // //  to create empty value for unknown category details
    Object.keys(response[COLUMN_CHART_CONFIG.currentYear]).forEach(axisData => {
      let category: Array<string> = [];
      Object.keys(
        response[COLUMN_CHART_CONFIG.currentYear][axisData][
          this.chartConfig[FRONT_END_COLUMN_CHART_CONFIG.dataKey]
        ]
      ).forEach(categoryData => {
        category.push(categoryData);
      });
      this.stackSeriesKeys.forEach(key => {
        if (!category.includes(key)) {
          response[COLUMN_CHART_CONFIG.currentYear][axisData][
            this.chartConfig[FRONT_END_COLUMN_CHART_CONFIG.dataKey]
          ][key] = {};
          innerTemplate.forEach(template => {
            response[COLUMN_CHART_CONFIG.currentYear][axisData][
              this.chartConfig[FRONT_END_COLUMN_CHART_CONFIG.dataKey]
            ][key][template] = 0;
          });
        }
      });
    });

    // Restructure response
    Object.keys(response[COLUMN_CHART_CONFIG.currentYear]).forEach(
      currentYearData => {
        if (currentYearData !== "undefined") {
          let restructureData = {};
          restructureData[xaxisBarKey] = currentYearData;
          Object.keys(
            response[COLUMN_CHART_CONFIG.currentYear][currentYearData][
              this.chartConfig[FRONT_END_COLUMN_CHART_CONFIG.dataKey]
            ]
          ).map(chartData => {
            if (
              this.activeDropdown &&
              this.chartConfig[FRONT_END_COLUMN_CHART_CONFIG.stackHeight]
                .length === 0
            ) {
              restructureData[chartData] =
                response[COLUMN_CHART_CONFIG.currentYear][currentYearData][
                  this.chartConfig[FRONT_END_COLUMN_CHART_CONFIG.dataKey]
                ][chartData][this.activeDropdown];
            } else {
              restructureData[chartData] =
                response[COLUMN_CHART_CONFIG.currentYear][currentYearData][
                  this.chartConfig[FRONT_END_COLUMN_CHART_CONFIG.dataKey]
                ][chartData][
                  this.chartConfig[FRONT_END_COLUMN_CHART_CONFIG.stackHeight]
                ];
            }
            restructureData[chartData + COLUMN_CHART_CONFIG.tooltipLabel] =
              response[COLUMN_CHART_CONFIG.currentYear][currentYearData][
                this.chartConfig[FRONT_END_COLUMN_CHART_CONFIG.dataKey]
              ][chartData];
          });
          innerArray.push(restructureData);
        }
      }
    );

    this.columnChartData = innerArray;

    // plot chart
    this.plotColumnChart(
      this.columnChartData,
      this.stackSeriesKeys,
      xaxisBarKey,
      innerTab
    );
    this.broadCastService.onUpdateAppSpinnerPrompt("");
  }

  /**
   * // TODO: Plot Column chart
   * @param - chartData: Object, stackSeriesKeys: Array<string>, xaxisKey: string, tab: string
   * @returns - void
   */
  plotColumnChart(
    chartData: Object,
    stackSeriesKeys: any,
    xaxisKey: string,
    tab: string
  ) {
    d3.selectAll(".column-chart-xaxis")
      .select("svg")
      .remove();
    d3.selectAll(".column-chart-bars")
      .select("svg")
      .html(" ");
    this.enableChart = true;

    if(this.enableChart) {
      this.columnChartData = chartData;
      let xaxisBarKey = xaxisKey;
      this.stackSeriesKeys = stackSeriesKeys;
      this.xAxisLabels = this.columnChartData.map(data => data[xaxisBarKey]);
  
      let totalWidth = this.chartWidth.nativeElement.clientWidth;
      // plot X-axis scale
      this.plotXAxis(totalWidth);
      // plot Y-axis scale
      this.plotYAxis();
      // plot chart
      this.plotChart(xaxisBarKey);
      // plot line chart
      if (this.chartConfig[FRONT_END_COLUMN_CHART_CONFIG.enableLine]) {
        this.plotLineChart(xaxisBarKey);
      }
      // Horizontal line creation
      if (this.chartConfig[FRONT_END_COLUMN_CHART_CONFIG.enableMidLine]) {
        this.getHorizontalLine(totalWidth);
      }
      // Label inside bar
      if (this.chartConfig[FRONT_END_COLUMN_CHART_CONFIG.enableLabel]) {
        this.getLabel(xaxisBarKey);
      }
      // Text on top of Bars
      this.getTopLabel(xaxisBarKey);
      // set default chart setting
      this.enableChart = false;
    } 
  }

  /**
   * // TODO: Plot chart
   * @param - tabName: string, xaxisBarKey: string
   * @returns - void
   */
  // plot chart
  plotChart(xaxisBarKey: string) {
    // remove all content in column-chart
    d3.selectAll(".column-chart-bars")
      .select(".column-chart-bars-svg")
      .html(" ");

    // this.chartBodySvg = d3
    //   .select(".column-chart-bars")
    //   .select(".column-chart-bars-svg")
    //   .attr("width", COLUMN_CHART_CONFIG.chartBodySvgConf.width)
    //   .attr("height", COLUMN_CHART_CONFIG.chartBodySvgConf.height)
    //   .data(this.stackSeries);

    this.chartBodySvg = d3
      .select(".column-chart-bars")
      .select(".column-chart-bars-svg")
      .attr("width", this.columnChartContent.nativeElement.clientWidth)
      .attr("height", COLUMN_CHART_CONFIG.chartBodySvgConf.height)
      .data(this.stackSeries);

    // Main Graph element creation
    this.chartBodyGraph = this.chartBodySvg
      .append("g")
      .data(this.stackSeries)
      .attr("class", "top-layer")
      .attr("transform", "translate(0, -10)");

    // Tooltip element selection
    this.toolTip = d3.select(".column-chart-bars").select(".col-chart-tooltip");

    this.xAxisTooltip = d3
      .select(".column-chart-xaxis")
      .select(".col-chart-x-axis-tooltip")
      .style("display", "none")
      .style("position", "absolute")
      .style("opacity", "0");

    d3.selectAll(".x-axis .tick")
      .on("mouseover", function(d) {
        d3.select(this).style("cursor", "pointer");
        d3.select(".col-chart-x-axis-tooltip")
          .html(
            `<div class='col-chart-x-axis-tooltip-tick'><span>${d}</span></div>`
          )
          .style("display", "inline")
          .style("opacity", "1");
      })
      .on("mousemove", d => {
        let tooltipWidth = this.chartXaxisTooltip.nativeElement.clientWidth;
        let tooltipHeight = this.chartXaxisTooltip.nativeElement.clientHeight;

        d3.select(".col-chart-x-axis-tooltip")
          .style("left", `${d3.event.layerX - tooltipWidth / 2}px`)
          .style("top", `${d3.event.layerY - tooltipHeight - 20}px`);
      })
      .on("mouseout", d => {
        d3.select(".col-chart-x-axis-tooltip")
          .style("display", "none")
          .style("opacity", "0");
      });

    // Layer creation Layers
    this.layer = this.chartBodyGraph
      .selectAll(".layer")
      .data(this.stackSeries)
      .enter()
      .append("g")
      .attr("transform", "translate(0, 35 )")
      .attr("class", "layer")
      .style("fill", (d, i) => {
        return this.color(d.key);
      })
      .attr("id", d => {
        return d.key;
      });

    // creation of rectangle bars in the layers
    this.layer
      .selectAll(".stack-bar")
      .data(function(d, i) {
        return d;
      })
      .enter()
      .append("g")
      .attr("class", "stack-bar-label")
      .append("rect")
      .attr("class", "stack-bar")
      .style("cursor", "pointer")
      .attr("y", (d, i) => {
        if (!isNaN(d[1])) return this.yScale(d[1]);
      })
      .attr("x", (d, i) => {
        return this.xScale(d.data[xaxisBarKey]);
      })
      .attr("width", (d, i) => {
        if (this.xScale.bandwidth() > COLUMN_CHART_CONFIG.maxBarWidth) {
          return COLUMN_CHART_CONFIG.maxBarWidth;
        } else {
          return this.xScale.bandwidth();
        }
      })
      .attr("height", (d, i) => {
        if (isNaN(d[0])) {
          return 0;
        } else if (isNaN(d[1])) {
          return 0;
        } else {
          return this.yScale(d[0]) - this.yScale(d[1]);
        }
      })
      .style("opacity", (d, i) => {
        if (d.data["yoyStatus"]) {
          return COLUMN_CHART_CONFIG.yoyTrueOps;
        } else {
          return COLUMN_CHART_CONFIG.yoyFalseOps;
        }
      })
      .on("mouseover", (data, index, node) => {
        this.getMouseOver(data, index, node);
      })
      .on("mousemove", (data, index, nodes) => {
        this.getMouseMove(data, index, nodes, xaxisBarKey);
      })
      .on("mouseout", (data, index, nodes) => {
        this.getMouseOut(data, index, nodes);
      });
  }

  /**
   * // TODO: Plot Y-axis
   * @param - no params
   * @returns - void
   */
  plotYAxis() {
    // Plot Y axis
    d3.selectAll(".column-chart-yaxis")
      .select("svg")
      .remove();
    this.yAxisSvg = d3
      .select(".column-chart-yaxis")
      .append("svg")
      .attr("width", COLUMN_CHART_CONFIG.yAxisSvgConf.width)
      .attr("height", COLUMN_CHART_CONFIG.yAxisSvgConf.height)
      .data(this.stackSeries)
      .attr("class", "column-chart-yaxis-svg");

    this.yAxisgraph = this.yAxisSvg
      .append("g")
      .data(this.stackSeries)
      .attr("class", "top-layer")
      .attr("transform", "translate(35, 20)");

    this.peakValue = d3.max(
      this.stackSeries[this.stackSeries.length - 1],
      d => +d[1]
    );

    this.yScale = d3
      .scaleLinear()
      .domain(this.getYAxisDomain())
      .nice()
      .rangeRound([190, 0]);

    if (this.enablePrint) {
      this.yAxisgraph
        .append("g")
        .data(this.stackSeries)
        .attr("transform", "translate(10, 0 )")
        .attr("class", "y-axis")
        .attr("stroke-opacity", "0")
        .call(
          d3
            .axisLeft(this.yScale)
            .tickValues([
              0,
              this.yScale.domain()[1] / 2,
              this.yScale.domain()[1]
            ])
            .tickSize(2)
            .tickFormat(d => {
              // return this.getTickFormat(d);
              return d + "";
            })
        );
    } else {
      // insert y-axis into the graph scale
      this.yAxisgraph
        .append("g")
        .data(this.stackSeries)
        .attr("transform", "translate(10, 0 )")
        .attr("class", "y-axis")
        .attr("stroke-opacity", "0")
        .call(
          d3
            .axisLeft(this.yScale)
            .tickValues([
              0,
              this.yScale.domain()[1] / 2,
              this.yScale.domain()[1]
            ])
            .tickSize(2)
            .tickFormat(d => {
              return this.getTickFormat(d);
              // return d + '';
            })
        );
    }
  }

  /**
   * // TODO: Y - Axis domain
   * @param - no params
   * @returns - Array<number>
   */
  getYAxisDomain(): Array<number> {
    return [0, this.peakValue];
  }

  /**
   * // TODO: Tick format
   * @param - data: AxisFormat
   * @returns - void
   */
  getTickFormat(d: any) {
    let format = d3.format(".2s");
    if (this.activeDropdown.length > 0) {
      if (this.chartConfig[FRONT_END_COLUMN_CHART_CONFIG.yAxisFormat] != null) {
        if (
          this.chartConfig[FRONT_END_COLUMN_CHART_CONFIG.yAxisFormat][
            this.activeDropdown
          ] === COLUMN_CHART_CONFIG.yAxisFormatPercentageKey
        ) {
          return d + "%";
        } else {
          if (Math.floor(Math.log(d) / Math.LN10 + 1) > 3) {
            return format(d);
          } else {
            return d;
          }
        }
      } else {
        if (Math.floor(Math.log(d) / Math.LN10 + 1) > 3) {
          return format(d);
        } else {
          return d;
        }
      }
    } else {
      if (Math.floor(Math.log(d) / Math.LN10 + 1) > 3) {
        return format(d);
      } else {
        return d;
      }
    }
  }

  /**
   * // TODO: Plot X-axis
   * @param - totalWidth: number
   * @returns - void
   */
  plotXAxis(totalWidth: number) {
    this.xScale = d3
      .scaleBand()
      .range([0, totalWidth])
      .domain(this.xAxisLabels)
      .padding(0.3);

    this.stack = d3.stack().keys(this.stackSeriesKeys);

    // to apply our loaded data into the stack shape
    this.stackSeries = this.stack(this.columnChartData);

    this.xAxisSvg = d3
      .select(".column-chart-xaxis")
      .append("svg")
      .attr("width", COLUMN_CHART_CONFIG.xAxisSvgConf.width)
      .attr("height", COLUMN_CHART_CONFIG.xAxisSvgConf.height)
      .data(this.stackSeries)
      .attr("class", "column-chart-xaxis-svg");

    this.xAxisgraph = this.xAxisSvg
      .append("g")
      .data(this.stackSeries)
      .attr("class", "top-layer")
      .attr("transform", "translate(0, 25)");

    this.xAxisgraph
      .append("g")
      .attr("class", "x-axis")
      .call(d3.axisBottom(this.xScale).tickSize(0));

    d3.select(".x-axis")
      .select(".domain")
      .attr("stroke", "transparent")
      .attr("fill", "transparent");
    this.getXAxisWrap(totalWidth);
  }

  /**
   * // TODO: X-axis wrapping
   * @param - totalWidth: number
   * @returns - void
   */
  getXAxisWrap(totalWidth: number) {
    // Xaxis text split
    let xAxislabelLength = this.xScale.bandwidth();
    d3.select(".x-axis")
      .selectAll(".tick text")
      .call(function(text) {
        text.each(function() {
          let text = d3.select(this),
            words = text
              .text()
              .split(/\s+/)
              .reverse(),
            word: string,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1,
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text
              .text(null)
              .append("tspan")
              .attr("x", 0)
              .attr("y", y)
              .attr("dy", dy + "em");
          while ((word = words.pop())) {
            line.push(word);
            tspan.text(line.join(" "));
            if (
              tspan.node().getComputedTextLength() > xAxislabelLength &&
              line.length > 1
            ) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              if (tspan.node().getComputedTextLength() > xAxislabelLength) {
                word = word.slice(0, 1);
                tspan = text
                  .append("tspan")
                  .attr("x", 0)
                  .attr("y", y)
                  .attr("dy", ++lineNumber * lineHeight + dy + "em")
                  .text("..");
              } else {
                tspan = text
                  .append("tspan")
                  .attr("x", 0)
                  .attr("y", y)
                  .attr("dy", ++lineNumber * lineHeight + dy + "em")
                  .text(word);
              }
            }
          }
        });
      });
  }

  /**
   * // TODO: Plot line chart on the top of column chart
   * @param - tabName: string, xaxisBarKey: string
   * @returns - void
   */
  plotLineChart(xaxisBarKey: string) {
    this.linePlotData = [];
    this.stackSeries[this.stackSeries.length - 1].map(d => {
      this.linePlotData.push({ yAxis: d[1], xAxis: d.data[xaxisBarKey] });
    });

    // Plot line when more than one column
    if (this.linePlotData.length <= 1) {
      return false;
    }

    this.line = d3
      .line()
      .x(data => {
        return this.xScale.bandwidth() / 2 + this.xScale(data["xAxis"]);
      })
      .y(data => {
        if (isNaN(data["yAxis"])) {
          return 0;
        } else {
          return this.yScale(data["yAxis"]);
        }
      })
      .curve(d3.curveCatmullRom.alpha(0.5));

    this.linePlot = this.line(this.linePlotData);

    // Line Creation
    this.pathAnimation = this.chartBodyGraph
      .append("path")
      .attr("transform", "translate(0,35)")
      .datum(this.stackSeries)
      .attr("fill", "none")
      .attr("stroke", "rgb(255,215,0)")
      .attr("stroke-width", 1.5)
      .attr("d", this.linePlot);

    // Dot creation
    this.chartBodyGraph
      .append("g")
      .attr("transform", "translate(0,35)")
      .selectAll(".dot")
      .data(this.linePlotData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("fill", "white")
      .attr("stroke", "rgb(255,215,0)")
      .attr(
        "cx",
        (data, i) => this.xScale.bandwidth() / 2 + this.xScale(data["xAxis"])
      )
      .attr("cy", data => {
        if (isNaN(data["yAxis"])) {
        } else {
          return this.yScale(data["yAxis"]);
        }
      })
      .attr("r", 5);

    this.pathLength = this.pathAnimation.node().getTotalLength();

    // line plot animation
    this.pathAnimation
      .attr("stroke-dasharray", this.pathLength + " " + this.pathLength)
      .attr("stroke-dashoffset", this.pathLength)
      .transition()
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);
  }

  /**
   * // TODO: Plot Horizontal middle line
   * @param - totalWidth: number
   * @returns - void
   */
  getHorizontalLine(totalWidth: number) {
    let x = d3.scaleBand().range([0, totalWidth]);

    this.chartBodySvg
      .append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0,120)")
      .call(d3.axisBottom(x).tickSize(0));
  }

  // label on the top of the bar
  getTopLabel(xaxisBarKey) {
    this.chartBodySvg
      .selectAll("g.stack-bar-label")
      .data(function(d, i) {
        return d;
      })
      .append("g")
      .append("text")
      .attr("class", "scol-chart-label fill-grey")
      .attr("y", (d, i) => {
        return (
          COLUMN_CHART_CONFIG.textOnTopPad + this.yScale(this.calculateData(d))
        );
      })
      .attr("x", (d, i) => {
        if (this.xScale.bandwidth() > COLUMN_CHART_CONFIG.maxBarWidth) {
          return (
            this.xScale(d.data[xaxisBarKey]) +
            COLUMN_CHART_CONFIG.maxBarWidth -
            27
          );
        } else {
          return (
            this.xScale(d.data[xaxisBarKey]) + this.xScale.bandwidth() - 27
          );
        }
      })
      .text((d, i) => {
        return this.calculateDataFormat(d);
      });
  }

  /**
   * // TODO: Get Label inside chart
   * @param - tabName: string, xaxisBarKey: string
   * @returns - void
   */
  getLabel(xaxisBarKey: string) {
    let g = this.layer.selectAll(".stack-bar-label").append("g");

    g.append("rect")
      .style("fill", "black")
      .attr("y", (d, i) => {
        return this.yScale(d[1]) + 3;
      })
      .attr("x", (d, i) => {
        if (this.xScale.bandwidth() > COLUMN_CHART_CONFIG.maxBarWidth) {
          return (
            this.xScale(d.data[xaxisBarKey]) +
            COLUMN_CHART_CONFIG.maxBarWidth -
            18
          );
        } else {
          return (
            this.xScale(d.data[xaxisBarKey]) + this.xScale.bandwidth() - 18
          );
        }
      })
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("height", (d, i) => {
        this.yScale(d[0]) - this.yScale(d[1]) > 18 ? 16 : 0;
      })
      .attr("width", 18)
      .attr("opacity", 0.3)
      .on("mouseover", (data, index, node) => {
        this.getMouseOver(data, index, node);
      })
      .on("mousemove", (data, index, nodes) => {
        this.getMouseMove(data, index, nodes, xaxisBarKey);
      })
      .on("mouseout", (data, index, nodes) => {
        this.getMouseOut(data, index, nodes);
      });

    // Text on Bars
    g.append("text")
      .attr("class", "col-chart-label fill-white")
      .attr("y", (d, i) => {
        return COLUMN_CHART_CONFIG.textOnBarPad + this.yScale(d[1]);
      })
      .attr("x", (d, i) => {
        if (this.xScale.bandwidth() > COLUMN_CHART_CONFIG.maxBarWidth) {
          return (
            this.xScale(d.data[xaxisBarKey]) +
            COLUMN_CHART_CONFIG.maxBarWidth -
            18 +
            5
          );
        } else {
          return (
            this.xScale(d.data[xaxisBarKey]) + this.xScale.bandwidth() - 18 + 5
          );
        }
      })
      .attr("height", (d, i) => {
        return this.yScale(d[0]) - this.yScale(d[1]);
      })
      .text((d, i) => {
        if (isNaN(d[1])) {
          return 0;
        } else {
          return d[1] - d[0] == 0 ? null : d[1] - d[0];
        }
      })
      .on("mouseover", (data, index, node) => {
        this.getMouseOver(data, index, node);
      })
      .on("mousemove", (data, index, nodes) => {
        this.getMouseMove(data, index, nodes, xaxisBarKey);
      })
      .on("mouseout", (data, index, nodes) => {
        this.getMouseOut(data, index, nodes);
      });
  }

  /**
   * // TODO: Render tooltip
   * @param - data: any, index: number, node: any, mouseOverKey: string
   * @returns - void
   */
  getToolTip(data: any, index: number, node: any, mouseOverKey: string) {
    let formatedDate = data["data"][this.currentTabXaxisKey];
    this.toolTip.classed("col-chart-tooltip", true);
    let tooltipList: string = "";
    for (let index = 0; index < this.tooltipBody.length; index++) {
      // format replacement
      let currentFormat: string = this.tooltipBody[index][
        FRONT_END_COLUMN_CHART_CONFIG.tooltip.tooltipBody.format
      ];
      let keysOfCurrentFormat: string[] = currentFormat.match(this.regExp);

      for (let i = 0; i < keysOfCurrentFormat.length; i++) {
        keysOfCurrentFormat[i] = keysOfCurrentFormat[i].substring(
          1,
          keysOfCurrentFormat[i].length - 1
        );
        currentFormat = currentFormat.replace(
          COLUMN_CHART_CONFIG.replaceKey +
            keysOfCurrentFormat[i] +
            COLUMN_CHART_CONFIG.replaceKey,
          data["data"][mouseOverKey + COLUMN_CHART_CONFIG.tooltipLabel][
            keysOfCurrentFormat[i]
          ]
        );
      }
      // html setup - for indentation
      if (
        this.tooltipBody[index][
          FRONT_END_COLUMN_CHART_CONFIG.tooltip.tooltipBody.indent
        ] &&
        this.tooltipBody[index][
          FRONT_END_COLUMN_CHART_CONFIG.tooltip.tooltipBody.indentationLevel
        ] !== 0
      ) {
        if (
          this.tooltipBody[index][
            FRONT_END_COLUMN_CHART_CONFIG.tooltip.tooltipBody.label
          ].length > 0
        ) {
          tooltipList += `<tr><td style="padding-left: ${this.tooltipBody[
            index
          ][
            FRONT_END_COLUMN_CHART_CONFIG.tooltip.tooltipBody.indentationLevel
          ] * 10}px;">
                  ${
                    this.tooltipBody[index][
                      FRONT_END_COLUMN_CHART_CONFIG.tooltip.tooltipBody.label
                    ]
                  }
              </td> <td class="align-right">${currentFormat}</td></tr>`;
        } else {
          tooltipList += `<tr><td style="padding-left: ${this.tooltipBody[
            index
          ][
            FRONT_END_COLUMN_CHART_CONFIG.tooltip.tooltipBody.indentationLevel
          ] * 10}px;">
                  ${
                    this.tooltipBody[index][
                      FRONT_END_COLUMN_CHART_CONFIG.tooltip.tooltipBody.label
                    ]
                  }
          </td><td></td></tr>`;
        }
      } else {
        if (
          this.tooltipBody[index][
            FRONT_END_COLUMN_CHART_CONFIG.tooltip.tooltipBody.label
          ].length > 0
        ) {
          tooltipList += `<tr><td>${
            this.tooltipBody[index][
              FRONT_END_COLUMN_CHART_CONFIG.tooltip.tooltipBody.label
            ]
          }</td> <td class="align-right">${currentFormat}</td></tr>`;
        } else {
          tooltipList += `<tr><td>${currentFormat}</td><td></td></tr>`;
        }
      }
    }

    if (this.activeDropdown) {
      tooltipList = tooltipList.replace(
        " " + COLUMN_CHART_CONFIG.tooltipActiveClass,
        ""
      );
      tooltipList = tooltipList.replace(
        new RegExp(this.activeDropdown, "g"),
        this.activeDropdown + " " + COLUMN_CHART_CONFIG.tooltipActiveClass
      );
    }

    this.toolTip.html(
      `<div class="chart-tooltip-card col-chart-tooltip-card">
            <div class="chart-tooltip-header">
              <div class="chart-tooltip-header-ipc-detail">
                  <div class="chart-tooltip-header-ipc-icon-detail">
                  </div>
                  <div class="chart-tooltip-header-ipc">
                        <h5> &nbsp; ${this.titleCasePipe.transform(
                          mouseOverKey
                        )} | ${formatedDate}</h5>
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
    );
    return true;
  }

  /**
   * // TODO: To get each stack count - For top label
   * @param - data: any
   * @returns - void
   */
  calculateDataFormat(d: any) {
    let totalData = 0;
    this.stackSeriesKeys.forEach(function(k) {
      totalData += +d.data[k];
    });
    if (Math.floor(Math.log(totalData) / Math.LN10 + 1) > 3) {
      let format = d3.format(".2s");
      return format(totalData);
    } else {
      return Math.round(totalData);
    }
  }

  /**
   * // TODO: To get each stack count - For top label
   * @param - data: any
   * @returns - void
   */
  calculateData(d: any) {
    let totalData = 0;
    this.stackSeriesKeys.forEach(function(k) {
      totalData += +d.data[k];
    });
    return totalData;
  }

  /**
   * // TODO: Mouse over
   * @param - data: any, index: number, node: any
   * @returns - void
   */
  getMouseOver(data: any, index: number, node: any) {
    let mouseOverKey = d3.event.path[2].id;
    this.getToolTip(data, index, node, mouseOverKey);
    this.toolTip.style("opacity", "1").style("display", "inline");
  }
  /**
   * // TODO: Mouse move
   * @param - data: any, index: number, node: any
   * @returns - void
   */
  getMouseMove(data: any, index: number, node: any, xaxisBarKey: string) {
    let tooltipWidth = this.chartTooltip.nativeElement.clientWidth;
    let toolTipHeight = this.chartTooltip.nativeElement.clientHeight;

    this.toolTip
      .style(
        "left",
        `${d3.event.layerX -
          d3.event.offsetX -
          5 +
          this.xScale(data.data[xaxisBarKey]) -
          tooltipWidth}px`
      )
      .style("top", `${d3.event.layerY - toolTipHeight / 2}px`)
      .style("display", "inline")
      .style("opacity", "1");
  }
  /**
   * // TODO: mouse out
   * @param - data: any, index: number, node: any
   * @returns - void
   */
  getMouseOut(data: any, index: number, node: any) {
    this.toolTip.style("opacity", "0").style("display", "none");
  }
}
