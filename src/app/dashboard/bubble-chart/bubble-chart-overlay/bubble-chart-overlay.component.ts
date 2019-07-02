import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as d3 from 'd3';
// Utility
import { BubbleChartUtility } from 'src/app/_shared/utility/bubble-chart-utility';
// Config
import {
  BUBBLE_CHART_CONFIG, BUBBLE_CHART_ICON_CONFIG, BUBBLE_CHART_OVERLAY_CONFIG, FRONT_END_CONFIG
} from '../../../_config/bubble-chart/bubble-chart.config';
// Service
import { BubbleChartService } from 'src/app/_services/+dashboard/bubble-chart/bubble-chart.service';
import { ConfigService } from '../../../_services/+dashboard/config.service';
import { ToastrService } from 'ngx-toastr';
// Common
import {ErrorMessage} from '../../../_shared/messages/ErrorMessage';
import { DashboardService } from '../../../_services/+dashboard/dashboard.service';

@Component({
  selector: 'app-bubble-chart-overlay',
  templateUrl: './bubble-chart-overlay.component.html',
  styleUrls: ['./bubble-chart-overlay.component.scss'],
  // encapsulation: ViewEncapsulation.Emulated
})
export class BubbleChartOverlayComponent implements OnInit {

  @ViewChild('bubbleChartOverlayTooltip') chartTooltip: ElementRef;
  @ViewChild('bubChartOverlayInfoTip') chartInfoTip: ElementRef;

  @Input() overlayData: Object;
  // svg selection
  private svg: any;
  // Regular expression
  private regExp: RegExp;
  // From bubble chart component
  private apiData: object; // response
  public yoy: boolean; // year over year 
  public hasDropDown: boolean; // enable dropdown
  private dropDown: Object;  // dropdown
  public headerTitle: string; // header title
  private headerToggle: Array<string> = []; // header toggle (eg - by Volume & etc.,)
  public infoTip: string; // information icon
  private colorCode: Array<string> = []; 
  private colorDomain: Array<string> = [];
  private legendFormat: string;
  private legendHeader: any;
  private activeDateRange: string;
  private activeDateValue: string;
  private activeFirstLevelTab: string;
  private activeSecondLevelTab: string;
  private activeFilters: object;
  private activeType: string;
  private activeTabToggle: Array<string>;
  private activeDropDownOption: string;
  private activeDropDownValue: string;
  private activeSecondLevelTabValue: string;
  private tooltip: object;
  private headerFilter: object;
  private startDate: string;
  private endDate: string;
  private leftChartDetail: string; // API response - chart key (eg- oil)
  private rightChartDetail: string; // API response - chart key (eg- application)
  // chart
  public chart: Object;
  // label
  private chartLabel: Object;
  // Icon
  public icon: Object;
  // Header toggle
  private activeHeaderToggle: string;
  private utility: BubbleChartUtility;
  public enableHeaderToggle: boolean = false;
  // key value pipe
  public sortFn = (a, b) => 0;
  private chartConfig: Object;
  // scroll legend option
  public rightLegend: Array<object>;
  public leftLegend: Array<object>;
  public rightLegendTitle: Array<string>;
  public leftLegendTitle: Array<string>;
  // to change legend header name - Dropdown changes
  private prevSelectedDropDown: string;
  private headerTitleTemplate: string;
  
  /**
  * // TODO: Component instant
  * @param - activeModal: NgbActiveModal, bubbleChartService: BubbleChartService
  * @returns - void
  */
  constructor(
    public activeModal: NgbActiveModal, 
    private configService: ConfigService,
    private bubbleChartService: BubbleChartService,
    private toastrService: ToastrService,
    private dashBoardService: DashboardService
  ) {
    this.utility = new BubbleChartUtility();
  }

  ngAfterViewInit() {
    d3.select('.bub-chart-overlay-top-header').select('.info-icon').select('#tooltip')
    .select('.overlay-infoTip').on('mouseover', () => {
      let popOverHeight =  this.chartInfoTip.nativeElement.clientHeight;
      if(d3.event.screenY !<= popOverHeight){
        d3.select('.bub-chart-overlay-top-header').select('.info-icon').select('#tooltip').select('.overlay-infoTip').attr('class', 'infoTip');
      }
    }).on('mouseout', ()=> {
      d3.select('.bub-chart-overlay-top-header').select('.info-icon').select('#tooltip').select('.infoTip').attr('class', 'overlay-infoTip');
    });
  }

