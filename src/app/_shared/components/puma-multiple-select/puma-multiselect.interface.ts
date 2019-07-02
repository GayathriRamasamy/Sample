export interface DropdownSettings {
    singleSelection: boolean;
    text: string;
    showCheckAll: boolean;
    selectAllText: string;
    unSelectAllText: string;
    showSearchFilter: boolean;
    maxHeight: number;
    badgeShowLimit: number;
    classes: string;
    limitSelection?: number;
    disabled?: boolean;
    searchPlaceholderText: string;
    groupBy?: string;
    showCheckbox?: boolean;
    noDataLabel: string;
    searchAutofocus?: boolean;
    lazyLoading?: boolean;
}
