export const BAR_CHART_CONFIG = {
  margin: { top: 20, right: 20, bottom: 30, left: 0 },

  axis: { X_width: 1400, X_height: 25, Y_width: 200, Y_height: 70 },

  gridline: 1000,

  style: {
    toolPageX: 50,
    toolPageY: 140,
    svg_width: 1100,
    svg_height: 500,
    layerSize: 70,
    barHeight: 100,
    tickCount: 10,
    fontSize: 14,
    transform: 140,
    paddingSize: 0.62
  },
  sort: {
    sortby: "Sort By : ",
    ascending: "ASC",
    descending: "DESC",
    direction: ""
  },

  // Common config detail
  productKey: "strategicIngredient",
  placeholder: "Type your custom filter",
  project: "Project",
  potential: "Potential",
  noOfProjects: "Number Of Projects",
  product: "product",
  projectKey: "project",
  ingredient: "ingredient",
  valuePotential: "potential",
  // navigateURL: "https://www.iff.com/",
  informationIcon: "../../../assets/icon/icon-information.svg",
  tooltipPersonalWashIcon: "./assets/img/blackicon/Personal_wash.png",
  tooltipDDN: "../../../assets/icon/DNN.svg",
  tooltipNNU: "../../../assets/icon/NNU.svg",
  stackHeight: "stackHeight",

  // SVG details
  defaultIPCHeight: 72,
  number: "number",
  defaultSVGHeight: 400,
  defaultCount: 6,
  barWidth: 1300,
  toolLeft: 140,
  toolTop: 225,
  rectHeight: 25,
  Potential: "totalPotential",
  Number_Of_Projects: "projects",
  legendKey: "customerClassification",
  ingredients: "AVG_",
  million: 1000000,

  // Product tab sort Keys
  tooltipData: "-tooltipData",
  productTab: "PRODUCT",
  DropdownSortkey: "key",
  scentPortfolio: "scentPortfolio",
  projects: "projects",
  portFolioName: "portFolioName",
  dataKey: "dataKey",
  totalIngredient: "totalIngredient",
  navigationUrl: "detailUrl",

  // icon
  icon: "category",
  // tooltip flag
  flag: "flag",

  // tooltip image mapping
  "CROSS CATEGORY": "Inverse_Cross_Category",
  "FABRIC CARE": "Fabric_Care",
  "FINE FRAGRANCE": "Fine_Fragrance",
  "HAIR CARE": "Hair_Care",
  "HOME CARE": "Home_Care",
  "PERSONAL WASH": "Personal_wash",
  "TOILETRIES": "Inverse_Toiletries",
  'null': 'Inverse_Cross_Category',

  // RegExPatteren and Special character
  regExpPattern: "@\\w{0,}@",
  regExpFlag: "gi",
  replaceKey: "@",
  underscore: "_",
  potentailFormat: "(USD)",
  millionFormat: "M",
  boldOpenTag: "<b>",
  boldCloseTag: "</b>",
  percentFormat: "%",

  // Tooltip Data
  toolPotential: "totalPotential",

  // tooltip
  tooltip: {
    key: "toolTip",
    tooltipHeader: {
      key: "header",
      title: "line1",
      subTitle: "line2"
    },
    tooltipBody: {
      key: "body",
      indent: "indent",
      indentationLevel: "intentLevel",
      value: "key",
      format: "format",
      label: "label"
    }
  },

  // Showing of Count data in bar chart
  showLabel: "Showing",
  ofLable: "of",
  showDetail: ["@total@", "@totalCount@", "@groupParam@"]
};

export const FRONT_END_BAR_CHART_CONFIG = {
  group: "groupBy",
  grouplist: "list",
  sort: "sortBy",
  yaxis: "YAxis",
  xaxis: "XAxis",
  groupDetail: "showDetail",

  groupBy: {
    key: "groupBy",
    default: "default"
  }
};