  ngOnInit() {
    // To get chart config
    this.configService.chartConfig.subscribe( configuration => {
      if(configuration['bubbleChart']) {
        this.chartConfig = configuration['bubbleChart'];
        // chart label
        this.chartLabel = {
          chartDetail: this.chartConfig[FRONT_END_CONFIG.split.key][FRONT_END_CONFIG.split.chartDetail],
          currentYearLabel: FRONT_END_CONFIG.currentYearLabel,
          previousYearLabel: FRONT_END_CONFIG.previousYearLabel,
          previousYearData: FRONT_END_CONFIG.previousYearData,
          currentYearData: FRONT_END_CONFIG.currentYearData,
          dateRangeLabel: FRONT_END_CONFIG.activeDateRange,
          activeSecondLevelTabLabel: FRONT_END_CONFIG.activeSecondLevelTab,
        }
        // icon 
        this.icon = {
          overlayClose:  BUBBLE_CHART_ICON_CONFIG.overlayClose,
          defaultDropDownOption: BUBBLE_CHART_ICON_CONFIG.defaultDropDownOption,
          infoIcon:  BUBBLE_CHART_ICON_CONFIG.informationIcon,
          tooltipPersonalWashIcon:  BUBBLE_CHART_ICON_CONFIG.tooltipPersonalWashIcon
        };
        // chart
        this.chart = {
          bubbleSize: this.chartConfig[FRONT_END_CONFIG.potential],
          isSplit: BUBBLE_CHART_OVERLAY_CONFIG.defaultSplit,
          group: FRONT_END_CONFIG.group,
          splitBy: this.chartConfig[FRONT_END_CONFIG.split.key][FRONT_END_CONFIG.split.splitBy],
          simulationForceStrength: BUBBLE_CHART_CONFIG.simulationForceStrength,
          chartHeight: BUBBLE_CHART_OVERLAY_CONFIG.bubbleChartHeight,
          chartWidth: BUBBLE_CHART_OVERLAY_CONFIG.bubbleChartWidth,
          splitChartWidth: BUBBLE_CHART_OVERLAY_CONFIG.yoyBubbleChartWidth,
          splitChartHeight: BUBBLE_CHART_OVERLAY_CONFIG.yoyBubbleChartHeight,
          splitOpacity: BUBBLE_CHART_OVERLAY_CONFIG.splitOpacity,
          rootNodeFillColor: BUBBLE_CHART_OVERLAY_CONFIG.rootNodeFillColor,
          rootNodeStrokeColor: BUBBLE_CHART_OVERLAY_CONFIG.rootNodeStrokeColor,
        };
        // Regular expression pattern
        this.regExp = new RegExp(FRONT_END_CONFIG.regExpPattern, FRONT_END_CONFIG.regExpFlag);
        // response - bubble chart
        this.apiData = this.overlayData['apiData'];
        this.chart['isSplit'] = this.overlayData['yoy'];
        this.dropDown = this.overlayData['dropDown'];
        this.headerTitleTemplate = this.overlayData['header'];
        this.headerToggle = this.overlayData['headerToggle'];
        this.infoTip = this.overlayData['infoTip'];
        this.colorCode = this.overlayData['colorCode'];
        this.colorDomain = this.overlayData['colorDomain'];
        this.legendFormat = this.overlayData['legendFormat'];
        this.legendHeader = this.overlayData['legendHeader'];
        this.activeDateValue = this.overlayData['dateValue'];
        this.activeDateRange = this.overlayData['dateRange'];
        this.activeFirstLevelTab = this.overlayData['firstLevelTab'];
        this.activeSecondLevelTab = this.overlayData['secondLevelTab'];
        this.activeFilters = this.overlayData['filter'];
        this.activeType = this.overlayData['sortedOption'];
        this.activeTabToggle = this.overlayData['tabToggle'];
        this.tooltip = this.overlayData['tooltip'];
        this.activeDropDownOption = this.overlayData['activeDropdown'];
        this.headerFilter = this.overlayData['headerFilter'];
        this.startDate = this.overlayData['startDate'];
        this.endDate = this.overlayData['endDate'];
        this.activeSecondLevelTabValue = this.overlayData['activeSecondLevelTabValue']
        // bubble chart key - special case(eg- oil and application) 
        if ((this.chartLabel['chartDetail'].length) || (!this.chartLabel['chartDetail'])) {
          this.leftChartDetail = this.chartConfig[FRONT_END_CONFIG.split.key][FRONT_END_CONFIG.split.leftChartDetail];
          this.rightChartDetail = this.chartConfig[FRONT_END_CONFIG.split.key][FRONT_END_CONFIG.split.rightChartDetail];
        }
        // Header toggle
        if (Object.keys(this.headerToggle).length > 0) {
          this.activeHeaderToggle = this.overlayData['headerToggleOption'];
          this.enableHeaderToggle = true;
        }
        // Dropdown options
        if (Object.keys(this.dropDown).length > 0) {
          this.hasDropDown = true;
          this.activeDropDownValue = this.dropDown[this.activeDropDownOption] 
        }
        // SVG selection
        this.svg = d3.select('.bub-chart-overlay')
          .select('.bub-chart-overlay-content').select('.bub-chart-overlay-svg-container').select('svg');
        // initial rendering of chart
        this.getChart(this.apiData, this.chart['isSplit']);
        this.changeDynamicTemplate();
      }
    });
  }

