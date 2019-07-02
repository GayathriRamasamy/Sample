export const managementFilterConfig = [{
  subTabs: ["Consideration", "Oppertunity", "Project", "Fragrance", "Time & Date"],
  consideration: {
    consideration: "Consideration" ,
    considerationDataPriorities: {
    "allPriorities": "All Priorities",
    "low": "Low",
    "medium": "Medium",
    "high": 'High',
    },
    costBookData : [
      { Id: 1046, Description: "Buenos Aires", code: "402", "sortOrder": 1 },
      { Id: 1056, Description: "Cairo", code: "402", "sortOrder": 2 },
      { Id: 1086, Description: "Isando", code: "402", "sortOrder": 3 },
      { Id: 1096, Description: "Jakarta", code: "402", "sortOrder": 4 },
      { Id: 1026, Description: "Jurong Fragrance", code: "402", "sortOrder": 5 }
           ],
    considerationDataWinning: {
          "allChanceOfWinning": "All Chance of Winning",
         "low" : "Low",
          "medium": "Medium",
          "high": "High"
    },
        differenciationData: {
            "allDefferenciation" : "All Differentiations",
            "cost": "Cost",
            "product": "Product",
            "service": "Service",
        },
        differenciationDataMultiSelect: {
          "differenciationStrategy" : "Differentiation Strategy Type"
        }
        ,
        brandData: {
          "brand" : "Brand",
          "subBrand": "Sub-Brand",
          "benchmark": "Benchmark",
        },
        creativeData:
         {
          "ceativeExcellence" : "Creative Excellence Model",
          "FFCreative": "FF Creative Segment",
          "FFMarket": "FF Market Segment",
         }
  },
  oppertunity: {
      oppertunityData:
        {
          "oppertunityNumber": "Oppertunity Number",
          "oppertunityTitle": "Oppertunity Title",
          "oppertunityOwener": "Oppertunity Owner",
          "oppertunityStatus": "Oppertunity Status",
        }
      ,
      customerData: {
          "customerCorporation" : "Customer Corporation",
          "soldTo": "Sold To",
          "customerContact": "Customer Contact",
          "consultant": "Consultant",
      },
      customerDataSegmant: {
            "customerSegmentation": "Customer Segmentation",
            "customerClassification": "Customer Classification",
            "category": "Category",
            "subCategory": 'Sub-Category'
    },
      oppertunityTypes: {
          "allOpportunityType": "All Opportunity Types",
          "customersolution": "Customer solutions",
          "gtmDefensive": "GTM Defensive",
          "gtmOffensive": "GTM Offensive",
          "gtmProactive": "GTM Proactive",
          "olfactivePlayground": "Olfactive Playground",
          "strategicInitiative": "Strategic Initiative",
          "valuecreation": "Value Creation"
      },
      projectType: "Project Type(s)",
      coreData: {
        "corelist": "Core List Only",
        "formalCust" : "Formal Cust. Brief Only"
      }
  },
  project: {
      projectData: {
          "projectVumber": "Project Number",
          "projectTilte": "Project Title",
          "projectOwner": "Project Owner",
          "projectManager": "Project Manager",
          "perfumer": "Perfumer",
          "projectStatus": "Project Status",
      },
      potentialData: {
        "potentialRegion": "Potential by Region"},
      serviceData: {
         "allService" : "All Service Levels",
          "library": "Library/Scent Portfolio",
          "standard": "Standard",
          "mustWin": "Must Win",
          "perfumer": "Perfumer",
          "mission": "Mission Critical",
    },
      serviceOverride: {
        "serviceOverride": "Service Level Override Only"
      },
      finalData:
          { "finalResults": "Final Results"}
      ,
      overDue: {
        "dayOverdue": "Days Overdue"},
      enduseData:
          {"enduse": "End Use",
          "competitors": "Competitors",
          "winningCompany": "Winning company"},
      impactData: {
        "impactYear" : "IFF Impact Year",
        "impactQuarter": "IFF Impact Quarter"
      } ,
      customerSegment: "Customer Segment",
      lvpData:
       {
        "lvpData": "LPV Only",
        "exclusiveOnly": "IFF Exclusive Only",
        "marginData": "Margin Adjustment Only"
       },
  },
  fragrance: {
      fragranceData: {
       "expNumData": "IPC|Exp.Number",
     "internalData": "Internal Name-Mod",
     "sellingData": "Selling ID | Name",
     "scentPortfolioData": "Scent Portfolio",
     "technology": "Technology",
     "subTechnology": "Sub-Technology",
      },
      prodata:
        {"value": "proData", "name": "Pro Rata Only"},
      creativeCenter: {
        "costBook": "Cost Book",
      "leadCreative": "Lead Creative Center" ,
      "otherCreative": "Other Creative Center"},
      customerData: {
        "consumerAgeGroup": "Consumer Age Group",
        "customerLaunchCountry": "Customer Launch Country(s)",
        "customerLaunchRegion": "Customer Launch Region(s)",
        "manufacturingCountry": "Customer Manufacturing Country(s)",
        "manufacturingRegion": "Customer Manufacturing Region(s)",
        "iffManufacturingCountry": "IFF Manufacturing Country(s)",
      },
      CustomerSegments: {
        "customerSegment": "Typology/Customer Segments",
        "customerBenifit": "Customer Benefit Platform(s) ",
        "creativeInnovation": "Creative Innovation",
        "perfumeryRequirements": "Perfumery Requirements",
      },
      technicalStudies:
        { "technicalStudies": "ST&I Technical Studies",
         "marketingServic": "Marketing Service"
        }
      },
      dateTime: {
      teams: {
        "allTeams": "All Teams",
        "commercial": "Commercial",
        "cl": "CI",
        "sdm": "SDM",
        "perfumer": "Perfumer",
        "marketing": "Marketing",
        "st": "ST&I",
        "sensory": "Sensory",
      },
      teamMember: {
        "teamMember": "Team Member"},
      startDate: {
        "startDate": "SI Start Date",
        "dueDate" : "SI Due Date"
      },
      dateData: {
        "internalDueDate": "Internal Due Date",
        "shipDate": "Ship Date Date " ,
        "customerDuedate": "Customer Due Date",
        "customerDecisiondate": "Customer Decision Date",
        "customerLaunchDate": "Customer Launch Date"
      }
    }
}
];







