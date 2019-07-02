
export const FRONT_END_COLUMN_CHART_CONFIG = {
  stackSeriesKeys: 'keys',
  enableLine: "isLineChart",
  headerTabData: 'tabList',
  enableMidLine: 'showHorizontalMiddleLine',
  enableLabel: 'showLabel',
  yAxisFormat: 'yAxisFormat',
  chartType: 'chartType',
  stackHeight: 'stackHeight',
  chart1Key: 'chart1Key',
  chart2Key: 'chart2Key',
  dataKey: "dataKey",
  chartBody: "body",
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
      label: 'label',
      format: 'format'
    },
  },
  default_detail_header_tab: 'VOLUME'
};


export const ICON_CONFIG = {
    // icon
    icon: 'CATEGORY',
    // tooltip flag
    flag: 'flag',
  detailBtn: 'DETAILS',
  tooltipPersonalWashIcon: './assets/img/blackicon/Personal_wash.png'
};

export const COLUMN_CHART_CONFIG = {
  defaultTabIndex: 0,
  yearOverYearLabel: 'yearOverYear',
  // regular expression pattern for format separation in infoTip and header title
  regExpPattern: '@\\w{0,}@',
  regExpFlag: 'gi',
  replaceKey: '@',
  tooltipActiveClass: 'bold',
  yAxisFormatPercentageKey: 'percentage',
  // Chart Config
  xAxisSvgConf: { width: "100%", height: "65px" },
  yAxisSvgConf: { width: "50px", height: "225px" },
  chartBodySvgConf: { width: "100%", height: "215px" },
  maxBarWidth: 400,
  rectBarWidth: 700,
  rectBarStartPos: 20,
  textOnBarPad: 15,
  textOnTopPad: -5,

  tooltipLabel: '-toolTipData',

  yoyTrueOps: '0.5',
  yoyFalseOps: '1',

  currentYear: "currentYear",
  previousYear: "previousYear",
  yoyStatus: "yoyStatus"
};