  /**
  * // TODO: To activate header toggle
  * Gets script version
  * @param - toggle: string
  * @returns - void
  */
  activateToggle(toggle) {
    this.activeHeaderToggle = toggle;
    //  API call
    this.getChartData();
  }

  /**
  * // TODO: Render chart 
  * Gets script version
  * @param - response: object
  * @returns - void
  */
  renderChart(response) {
    this.apiData = response;
    this.getChart(this.apiData, this.chart['isSplit']);
    this.changeDynamicTemplate();
  }

  /**
  * // TODO: To change template
  * Gets script version
  * @param - no params
  * @returns - void
  */
  changeDynamicTemplate() {


    let apiData = this.apiData[FRONT_END_CONFIG.infoTipKey];
    let headerTitleKeys: Array<string> = this.headerTitleTemplate.match(this.regExp);
    let updatedHeaderTitle = this.headerTitleTemplate;
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


    if (this.hasDropDown) {
      this.headerTitle = this.headerTitle.replace(' ' + BUBBLE_CHART_CONFIG.headerTitleActiveClass, '');
      this.headerTitle = this.headerTitle.replace(this.activeDropDownOption, this.activeDropDownOption + ' ' + 
            BUBBLE_CHART_CONFIG.headerTitleActiveClass);
      this.infoTip = this.infoTip.replace(new RegExp(' ' + BUBBLE_CHART_CONFIG.infoTipActiveClass, 'g'), '');
      this.infoTip = this.infoTip.replace(new RegExp(this.activeDropDownOption, 'g'), this.activeDropDownOption + ' ' + 
            BUBBLE_CHART_CONFIG.infoTipActiveClass);
    }

  }

  /**
  * // TODO: Dropdown option selection
  * @param - selectedOption: string, value: string
  * @returns -void
  */
  getDropDownSelection(selectedOption: string, value: string) {
    this.activeDropDownOption = selectedOption;
    this.activeDropDownValue = value;
    // API call
    this.getChartData();
  }

  /**
  * // TODO: API call
  * @param - no params
  * @returns -void
  */
  getChartData() {
    this.bubbleChartService.getBubbleChartData(this.activeFirstLevelTab,
      this.activeSecondLevelTab,
      this.activeDateRange,
      this.activeType,
      this.activeTabToggle,
      this.chart['isSplit'],
      this.activeHeaderToggle,
      this.activeDropDownOption,
      this.headerFilter,
      this.startDate,
      this.endDate,
      this.activeFilters,
      this.dashBoardService.dashboardPermission['WriteFlag']
    ).subscribe(response => {
      if(response) {
        this.renderChart(response);
      }
    }, error => {
      this.toastrService.error(ErrorMessage.BubbleChartResponseFailure);
    });
  }

