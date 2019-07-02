export const keyConfig = {
    dashboardName: 'title',
    filter: 'filterName',
    dateRanges: {
        key: 'dateList',
        defaultDate: 'default',
        listDates: 'list',
        isEnable: 'isDateRange',
        customRange: 'customRange'
    },
    secLvlTab: {
        key: 'report',
    },
    sortBy: {
        key: 'sortBy',
        defaultSort: 'default',
        sortList: 'list'
    },
    frstLvlTab: {
        key: 'content',
        isAll: 'all',
        all: {
            name: 'name',
            desc: 'description',
        },
        keys: 'field',
        url: 'url',
        name: 'name'
    },
    chartHeader: 'header',

    toggle: {
        key: 'slider',
        name: 'name',
        list: 'list'
    },
    secLevlKey: '@secLvlTabKey@',
    sortedOptionKey: '@sortedOption@',
    legendShowKey: 'show'
};

export const imageConfig = {
    leftArrow: './assets/icon/icon-left-arrow.svg',
    calenderIcon: './assets/icon/calendar.png',
    downloadIcon: './assets/icon/icon-print.png',
    appLogo: './assets/img/logo_iff_update.png'
};

export const Config = {
    limitToMore: 3,
    buttons: {
        'saveFilter': 'SAVE FILTERS',
        'applyFilter': 'APPLY PRESET FILTERS',
        'cancel': 'CANCEL',
        'setDate': 'SET DATE RANGE',
        'delete': 'DELETE',
        'load': 'LOAD',
    },
    dateLabel: 'Date Range',
    sortByLabel: 'Sort by',
    downloadLabel: ['Print/Save as PDF', 'Export to Excel'],
    searchPlaceholder: 'Search',
    filterPlaceholder: 'Type your custom filter',
    popUpPlaceholder: ['Start Date', 'End Date'],
    requiredLabel: ' * Required Field',
    dashboardName: {
        'scentPortfolioDashboard': 'Scent Portfolio Dashboard',
        'managementDashboard': 'Management Dashboard'
    },
    filters: ['scentPortfolioFilter', 'managementFilter'],
    CustomDateRangePopupHeader: 'Custom Date Range',
    moreTabWidth: 42,
    defaultTabWidth: 115,
    DATE_FORMAT: 'DD-MMM-YYYY',
    filterLabel: {
        presetFilterLabel: 'Preset Filters Title',
        searchTerm: 'Search Term(s)',
        filters : 'Filter(s)'
    }
};

export const HeaderDropdown = {
    Category:
    {
        "All": "All Categories",
        "FABRIC CARE": "Fabric Care",
        "FINE FRAGRANCE": "Fine Fragrance",
        "HAIR CARE": "Hair Care",
        "HOME CARE": "Home Care",
        "PERSONAL WASH": "Personal Wash",
        "TOILETRIES": "Toiletries",
    },

    Region:
    {
        "All": "All Regions",
        "REGIONASPAC": "ASPAC",
        "REGIONEAME": "EAME",
        "REGIONLATAM": "LATAM",
        "REGIONNA": "NOAM",
    },

    Account:
    {
        "All": "All Accounts",
        "BATH & BODYWORKS INC.": "BATH & BODYWORKS INC.",
        "WIPRO LTDCONSUMER": "WIPRO LTDCONSUMER",
        "INQUIBA SA.": "INQUIBA SA.",
        "ITC LIMITED": "ITC LIMITED",
        "LG HOUSEHOLD &HEALTH CARE LTD.": "LG HOUSEHOLD &HEALTH CARE LTD."
    }
}

