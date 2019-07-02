

export class TabSettings {
    public frstLvlTabKey: string;
    public secLvlTabKey: string;
    public secLvlTabValue: string;
}

export class FilterSettings {
    public dateKey: string;
    public dateValue: string;
    public sortedOption: string;
    public startDate: string;
    public endDate: string;
}


export class ChartSettings {
    public headerToggle: string;
    public dropDown: string;
}

export class HeaderFilter {
    public region: string[];
    public category: string[];
    public account: string[];

}


export class PortfolioModal {
    public id: Number;
    public image: string;
    public portfolioDescription: string;
    public portfolioNumber: string;
}


export class DataFilterSettings {
    // public frstLvlTabKey: string;
    // public frstLvlTabValue: string;
    // public secLvlTabKey: string;
    // public secLvlTabValue: string;
    public dateKey: string;
    public dateValue: string;
    public sortedOption: string;
    public startDate: string;
    public endDate: string;
    // public toggles: string[];
    public headerFilter: {};
    public filters: {}
}

export class CategoryListSettings {
    public initialCategoryList: object;
    public selectedCategoryList: object;
}