  /**
  * // TODO: Plot bubble chart
  * @param - apiResponse: object, yoy: boolean
  * @returns - void
  */
  getChart(apiData: Object, yoy: Boolean) {
    //  reset chart
    this.svg.select(".bub-chart-overlay-group").html(" ");
    this.svg.select(".bub-chart-overlay-yoy").html(" ");
    // Looping - apiData
    let chartDetail: Array<object> = [];
    let currentYearDetail: Array<object> = [];
    let previousYearDetail: Array<object> = [];
    // Legend and BubbleChart input
    let currentYearLegend: Array<object> = [];
    let chartInput: any = [];
    let previousYearLegend: Array<object> = [];
    // Common
    let svg: any;
    let simulation: any;
    let bubble: any;
    let circlePack: any;
    let pack: any;
    let nodes: any;
    let sortedNode: any[] = [];
    let splitBy: string = this.chart['splitBy'];
    let tooltip: any;
    let totalRadius: number = 0;
    // Yoy
    let currentYearPercent: number = 0, previousYearPercent: number = 0;
    let currentYearAngle: number = 0, previousYearAngle: number = 0;
    let currentYearRadians: number = 0, previousYearRadians: number = 0;
    let totalPreviousYearRadius: number = 0, totalCurrentYearRadius: number = 0;
    let selectedGraph: string;
    let colors: any = d3
      .scaleOrdinal()
      .range(this.colorCode)
      .domain(this.colorDomain);
    let noOfCategory = this.colorDomain.length;
    svg = d3
    d3.select('.bub-chart-overlay')
      .select('.bub-chart-overlay-content').select('.bub-chart-overlay-svg-container').select('svg');
    tooltip = d3.select('.bub-chart-overlay')
      .select('.bub-chart-overlay-content')
      .select('.bub-chart-tooltip').style('position', 'absolute');

    if (yoy) {
      Object.keys(apiData).forEach((category) => {
        Object.keys(apiData[category]).forEach((categoryDetail) => {
          switch (categoryDetail) {
            case this.leftChartDetail: {
              apiData[category][categoryDetail].forEach((chartContent) => {
                chartContent[`${this.chart['group']}`] = category;
                chartContent[`${FRONT_END_CONFIG.yearOnYearKey}`] = true;
                chartDetail.push(apiData[category][categoryDetail]);
              });
              break;
            }
            case this.rightChartDetail: {
              apiData[category][categoryDetail].forEach((chartContent) => {
                chartContent[`${this.chart['group']}`] = category;
                chartContent[`${FRONT_END_CONFIG.yearOnYearKey}`] = false;
                chartDetail.push(apiData[category][categoryDetail]);
              });
              break;
            }
            case this.chartLabel['chartDetail']: {
              apiData[category][categoryDetail].forEach((chartContent) => {
                chartContent[`${this.chart['group']}`] = category;
                chartDetail.push(apiData[category][categoryDetail]);
              });
              break;
            }
            case this.chartLabel['currentYearLabel']: {
              apiData[category][categoryDetail][`${this.chart['group']}`] = category;
              apiData[category][categoryDetail]['color'] = colors(category);
              currentYearDetail.push(apiData[category][categoryDetail]);         
              break;
            }
            case this.chartLabel['previousYearLabel']: {
              apiData[category][categoryDetail][`${this.chart['group']}`] = category;
              apiData[category][categoryDetail]['color'] = colors(category);
              previousYearDetail.push(apiData[category][categoryDetail]);
              break;
            }
          }
        });
      });

      chartInput = [].concat(...chartDetail);
      currentYearLegend = [].concat(...currentYearDetail);
      previousYearLegend = [].concat(...previousYearDetail);

      circlePack = data =>
        d3
          .pack()
          .size([this.chart['splitChartWidth'], this.chart['splitChartHeight']])
          .padding(0)(
            d3.hierarchy({ children: data }).sum(data => {
              return data[`${this.chart['bubbleSize']}`];
            })
          );

      pack = circlePack(chartInput);

    } else {
      // BUBBLE CHART
      Object.keys(apiData).forEach((category) => {
        Object.keys(apiData[category]).forEach((categoryDetail) => {
          if ((categoryDetail === this.leftChartDetail) ||
            (categoryDetail === this.chartLabel['chartDetail']) ||
            (categoryDetail === this.rightChartDetail)
          ) {
            apiData[category][categoryDetail].forEach((chartContent) => {
              chartContent[`${this.chart['group']}`] = category;
            });
            chartDetail.push(apiData[category][categoryDetail]);
          } else if (categoryDetail === this.chartLabel['currentYearLabel']) {
            apiData[category][categoryDetail][`${this.chart['group']}`] = category;
            apiData[category][categoryDetail]['color'] = colors(category);
            currentYearDetail.push(apiData[category][categoryDetail]);
          }
        });
      });

      currentYearLegend = [].concat(...currentYearDetail);
      chartInput = [].concat(...chartDetail);

      circlePack = data =>
        d3
          .pack()
          .size([this.chart['chartWidth'], this.chart['chartHeight']])
          .padding(0)(
            d3.hierarchy({ children: data }).sum(data => {
              return data[`${this.chart['bubbleSize']}`];
            })
          );
      pack = circlePack(chartInput);
    }

    // YOY - outer circle
    if (yoy) {
      svg
        .select(".bub-chart-overlay-yoy")
        .append("circle")
        .attr("cx", 450)
        .attr("cy", 275)
        .attr("r", 275)
        .style("stroke", this.chart['rootNodeStrokeColor'])
        .attr("fill", this.chart['rootNodeFillColor']);
    }

    if (yoy) {
      selectedGraph = '.bub-chart-overlay-yoy';
    } else {
      selectedGraph = '.bub-chart-overlay-group';
    }

    

    bubble = svg
      .select(`${selectedGraph}`)
      .selectAll("circle")
      .data(pack.descendants())
      .enter()
      .append("circle");

    // circle pack
    bubble.style("fill", (data, index) => {
      if (!data['children']) {
        return colors(data["data"][`${this.chart['group']}`]);
      } else {
        return this.chart['rootNodeFillColor'];
      }
    })
      .attr("r", function (data, index) {
        totalRadius += data.r;
        return data.r;
      })
      .style("stroke", (data, index) => {
        if (index === 0) {
          return this.chart['rootNodeStrokeColor'];
        } else {
          return null;
        }
      })
      .style("opacity", (data, index) => {
        if (data['data'][`${this.chart['splitBy']}`]) {
          return this.chart['splitOpacity'];
        } else {
          return null;
        }
      })
      .attr("cx", function (data, index) {
        return data.x;
      })
      .attr("cy", function (data, index) {
        return data.y;
      });

     bubble
      .on("mouseover", (data, index, nodes) => {
            // tooltip body
           let tooltipList: string = '';
           for (let index = 0; index < this.tooltip[FRONT_END_CONFIG.tooltip.tooltipBody.key].length; index++) {
            // format replacement
             let currentFormat: string = this.tooltip[FRONT_END_CONFIG.tooltip.tooltipBody.key]
                      [index][FRONT_END_CONFIG.tooltip.tooltipBody.format];
             let keysOfCurrentFormat: Array<string> = currentFormat.match(this.regExp);
             for (let i = 0; i < keysOfCurrentFormat.length; i++) {
                keysOfCurrentFormat[i] = keysOfCurrentFormat[i].substring(1, keysOfCurrentFormat[i].length - 1);
                if( keysOfCurrentFormat[i] === 'potential' ) {
                  let format = d3.format('.1s');
                  currentFormat = currentFormat.replace(
                    FRONT_END_CONFIG.replaceKey + keysOfCurrentFormat[i] + FRONT_END_CONFIG.replaceKey, 
                    format(data['data'][keysOfCurrentFormat[i]])
                  );
                } else {
                  currentFormat = currentFormat.replace(
                    FRONT_END_CONFIG.replaceKey + keysOfCurrentFormat[i] + FRONT_END_CONFIG.replaceKey, 
                    data['data'][keysOfCurrentFormat[i]]
                  );
                }
             }
             // html setup - for indentation
             if (this.tooltip[FRONT_END_CONFIG.tooltip.tooltipBody.key][index][FRONT_END_CONFIG.tooltip.tooltipBody.indent]
               && this.tooltip[FRONT_END_CONFIG.tooltip.tooltipBody.key][index][FRONT_END_CONFIG.tooltip.tooltipBody.indentationLevel] !== 0) {
                 if (this.tooltip[FRONT_END_CONFIG.tooltip.tooltipBody.key][index][FRONT_END_CONFIG.tooltip.tooltipBody.label].length > 0) {
                   tooltipList += `<tr><td style="padding-left: ${this.tooltip[FRONT_END_CONFIG.tooltip.tooltipBody.key][index]
                      [FRONT_END_CONFIG.tooltip.tooltipBody.indentationLevel] * 10}px;">
                      ${this.tooltip[FRONT_END_CONFIG.tooltip.tooltipBody.key][index][FRONT_END_CONFIG.tooltip.tooltipBody.label]}
                       </td> <td class="align-right">${currentFormat}</td></tr>`;
                 } else {
                   tooltipList += `<tr><td style="padding-left: ${this.tooltip[FRONT_END_CONFIG.tooltip.tooltipBody.key][index]
                      [FRONT_END_CONFIG.tooltip.tooltipBody.indentationLevel] * 10}px;">
                      ${this.tooltip[FRONT_END_CONFIG.tooltip.tooltipBody.key][index][FRONT_END_CONFIG.tooltip.tooltipBody.label]}
                      </td><td></td></tr>`;
                 }
             } else {
               if (this.tooltip[FRONT_END_CONFIG.tooltip.tooltipBody.key][index][FRONT_END_CONFIG.tooltip.tooltipBody.label].length > 0) {
                 tooltipList += `<tr><td>${this.tooltip[FRONT_END_CONFIG.tooltip.tooltipBody.key][index]
                   [FRONT_END_CONFIG.tooltip.tooltipBody.label]}</td> <td class="align-right">${currentFormat}</td></tr>`;
               } else {
                 tooltipList += `<tr><td>${currentFormat}</td><td></td></tr>`;
               }
             }
           }
           // tooltip title - line 1
           let tooltipTitle: string = '';
           for (let index = 0; index < this.tooltip['line1'].length; index++) {
             tooltipTitle += `<span class="first-child-right-bar">${data['data'][this.tooltip['line1'][index]]}</span>`;
           }
           // tooltip title - line 2
           let tooltipSubTitle: string = '';
           for (let index = 0; index < this.tooltip['line2'].length; index++) {
             tooltipSubTitle += `<h5>${data['data'][this.tooltip['line2'][index]]}</h5>`;
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
   
           if (index !== 0) {
            d3.select(nodes[index]).attr("stroke", "black").style("cursor", "pointer");
              tooltip.style("opacity", 1)
                .style("display", "inline")
                .html(
                    `
                    <div class="chart-tooltip-card bub-chart-overlay-tooltip-card">
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
                );
           }
      }) 
      .on("mousemove", (data, index) => {
        if (index !== 0) {
          let toolTipWidth: number = this.chartTooltip.nativeElement.clientWidth;
          let toolTipHeight: number =  this.chartTooltip.nativeElement.clientHeight;
          if (d3.event.offsetY >= (toolTipHeight + 5)) {
            tooltip.select('div').attr('class', 'chart-tooltip-card').classed('bub-chart-overlay-tooltip-card', true);
            tooltip.style('top', (d3.event.layerY ) - (toolTipHeight + 5) - ((d3.event.offsetY - data.y) + data.r)
                  + 'px').style('left',  d3.event.layerX - (d3.event.offsetX - (data.x - data.r) - (data.r - 5) ) - (toolTipWidth / 2) + 'px');
          } else {
            tooltip.select('div').attr('class', 'left-side-tooltip-card').classed('bub-chart-overlay-tooltip-card', true);
            tooltip.style('top', d3.event.layerY - (toolTipHeight / 2) + 'px').style('left',d3.event.layerX - (d3.event.layerX - data.x)
                  - toolTipWidth - data.r + 'px');
          }
        }
      })
      .on("mouseout", function(data, index) {
        d3.select(this).attr("stroke", data => {
          return null;
        });
        tooltip.style("opacity", "0").style("display", "none");
      })
      .on("click", (data, index, n) => {
        if (index !== 0) {
         window.open("/" + data["data"][`${FRONT_END_CONFIG.navigationUrl}`]); 
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
    
    nodes.forEach(function (data) {
      if (data.value !== 0) {
        sortedNode.push(data);
      }
    });

    simulation.nodes(sortedNode);

    sortedNode.forEach((data, index) => {
      if (data['data'][`${this.chart['splitBy']}`]) {
        totalPreviousYearRadius += data.r;
        data[`${this.chartLabel['previousYearData']}`] = totalPreviousYearRadius;
      } else {
        totalCurrentYearRadius += data.r;
        data[`${this.chartLabel['currentYearData']}`] = totalCurrentYearRadius;
      }
    });

    currentYearPercent = this.utility.getPercentage(totalCurrentYearRadius, totalRadius);
    previousYearPercent = this.utility.getPercentage(totalPreviousYearRadius, totalRadius);

    currentYearAngle = this.utility.getAngle(currentYearPercent);
    previousYearAngle = this.utility.getAngle(previousYearPercent);

    currentYearRadians = this.utility.getRadians(currentYearAngle);
    previousYearRadians = this.utility.getRadians(previousYearAngle);

    let currentYearData = this.chartLabel['currentYearData'];
    let previousYearData = this.chartLabel['previousYearData'];

      // Current year region position
    let currentYearRegionXPosition = +BUBBLE_CHART_OVERLAY_CONFIG.currentYearRegionXPosition,
      currentYearRegionYPosition = +BUBBLE_CHART_OVERLAY_CONFIG.currentYearRegionYPosition,
      // Previous year region position
      previousYearRegionXPosition = +BUBBLE_CHART_OVERLAY_CONFIG.previousYearRegionXPosition,
      previousYearRegionYPosition = +BUBBLE_CHART_OVERLAY_CONFIG.previousYearRegionYPosition,
      // Split functionality start position
      splitXStartPosition = +BUBBLE_CHART_OVERLAY_CONFIG.splitXStartPosition,
      splitYStartPosition = +BUBBLE_CHART_OVERLAY_CONFIG.splitYStartPosition,
      // Group functionality start position
      groupXStartPosition = +BUBBLE_CHART_OVERLAY_CONFIG.groupXStartPosition,
      groupYStartPosition = +BUBBLE_CHART_OVERLAY_CONFIG.groupYStartPosition,
      // Group - Normal start position(from center of the origin)
      groupXStartNormalPosition = +BUBBLE_CHART_OVERLAY_CONFIG.groupXStartNormalPosition,
      groupYStartNormalPosition = +BUBBLE_CHART_OVERLAY_CONFIG.groupYStartNormalPosition,
      // Group functionality region start position
      groupRegionXPosition = +BUBBLE_CHART_OVERLAY_CONFIG.groupRegionXPosition,
      groupRegionYPosition = +BUBBLE_CHART_OVERLAY_CONFIG.groupRegionYPosition;

    simulation.on("tick", function() {
      const strength = this.alpha() ;
      const categoryCount = noOfCategory;
      sortedNode.forEach(
        function(data, index) {
          if (data.value !== 0) {
            if (yoy) {
              if (data['data'][`${splitBy}`]) {
                const xPosition = Math.cos( (data[previousYearData] / totalPreviousYearRadius) * previousYearRadians -
                    Math.PI / 2 ) * splitXStartPosition +  previousYearRegionXPosition;
                const yPosition =  Math.sin( (data[previousYearData] / totalPreviousYearRadius) * previousYearRadians -
                      Math.PI / 2 ) * splitYStartPosition + previousYearRegionYPosition;
                data.y += (yPosition - data.y) * strength;
                data.x += (xPosition - data.x) * strength;

              } else  {
                const xPosition =
                  Math.cos( ((totalCurrentYearRadius - data[currentYearData]) /  totalCurrentYearRadius) * currentYearRadians -
                      Math.PI / 2 + previousYearRadians ) * splitXStartPosition + currentYearRegionXPosition;
                const yPosition =
                  Math.sin(
                    ((totalCurrentYearRadius - data[currentYearData]) / totalCurrentYearRadius) * currentYearRadians
                      - Math.PI / 2 + previousYearRadians ) * splitYStartPosition + currentYearRegionYPosition;
                data.y += (yPosition - data.y) * strength;
                data.x += (xPosition - data.x) * strength;
              }
            } else {
              if(sortedNode.length < BUBBLE_CHART_CONFIG.thresholdCount) {
                const xPosition = Math.cos(((totalCurrentYearRadius - data[`${currentYearData}`]) /  totalCurrentYearRadius) * 
                      currentYearRadians -Math.PI * 2 + previousYearRadians ) * groupXStartNormalPosition + groupRegionXPosition;

                const yPosition = Math.sin(((totalCurrentYearRadius - data[`${currentYearData}`]) / totalCurrentYearRadius) * 
                      currentYearRadians - Math.PI * 2 + previousYearRadians ) * groupYStartNormalPosition + groupRegionYPosition;
                data.y += (yPosition - data.y) * strength;
                data.x += (xPosition - data.x) * strength;
              } else if (categoryCount > 1) {
                const xPosition = Math.cos(((totalCurrentYearRadius - data[`${currentYearData}`]) /  totalCurrentYearRadius) * 
                      currentYearRadians - Math.PI * 2 + previousYearRadians ) * groupXStartNormalPosition + groupRegionXPosition;
                const yPosition = Math.sin(((totalCurrentYearRadius - data[`${currentYearData}`]) / totalCurrentYearRadius) * 
                      currentYearRadians - Math.PI * 2 + previousYearRadians ) * groupYStartNormalPosition + groupRegionYPosition;
                data.y += (yPosition - data.y) * strength;
                data.x += (xPosition - data.x) * strength;
               } else {
                const xPosition = Math.cos(((totalCurrentYearRadius - data[`${currentYearData}`]) /  totalCurrentYearRadius) * 
                      currentYearRadians - Math.PI * 2 + previousYearRadians ) * groupXStartPosition + groupRegionXPosition;
                const yPosition = Math.sin(((totalCurrentYearRadius - data[`${currentYearData}`]) / totalCurrentYearRadius) * 
                      currentYearRadians - Math.PI * 2 + previousYearRadians ) * groupYStartPosition + groupRegionYPosition;
                data.y += (yPosition - data.y) * strength;
                data.x += (xPosition - data.x) * strength;
               }
            }
          }
        }.bind(this)
      );
       bubble
          .attr("cx", function(data, index) {
            return data.x;
          })
          .attr("cy", function(data, index) {
            return data.y;
          });
    });


    // render legend
    this.getLegend(yoy, previousYearLegend, currentYearLegend);
    // to change legend header - dropdown changes
    this.prevSelectedDropDown = this.activeDropDownOption;
  }
  /**
  * // TODO: Plot bubble chart
  * @param - apiResponse: object, yoy: boolean
  * @returns - void
  */
  getLegend(yoy: Boolean, previousYearLegend: Array<object>, currentYearLegend: Array<object>) {
    if (yoy) {
      let previousYearLegendBodyContent: Array<object> = [];
      let currentYearLegendBodyContent: Array<object> = [];
      // Header
      let previousYearLegendTitle: Array<string> = [];
      let currentYearLegendTitle: Array<string> = [];

      Object.keys(this.legendHeader).forEach(data => {
        if (data === FRONT_END_CONFIG.legend.split.header.rightAlignment.key) {
          Object.keys(this.legendHeader[data]).forEach(subElement => {
            previousYearLegendTitle = this.changeTemplate(this.legendHeader[data][subElement],
              this.apiData[FRONT_END_CONFIG.totalPreviousYearLabel], previousYearLegendTitle);
          });
        } else if (data === FRONT_END_CONFIG.legend.split.header.leftAlignment.key) {
          Object.keys(this.legendHeader[data]).forEach(subElement => {
            currentYearLegendTitle = this.changeTemplate(this.legendHeader[data][subElement],
              this.apiData[FRONT_END_CONFIG.totalCurrentYearLabel], currentYearLegendTitle);
          });
        }
      });
      
      
      for(let i = 0; i < currentYearLegend.length; i++) {
        currentYearLegendBodyContent = this.changeLegendTemplate(this.legendFormat, currentYearLegend[i], currentYearLegendBodyContent);
      }

      for(let i = 0; i < previousYearLegend.length; i++) {
        previousYearLegendBodyContent = this.changeLegendTemplate(this.legendFormat, currentYearLegend[i], previousYearLegendBodyContent);
      }

      this.leftLegend = currentYearLegendBodyContent;
      this.rightLegend = previousYearLegendBodyContent;
      this.rightLegendTitle = previousYearLegendTitle;
      this.leftLegendTitle = currentYearLegendTitle;
   

    } else {
      let currentYearLegendContent: Array<object> = [];
      // change legend template - dropdown changes
       if (this.activeDropDownOption) {
        let template: string = JSON.stringify(this.legendHeader);
        if(this.prevSelectedDropDown) {
          template = template.replace(new RegExp(FRONT_END_CONFIG.percentage, 'g'), '');
          template = template.replace(
            this.prevSelectedDropDown,
            FRONT_END_CONFIG.replaceKey + this.activeDropDownOption + FRONT_END_CONFIG.replaceKey
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
            currentYearLegendTitle = this.changeTemplate(this.legendHeader[data][subElement],
              this.apiData[FRONT_END_CONFIG.totalCurrentYearLabel], currentYearLegendTitle);
          });
        }
      });

      for(let i = 0; i < currentYearLegend.length; i++) {
        currentYearLegendContent = this.changeLegendTemplate(this.legendFormat, currentYearLegend[i], currentYearLegendContent);
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
  changeTemplate(template: string, apiData: object, result: Array<string>): Array<string> {
    let templateKeys: Array<string> = template.match(this.regExp);
    if (templateKeys !== null) {
      for (let i = 0; i < templateKeys.length; i++) {
        if (templateKeys[i] === FRONT_END_CONFIG.replaceKey + FRONT_END_CONFIG.activeDateRange + FRONT_END_CONFIG.replaceKey) {
          template = template.replace(templateKeys[i], this.activeDateValue);
        } else {
          if(this.chartConfig[FRONT_END_CONFIG.legendFormat]) {
            if(this.chartConfig[FRONT_END_CONFIG.legendFormat][this.activeDropDownOption] === FRONT_END_CONFIG.percentageValue) {
              template = template.replace(
                templateKeys[i],
                apiData[templateKeys[i].substring(1, templateKeys[i].length - 1)] + FRONT_END_CONFIG.percentage
              );
            }
          } else {
            template = template.replace(
              templateKeys[i],
              apiData[templateKeys[i].substring(1, templateKeys[i].length - 1)]
            );
          }
        }
      }
      result.push(template);
    } else if ((templateKeys === null) && (template.length > 0)) {
      result.push(template);
    }
    return result;
  }

  /**
  * // TODO: Change template from back-end
  * @param - (template: string, apiData: any, result: any[]
  * @returns - Array<string>
  */
 changeLegendTemplate(template: string, apiData: object, result: Array<object>):Array<object> {
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
