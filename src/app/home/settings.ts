export class Settings {
  public field: string;
  public displayName: string;
  public direction?: string;
  public isDefault?: boolean = false;
}

// tslint:disable-next-line:max-classes-per-file
export class HomeSortFieldSettings {

  public static SISortFields: Settings[] = [
    { field: 'Category', displayName: 'CATEGORY', direction: 'asc' }, // 0
    { field: 'DueDate', displayName: 'DUE DATE', direction: 'asc' }, // 1
    { field: 'InitiativeName', displayName: 'INITIATIVE NAME', direction: 'asc' }, // 2
    { field: 'Status', displayName: 'PHASE', direction: 'asc' }, // 3
    { field: 'Potential', displayName: 'POTENTIAL', direction: 'asc' }, // 4
    { field: 'ROI', displayName: 'ROI', direction: 'asc' }, // 5
    { field: 'Title', displayName: 'SI NUMBER', direction: 'asc' }, // 6
    { field: 'ProjectCount', displayName: 'SI PROJECTS', direction: 'asc' }, // 7
    { field: 'StatusReason', displayName: 'STATUS', direction: 'asc' }, // 8
  ];

  public static ProjectSortFields: Settings[] = [
    { field: 'CategoryName', displayName: 'CATEGORY', direction: 'asc' }, // 0
    { field: 'LeadCreativeCenter', displayName: 'CREATIVE CENTER', direction: 'asc' }, // 1
    { field: 'CustomerName', displayName: 'CUSTOMER NAME', direction: 'asc' }, //  2
    { field: 'CustDueDate', displayName: 'DUE DATE', direction: 'asc' }, // 3
    { field: 'EndUseName', displayName: 'END USE', direction: 'asc' }, // 4
    // { field: 'Updatedon', displayName: 'MODIFIED DATE', direction: 'acs' }, //
    { field: 'TotalPotential', displayName: 'POTENTIAL', direction: 'asc' }, // 5
    { field: 'ProjectManagerName', displayName: 'PROJECT MANAGER', direction: 'asc' }, // 6
    { field: 'ProjectTitle', displayName: 'PROJECT TITLE', direction: 'asc' }, // 7
    { field: 'ProjectNumber', displayName: 'PROJECT NUMBER', direction: 'asc' }, // 8
    { field: 'ProjectOwnerName', displayName: 'PROJECT OWNER', direction: 'asc' }, // 9
    { field: 'ProductTypeCode', displayName: 'PRODUCT TYPE', direction: 'asc' }, // 10
    { field: 'ServiceLevelName', displayName: 'SERVICE LEVEL', direction: 'asc' }, // 11
    { field: 'StatusName', displayName: 'STATUS', direction: 'asc' }, // 12
  ];

  public static OpportunitySortFields: Settings[] = [
    { field: 'Category', displayName: 'CATEGORY', direction: 'asc' }, // 0
    { field: 'CreatedOn', displayName: 'CREATED ON', direction: 'asc' }, // 1
    { field: 'CustomerName', displayName: 'CUSTOMER NAME', direction: 'asc' }, //  2
    { field: 'OpportunityName', displayName: 'OPPORTUNITY NAME', direction: 'asc' }, // 3
    { field: 'OpportunityNumber', displayName: 'OPPORTUNITY NUMBER', direction: 'asc' }, // 4
    { field: 'OpportunityOwner', displayName: 'OPPORTUNITY OWNER', direction: 'asc' }, // 5
    { field: 'OpportunityType', displayName: 'OPPORTUNITY TYPE', direction: 'asc' }, // 6
    { field: 'TotalPotential', displayName: 'POTENTIAL', direction: 'asc' }, // 7
    { field: 'Status', displayName: 'STATUS', direction: 'asc' }, // 8
  ];

  public static ProjectSearchSortFields: Settings[] = [

    { field: 'updatedon', displayName: 'Most Recent', direction: 'asc' },
    { field: 'category', displayName: 'Category', direction: 'asc' }, // 0
    { field: 'leadcreativecenter', displayName: 'Creative Center', direction: 'asc' }, // 1
    { field: 'duedate', displayName: 'Due Date (Internal)', direction: 'asc' }, // 2
    { field: 'enduse', displayName: 'End Use', direction: 'asc' }, // 3
    // { field: 'Updatedon', displayName: 'MODIFIED DATE', direction: 'acs' }, //
    { field: 'totalpotential', displayName: 'Potential', direction: 'asc' }, // 4
    { field: 'projectmanager', displayName: 'Project Manager', direction: 'asc' }, // 5
    { field: 'projecttitle', displayName: 'Project Title', direction: 'asc' }, // 6
    { field: 'projectnumber', displayName: 'Project Number', direction: 'asc' }, // 7
    { field: 'projectowner', displayName: 'Project Owner', direction: 'asc' }, // 8
    { field: 'producttype', displayName: 'Product Type', direction: 'asc' },
    { field: 'projecttypename', displayName: 'Project Type', direction: 'asc' }, // 9
    { field: 'servicelevel', displayName: 'Service Level', direction: 'asc' }, // 10
    { field: 'status', displayName: 'Status', direction: 'asc' }, // 11
    { field: 'Customer', displayName: 'Customer', direction: 'asc' }, // 12
    { field: 'CustomerName', displayName: 'CUSTOMER NAME', direction: 'asc' }, //  13

  ];

