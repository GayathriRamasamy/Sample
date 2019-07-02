
const FRONT_END_CONFIG = {
  // icon
  icon: 'category',
  // tooltip flag
  flag: 'flag',
  // details page navigation
  navigationUrl: 'detailUrl',
  // bubble size
  potential: 'bubbleSizeName',
  // grouping
  group: 'group_category',
  // year over year toggle value from header part
  yearOverYearLabel: 'yearOverYear',
  // header title template
  activeSecondLevelTab: 'secondLevelTab', 
  // legend template
  activeDateRange: 'dateRange',
  // infoTip config label
  infoTip: 'infoTip',
  // infoTip data API label
  infoTipKey: 'totalCurrentYear',
  // year on year key for oil and application
  yearOnYearKey: 'yearOnYear',
  // enable infoTip
  enableInfoTipKey: 'showInfoTip',
  // legend header change when we change drop down option
  dropDownKey: 'dropDownOption',
  // legend header name
  legendFormat: 'legendFormat', 
  // legend header name value - percentage
  percentageValue: 'percentage',
  // percentage 
  percentage: '%',
  // header title
  headerTitle: {
    key: 'header',
    groupFormat: 'group',
    splitFormat: 'split'
  },
  // legend
  legend: {
    key: 'legend',
    group: {
      key: 'group',
      header: {
        key: 'header',
        rightAlignment: {
          key: 'right',
          name: 'name',
          value: 'format'
        },
        leftAlignment: {
          key: 'left',
          name: 'name',
          value: 'format'
        },
      },
      legendFormat: 'legendFormat'
    },
    split: {
      key: 'split',
      header: {
        key: 'header',
        rightAlignment: {
          key: 'right',
          name: 'name',
          value: 'format'
        },
        leftAlignment: {
          key: 'left',
          name: 'name',
          value: 'format'
        },
      },
      legendFormat: 'legendFormat'
    },
  },

  // tooltip
  tooltip: {
    key: 'toolTip',
    tooltipHeader: {
      key: 'header',
      title: 'line1',
      subTitle: 'line2'
    },
    tooltipBody: {
      key: 'body',
      indent: 'indent',
      indentationLevel: 'intentLevel',
      value: 'key',
      format: 'format',
      label: 'label'
    },
  },
  // drop down option
  dropDown: {
    key: 'dropDown',
    name: 'name',
    value: 'value',
  },
  // header toggle
  headerToggle: 'headerTab',
  // yoy split
  split: {
    key: 'splitData',
    isSplit: 'isSplit',
    splitBy: 'splitKey',
    chartDetail: 'default',
    leftChartDetail: 'left',
    rightChartDetail: 'right'
  },
  // data api label
  previousYearLabel: 'previousYear',
  currentYearLabel: 'currentYear',
  totalCurrentYearLabel: 'totalCurrentYear',
  totalPreviousYearLabel: 'totalPreviousYear',
  // regular expression pattern for format separation in infoTip and header title
  regExpPattern: '@\\w{0,}@',
  regExpFlag: 'gi',
  replaceKey: '@',
  // chart label setup
  previousYearData: 'previousYearCount',
  currentYearData: 'currentYearCount',
  // main legend api label
  mainLegendCategoryKey: 'legend',
  mainLegendColorKey: 'Color',

};

const BUBBLE_CHART_ICON_CONFIG = {
  informationIcon: './assets/icon/icon-information.svg',
  tooltipPersonalWashIcon: './assets/img/blackicon/Personal_wash.png',
  overlayIcon: 'zoom_in',
  yoyLabel: 'Show year over year',
  defaultDropDownOption: '--Select category--',
  overlayClose: 'close',
  // tooltip image maaping
  'CROSS CATEGORY': 'Inverse_Cross_Category', 
  'FABRIC CARE': 'Fabric_Care',
  'FINE FRAGRANCE': 'Fine_Fragrance',
  'HAIR CARE': 'Hair_Care',
  'HOME CARE': 'Home_Care',
  'PERSONAL WASH': 'Personal_wash',
  'TOILETRIES': 'Inverse_Toiletries',
  'null': 'Inverse_Cross_Category',
};

const BUBBLE_CHART_CONFIG = {
  bubblePadding: '0.3',
  infoTipActiveClass: 'bold',
  headerTitleActiveClass: 'active-header',
  bubbleChartHeight: 200,
  bubbleChartWidth: 250,
  yoyBubbleChartWidth: 300,
  yoyBubbleChartHeight: 150,
  simulationForceStrength: 1,
  thresholdCount: 50,
  splitOpacity: 0.5,
  rootNodeStrokeColor: 'lightgrey',
  rootNodeFillColor: 'white',

  defaultDropdownProduct: 'AVG_IFFINGREDNTS',
  productTab: 'product',

  // Legend
  dropDownHeight: '40',
  chartSvgHeight: '240',
  legendTitleHeight: '20',
  legendContentHeight: '30',

  // split
  currentYearRegionXPosition: '200',
  currentYearRegionYPosition: '100',
  previousYearRegionXPosition: '240',
  previousYearRegionYPosition: '100',

  // pixel movement from center of the circle
  splitXStartPosition: '50',
  splitYStartPosition: '50',

  // space between center of origin to node
  groupXStartPosition: '40',
  groupYStartPosition: '40',
  groupXStartNormalPosition: '0',
  groupYStartNormalPosition: '0',

  // group
  groupRegionXPosition: '125',
  groupRegionYPosition: '100',
};

const BUBBLE_CHART_OVERLAY_CONFIG = {
  defaultSplit: false,
  bubbleChartHeight: 550,
  bubbleChartWidth: 680,
  yoyBubbleChartWidth: 580,
  yoyBubbleChartHeight: 450,
  simulationForceStrength: 0.8,
  splitOpacity: 0.5,
  rootNodeStrokeColor: 'lightgrey',
  rootNodeFillColor: 'white',
  // Legend
  dropDownHeight: '60',
  chartSvgHeight: '610',
  legendTitleHeight: '20',
  legendContentHeight: '30',

  // split
  currentYearRegionXPosition: '390',
  currentYearRegionYPosition: '275',
  previousYearRegionXPosition: '520',
  previousYearRegionYPosition: '275',

  // pixel movement from center of the circle
  splitXStartPosition: '100',
  splitYStartPosition: '130',

  //
  groupXStartPosition: '50',
  groupYStartPosition: '50',
  groupXStartNormalPosition: '100',
  groupYStartNormalPosition: '100',

  // group
  groupRegionXPosition: '350',
  groupRegionYPosition: '275',
};


export { 
  FRONT_END_CONFIG, 
  BUBBLE_CHART_ICON_CONFIG,
  BUBBLE_CHART_CONFIG, 
  BUBBLE_CHART_OVERLAY_CONFIG 
};

