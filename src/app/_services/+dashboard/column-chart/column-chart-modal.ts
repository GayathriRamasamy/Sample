export interface IColumnChart {
    getChartData(
        firstLevelTab: string,
        innerTab: string, 
        tab: String, 
        yoy: boolean,
        sortBy: string, 
        filter: object, 
        startDate: string, 
        endDate: string, 
        dropdown: string, 
        headerToggle: string, 
        dateRange: string,
        headerFilter: object,
        permission: boolean
    );
}
