
export const scentportfolioFilterConfig = [
    {
        clear: "Clear All",
        filter: "Filters",
        resetFilter: "Reset Filters",
        cancel: "Cancel",
        // hasCapsule: 'Has Capsule Technology',
        hasCapsuleData: [
            { Id: 1000, Description: "Has Capsule Technology", value: 'ENCAPSULATION', isChecked: false },
        ],

        applyFilter: "Apply Filters",
        fragrance: "Fragrance",
        costData: {
            "costBook": "CostBook",
            "mnc": "MNC",
            "csp": "CSP"
        },
        RangesValues: {
            mncRange: [0, 20],
            potentialRange: [0, 20]
        },
        ipcName: "IPC | Internal Name",
        costBookData: [
            { Id: 1046, Description: "Buenos Aires", code: "402", "sortOrder": 1 },
            { Id: 1056, Description: "Cairo", code: "402", "sortOrder": 2 },
            { Id: 1086, Description: "Isando", code: "402", "sortOrder": 3 },
            { Id: 1096, Description: "Jakarta", code: "402", "sortOrder": 4 },
            { Id: 1026, Description: "Jurong Fragrance", code: "402", "sortOrder": 5 }
        ],
        inspiration: "Inspiration",
        inspirationData: {
            "PHILOSOPHY": "Philosophy",
            "INSPIRATIONALBRAND": "CF Brand Inspiration",
            "INSPIRATIONALBRANDVARIANT": "CF Brand Variant Inspiration",
            "SUGGESTEDREGIONS": "Suggested Region(s)",
            "SUGGESTEDCOUNTRIES": "Suggested Country(s)"
        },
        philosophyData: [
            { Id: 1000, Description: "1 Million", code: "000001", "sortOrder": 1 },
            { Id: 1002, Description: "1000", code: "000002", "sortOrder": 2 },
            { Id: 1003, Description: "1881 black", code: "000003", "sortOrder": 3 },
            { Id: 1004, Description: "1881 for men", code: "000004", "sortOrder": 4 },
            { Id: 1005, Description: "1881 for women", code: "000005", "sortOrder": 5 }
        ],
        region: [
            { Id: 1046, Description: "Greater ASIA", Code: "ASFR", "sortOrder": 1 },
            { Id: 1056, Description: "Europe", Code: "AEBT", "sortOrder": 2 },
            { Id: 1386, Description: "Latam America", Code: "LATAM", "sortOrder": 3 },
            { Id: 1096, Description: "North America", Code: "NOAM", "sortOrder": 4 },
        ],
        countries: [
            { Id: 1046, Description: "Angola", Code: "GH", "sortOrder": 1 },
            { Id: 1156, Description: "Armenia", Code: "ER", "sortOrder": 2 },
            { Id: 1286, Description: "Australia", Code: "JK", "sortOrder": 3 },
            { Id: 1196, Description: "Austria", Code: "LO", "sortOrder": 4 },
            { Id: 1226, Description: "Bahamas", Code: "OP", "sortOrder": 5 }
        ],
        benifit: "Benefit Platform",
        benefitPlatformOptions: [
            { Id: 1000, Description: "Beauty", isChecked: false },
            { Id: 1001, Description: "Care", isChecked: false },
            { Id: 1002, Description: "Clean", isChecked: false },
            { Id: 1003, Description: "Experiential", isChecked: false },
            { Id: 1004, Description: "Fresh", isChecked: false }
        ],
        olfactive: "Olfactive Features",
        olfactiveData: {
            "olfactiveFamily": "Olfactive Family",
            "olfactiveSubFamily": "Olfactive Sub-Family",
            "keyword": "Keyword(s)",
            "descriptors": "Descriptor(s)"
        },
        olfactiveFamily: [
            { Id: 7142, olfactiveCategory: "Fabric Care", "sortOrder": 1 },
            { Id: 1567, olfactiveCategory: "Citrus", "sortOrder": 2 },
            { Id: 3603, olfactiveCategory: "Blend", "sortOrder": 3 },
            { Id: 8504, olfactiveCategory: "Floral", "sortOrder": 4 },
            { Id: 9005, olfactiveCategory: "Chypre", "sortOrder": 5 }
        ],
        olfactiveSubFamily: [
            { Id: 7142, olfactiveCategory: "Fabric Care", "sortOrder": 1 },
            { Id: 1567, olfactiveCategory: "Citrus", "sortOrder": 2 },
            { Id: 3603, olfactiveCategory: "Blend", "sortOrder": 3 },
            { Id: 8504, olfactiveCategory: "Floral", "sortOrder": 4 },
            { Id: 9005, olfactiveCategory: "Chypre", "sortOrder": 5 }
        ],
        Keyword: [
            { Id: 1000, Description: "Aromatherapy", code: "676", "sortOrder": 1 },
            { Id: 1002, Description: "Best beauty care", code: "465", "sortOrder": 2 },
            { Id: 1003, Description: "Biodegradeble", code: "378", "sortOrder": 3 },
            { Id: 1004, Description: "cradle", code: "234", "sortOrder": 4 },
            { Id: 1005, Description: "CSR", code: "123", "sortOrder": 5 }
        ],
        contribution: "Contribution",
        contributionData: {
            "leadCreative": "Lead Creative Center",
            "otherCreative": "Other Creative Center",
            "perfumer": "Perfumer",
            "sdm": "SDM",
        },
        leadCreative: [
            { userId: "fgf001", DisplayName: "Aldo " },
            { userId: "gfh002", DisplayName: "Tony" },
            { userId: "ccc003", DisplayName: "Brian" },
            { userId: "aaa008", DisplayName: "Adell" },
            { userId: "bbb004", DisplayName: "Bernard" },
        ],
        creative: [
            { userId: "fgf001", DisplayName: "Aldo " },
            { userId: "gfh002", DisplayName: "Tony" },
            { userId: "ccc003", DisplayName: "Brian" },
            { userId: "aaa008", DisplayName: "Adell" },
            { userId: "bbb004", DisplayName: "Bernard" },
        ],
        perfumer: [
            { userId: "fgf001", DisplayName: "Aldo " },
            { userId: "gfh002", DisplayName: "Tony" },
            { userId: "ccc003", DisplayName: "Brian" },
            { userId: "aaa008", DisplayName: "Adell" },
            { userId: "bbb004", DisplayName: "Bernard" },
        ],
        sdm: [
            { userId: "fgf001", DisplayName: "Aldo Kranenbarg" },
            { userId: "gfh002", DisplayName: "Tony studer" },
            { userId: "ccc003", DisplayName: "Brian Campbell" },
            { userId: "aaa008", DisplayName: "Adell" },
            { userId: "bbb004", DisplayName: "Bernard" },
        ],
        category: "Category",
        categoryData: [
            { Id: 1001, Description: "Fabric Care", isChecked: false },
            { Id: 1002, Description: "Fine Fragrance", isChecked: false },
            { Id: 1003, Description: "Home Care", isChecked: false },
            { Id: 1004, Description: "Personal Wash", isChecked: false },
            { Id: 1004, Description: "Toiletries", isChecked: false }
        ],
        subcategory: "Sub-Category",
        endUse: "End Use | Product",
        endUseData: {
            "endUse": "End Use",
            "productNumber": "Product Number | Type",
            "sales": "Sales"
        },
        endUses: [
            { Id: 1000, Description: "Aromatherapy", code: "676", "sortOrder": 1 },
            { Id: 1002, Description: "Best beauty care", code: "465", "sortOrder": 2 },
            { Id: 1003, Description: "Biodegradeble", code: "378", "sortOrder": 3 },
            { Id: 1004, Description: "cradle", code: "234", "sortOrder": 4 },
            { Id: 1005, Description: "CSR", code: "123", "sortOrder": 5 }
        ],
        productType: [
            { Id: 1000, Description: "Product type 1", code: "676", "sortOrder": 1 },
            { Id: 1002, Description: "Product type 2", code: "465", "sortOrder": 2 },
            { Id: 1003, Description: "Product type 3", code: "378", "sortOrder": 3 },
            { Id: 1004, Description: "Product type 4", code: "234", "sortOrder": 4 },
            { Id: 1005, Description: "Product type 5", code: "123", "sortOrder": 5 }
        ],
        sales: [
            { Id: 1001, Description: "Last 12 Months", isChecked: false, value: 'LAST12MONTHS' },
            { Id: 1002, Description: "Last 24 Months", isChecked: false, value: 'LAST24MONTHS' },
            { Id: 1203, Description: "Has Not Sold", isChecked: false, value: 'HASNOTSOLD'}
        ],
        exclusivity: "Exclusivity | Use",
        exclusiveData: {
            "exclusive": "Exclusive",
            "nonExclusive": "Non Exclusive",
            "temproryExclusive": "Temporary Exclusive",
            "doNotUse": "Do Not Use",
            "noNewUse": "No New Use"
        },
        exclusivityOptions: [
            { Id: 1000, Description: "Exclusive", isChecked: false, value: 'EXCLUSIVITY' },
            { Id: 1001, Description: "Non Exclusive", isChecked: false, value: 'NONEXCLUSIVITY' },
            { Id: 1002, Description: "Temporary Exclusive", isChecked: false, value: 'TEMPORARYEXCLUSIVITY' }
        ],
        showOptions: [
            { Id: 2000, Description: "Show Do Not Use", isChecked: false, value: 'doNotUse' },
            { Id: 2001, Description: "Show No New Use", isChecked: false, value: 'noNewUse' }
        ],
        testResults: "Test Results",
        testResultsOptions: [
            { Id: 1000, Description: "Best Tester", isChecked: false, value: "BESTTESTER" },
            { Id: 1001, Description: "CI Testing", isChecked: false, value: "CI" },
            { Id: 1002, Description: "Sensory Test", isChecked: false, value: "SENSORY" }
        ],
        testDataMultiSelect: {
            "testRegion": "Test Regions",
            "testCountries": "Test Countries"
        },
        opportunity: "Opportunity|Project",
        opportunityData: {
            "opportunityOwner": "Opportunity Owner",
            "customer": "Customer",
            "projectOwner": "Project Owner",
            "projectManager": "Project Manager",
            "projectStatus": "Project Status",
            "finalResults": "Final Results",
            "FfCreativeSegment": "FF creative Segment",
            "FfmarketSegment": "FF Market segment",
            "projectPotential": "Project"
        },
    }
];

