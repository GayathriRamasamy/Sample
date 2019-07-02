export interface IBubbleChart {
    getBubbleChartData(
        firstLevelTab: string, 
        secondLevelTab: string,
        dateRange: string, 
        type: string, 
        tabToggle: string[], 
        yoyCondition: boolean,
        headerToggle: string, 
        dropDownOption: string,
        headerFilter: object,
        startDate: string,
        endDate: string,
        filter: object,
        permission: boolean
    );
}