  public static SubmissionSearchSortFields: Settings[] = [
    // { field: 'updatedon', displayName: 'Most Recent', direction: 'asc' },
    { field: 'InternalName', displayName: 'Internal Name', direction: 'asc' },
    { field: 'Mod', displayName: 'Mod', direction: 'asc' },
    { field: 'IPCNumber', displayName: 'IPC', direction: 'asc' },
    { field: 'ExperimentNumber', displayName: 'Experiment Number', direction: 'asc' },
    { field: 'UseLevel', displayName: 'End Use', direction: 'asc' },
    { field: 'ProductNumber', displayName: 'Product Number', direction: 'asc' },
    { field: 'ProductType', displayName: 'Product Type', direction: 'asc' },
    { field: 'MNC', displayName: 'MNC', direction: 'asc' },
    { field: 'MNCDate', displayName: 'Date', direction: 'asc' },
    { field: 'CSP', displayName: 'CSP', direction: 'asc' },
    // { field: 'status', displayName: 'Status', direction: 'asc' },
  ];

  public static FragranceSearchSortFields: Settings[] = [
    { field: 'inspirationalbrandkeyword', displayName: 'CF Brand Inspiration', direction: 'asc' },
    { field: '', displayName: 'CSP (kg) - TBD', direction: 'asc' },
    { field: 'costbookcodekeyword', displayName: 'Costbook', direction: 'asc' },
    { field: 'descriptor1keyword', displayName: 'Descriptors', direction: 'asc' },
    { field: '', displayName: 'Flash Point - TBD', direction: 'asc' },
    { field: '', displayName: '# of Lines in IPC - TBD', direction: 'asc' },
    { field: 'ipcnumber', displayName: 'IPC Number', direction: 'asc' },
    { field: 'experimentnumberkeyword', displayName: 'Experimental Number', direction: 'asc' },
    { field: 'internalnamekeyword', displayName: 'Internal Name', direction: 'asc' },
    { field: 'modification', displayName: 'Modification', direction: 'asc' },
    { field: 'mnc', displayName: 'MNC (kg)', direction: 'asc' },
    { field: 'updatedon', displayName: 'Most Recent', direction: 'asc' },
    { field: '', displayName: 'Number of Projects - TBD', direction: 'asc' },
    { field: 'olfactivefamilykeyword', displayName: 'Olfactive Family', direction: 'asc' },
    { field: '', displayName: 'Perfumer - TBD', direction: 'asc' },
    { field: 'philosophy1keyword', displayName: 'Philosophy', direction: 'asc' },
    { field: 'originalproducttypekeyword', displayName: 'Product Type', direction: 'asc' },
    { field: '', displayName: 'Selling Name - TBD', direction: 'asc' },
    { field: '', displayName: 'Sold Last - TBD', direction: 'asc' },
    { field: '', displayName: 'Submission Status - TBD', direction: 'asc' },
  ];

  public static ScentPortfolioSearchSortFields: Settings[] = [
    { field: 'fragrances', displayName: '# of Fragrances', direction: 'asc' },
    { field: 'categorykeyword', displayName: 'Category', direction: 'asc' },
    { field: 'subcategorykeyword', displayName: 'Sub-Category', direction: 'asc' },
    { field: 'endusekeyword', displayName: 'End Use', direction: 'asc' },
    { field: 'maxmnc', displayName: 'Max MNC (kg)', direction: 'asc' },
    { field: 'updatedon', displayName: 'Most Recent', direction: 'asc' },
    { field: 'producttypekeyword', displayName: 'Product Type', direction: 'asc' },
    { field: 'region', displayName: 'Region', direction: 'asc' },
    { field: 'portfolioaccesstype', displayName: 'Restriction', direction: 'asc' },
    { field: 'portfoliodescriptionkeyword', displayName: 'Scent Portfolio Name', direction: 'asc' },
    { field: 'portfolionumber', displayName: 'Scent Portfolio ID', direction: 'asc' },
    { field: 'classification', displayName: 'Type', direction: 'asc' }
  ];
}