export  const SCENTPORTFOLIO_FILTER_MAPPING_CONFIG = {
    "Sales": 'SALES',
    "Category": 'CATEGORY',
    "Olfactive Family": 'OLFACTIVEFAMILYDESC',
    "Olfactive SubFamily": 'OLFACTIVESUBFAMILYDESC',
    "Keyword": 'KEYWORDSDESC',
    "Descriptors": 'DESCRIPTOR',
    "Lead Creative": 'LEADCREATIVECENTERDESC',
    "Other Creative": 'OTHERCREATIVECENTERDESC',
    "Perfumer": 'PERFUMER',
    "SDM": 'SDM',
    "SubCategory": 'SUBCATEGORY',
    "EndUse": 'ENDUSE',
    "Product Numbers": 'PRODUCTTYPDESC',
    "Exclusivity": 'EXCLUSIVITY',
    "Test Result": 'TESTRESULTSOPTIONS',
    "Test Region": 'TESTREGIONS',
    "Test Countries": 'TESTCOUNTRIES',
    "Opportunity Owners": 'OPPORTUNITYOWNERS',
    "Project Owner": 'PROJECTOWNERNAME',
    "Project Manager": 'PROJECTMANAGERNAME',
    "Project Status": 'PROJECTSTATUS',
    "Final Results": 'FINALRESULTS',
    "Creative Segments": 'CREATIVESEGMENTS',
    "Market Segments": 'MARKETSEGMENTS',
    "POTENTIAL": 'TOTALPOTENTIALVALUE',
   // "Benefit": 'TOTALPOTENTIALVALUE',
};