// tslint:disable-next-line:max-classes-per-file
export class GroupFiltersSettings {
  public static HomePageProjects = {
    searchFields: ['ProjectTitle', 'ProjectNumber', 'ProjectManagerName', 'TotalPotential',
      'LeadRegion', 'ServiceLevelName', 'EndUseName', 'ProductTypeCode', 'ProductTypeName', 'StatusName', 'CustomerName'],
    groupByFields: [
      { field: 'CategoryName', displayName: 'CATEGORY' }, // 0
      // { field: 'LeadRegion', displayName: 'REGION', direction: 'asc' }, // 1
      { field: 'LeadCreativeCenter', displayName: 'CREATIVE CENTER', direction: 'asc' }, // 1
      { field: 'CustomerName', displayName: 'CUSTOMER NAME', direction: 'asc' }, //2
      { field: 'ProjectTypeName', displayName: 'PROJECT TYPE'}, // 3
      { field: 'StatusName', displayName: 'STATUS', isDefault: true } // 4
    ]
  };
  public static HomePageOpportunities: {
    searchFields: ['OpportunityName', 'OpportunityNumber', 'OpportunityOwner', 'Category', 'Customer', 'OpportunityType', 'CreatedOn'],
    groupByFields: [
      { field: 'Category', displayName: 'CATEGORY' }, // 0
      { field: 'Customer', displayName: 'CUSTOMER' }, // 1
      { field: 'Status', displayName: 'STATUS', isDefault: true } // 2
    ]
  };
  public static HomePageSI: Settings[] = [
    { field: 'Category', displayName: 'CATEGORY' }, // 0
    { field: 'Status', displayName: 'PHASE' }, // 1
    { field: 'StatusReason', displayName: 'STATUS', isDefault: true }, // 2

  ];
}

export class ChangeLogSettings {
  public static changeLogSettings = {
    Project: 1003,
    ProjectSummary: 1005,
    CreativePlan: 1012,
    Lesson: 1015,
    Opportunity: 1016,
    StrategicInitiative: 1017,
    STI: 1052,
    Marketing: 1060,
    Commercial: 1066,
    CI: 1078,
    Sensory: 1085,
    Submission: 1096,
    Worklist: 1135,
    Task: 1159,
    ScentPortfolio: 1163
  };
  public static changeLogNewFilter = {
    Project: 'Project',
    Sensory: 'Sensory'
  };
  public static ProjectExcludeFields = ['Customer', 'ServiceLevel', 'ServiceLevelShortName',
    'Status', 'ProjectType', 'ProjectOwner', 'ProjectManager', 'CreativeCenter', 'Category',
    'SubCategory', 'EndUse', 'EndUseCode', 'ProductType', 'ProductTypeCode', 'Model', 'BaseType',
    'UseLevelUom', 'Source', 'SourceID', 'WinChance', 'WinchanceCode', 'WinningCompany', 'CreatedBy',
    'CreatedOn', 'UpdatedBy', 'UpdatedOn', 'ProjectCostBookCode', 'ProjectCostBook', 'CurrencyCode', 'ID',
    'SAPQuote', 'CreativeCenterCode', 'ProjectNumber', 'OriginalServiceLevel', 'CreativeCenterCode',
    'CommercialSource', 'PUMAPriority', 'PumaPriorityCode', 'DifferentiationStrategyId', 'DifferentiationStrategyTypeId',
    'WinningCompanyName', 'ConsultantName', 'BrandCode'];
  public static ScentPortfolioExcludeFields = [];

  public static ChangeLogSearchFields: Settings[] = [
    { field: 'changeon', displayName: 'Most Recent', direction: 'asc' },
    { field: 'changeby', displayName: 'Changed By', direction: 'asc' },
    { field: 'changetype', displayName: 'Activity', direction: 'asc' },
    { field: 'ChangeColumnLogicalName', displayName: 'Attribute', direction: 'asc' },
    { field: 'currentvalue', displayName: 'Current Value', direction: 'asc' },
    { field: 'previousvalue', displayName: 'Previous Value', direction: 'asc' }
  ];

  public static CurrencyFields = [
    'PotentialASPACValue', 'CustomerSellPrice', 'MNC', 'ProjectPotential', 'MaxMNC'
  ];

  public static DateFields = [
    "ValidFromDate"
  ];

  public static SeparatorFields = [
    'PotentialASPACValue', 'CustomerSellPrice', 'MNC', 'ProjectPotential', 'LinesofFormula', 'MaxMNC'
  ];

  public static PercentageFields = [
    "NaturalIngredientVol", "NaturalIngredientVal", "LMRIngredientVal", "StrategicIngredientVal", "PatentIngredientVal", "IngredientsVal",
    "LMRIngredientVol", "StrategicIngredientVol", "PatentIngredientVol", "IngredientsVol"
  ];
}
