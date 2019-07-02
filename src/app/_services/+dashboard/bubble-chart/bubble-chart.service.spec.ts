import { OAuthService, UrlHelperService } from "angular-oauth2-oidc-cache";
import { TestBed, getTestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";

import { BubbleChartService } from "./bubble-chart.service";
import { AppStateService } from "../../app.state.service";
import { AppDataService } from "../../app.data.service";
import { Observable } from "rxjs";

fdescribe("BubbleChartService", () => {
  let injector: TestBed;
  let service: BubbleChartService;
  let httpTestingController: HttpTestingController;
  let appDataService: AppDataService;
  let dashboardName = 'scentPortfolioDashboard';
  let firstLevelTab = 'All';
  let secondLevelTab = 'product';
  let mockBubbleChartService = {
    getConfig: () => {}
  }
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BubbleChartService,
        AppStateService,
        AppDataService,
        OAuthService,
        UrlHelperService,
        { provide: service, useValue: mockBubbleChartService }
      ]
    });

    injector = getTestBed();
    service = injector.get(BubbleChartService);
    appDataService = injector.get(AppDataService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should work config API", () => {
    // mock config
    const mockConfigResponse = {
        "infoTip": "<tr><td><p class='bold'>Number of Fragrances</p></td><td><p class='bold align-right'>@totalIngredient@</p></td></tr><tr><td><p class='LINESOFFORMULA'>Average Number of lines in Formula</p></td><td><p  class='LINESOFFORMULA align-right'>@LINESOFFORMULA@</p></td></tr><tr ><td><p class='AVG_PATENTEDINGREDIENT'>Average Patented Ingredients</p></td><td><p class='AVG_PATENTEDINGREDIENT align-right'>@AVG_PATENTEDINGREDIENT@%</p></td></tr><tr><td><p  class='AVG_STRATEGICINGREDIENT'>Average Strategic Ingredients</p></td><td><p  class='AVG_STRATEGICINGREDIENT align-right'>@AVG_STRATEGICINGREDIENT@%</p></td></tr><tr ><td><p class='AVG_IFFINGREDNTS'>Average IFF Ingredients</p></td><td><p class='AVG_IFFINGREDNTS align-right'>@AVG_IFFINGREDNTS@%</p></td></tr><tr><td><p class='AVG_CATELOGINGREDIENTS'>Average Creative Catalog</p></td><td><p class='AVG_CATELOGINGREDIENTS align-right'>@AVG_CATELOGINGREDIENTS@%</p></td></tr>",
        "showInfoTip": true,
        "toolTip": {
          "header": {
            "line1": [
              "scentPortfolioNumber",
              "endUse"
            ],
            "line2": [
              "ipcNumber"
            ]
          },
          "body": [
            {
              "label": "",
              "indent": false,
              "indentLevel": 0,
              "format": "<span class='bold'>@potential@M</span><span> (USD) Potential</span>"
            },
            {
              "label": "",
              "indent": false,
              "indentLevel": 0,
              "format": "<span>@soldToName@</span>"
            },
            {
              "label": "",
              "indent": false,
              "indentLevel": 0,
              "format": "<span>@projectNumber@ | @projectTitle@</span>"
            },
            {
              "label": "",
              "indent": false,
              "indentLevel": 0,
              "format": "<span>@opportunityType@</span>"
            },
            {
              "label": "",
              "indent": false,
              "indentLevel": 0,
              "format": "<span>@projectType@</span>"
            },
            {
              "label": "",
              "indent": false,
              "indentLevel": 0,
              "format": "<span class='grey-font'>Owner: </span><span>@projectOwner@</span>"
            },
            {
              "label": "",
              "indent": false,
              "indentLevel": 0,
              "format": "<span class='grey-font'>PM: </span><span>@projectManager@</span>"
            },
            {
              "label": "",
              "indent": false,
              "indentLevel": 0,
              "format": "<span class='grey-font'>Perfumer(s): </span><span>@perfumer@</span>"
            }
          ]
        },
        "bubbleSizeName": "ingredient",
        "headerTab": {
          "VOLUME": "by Volume",
          "VALUE": "by Value"
        },
        "dropDown": {
          "AVG_PATENTEDINGREDIENT": "Patented Ingredients",
          "AVG_STRATEGICINGREDIENT": "Strategic Ingredients",
          "AVG_IFFINGREDNTS": "IFF Ingredients",
          "AVG_CATELOGINGREDIENTS": "Creative Catalog(%)",
          "LINESOFFORMULA": "Number of Lines in Formula"
        },
        "splitData": {
          "splitKey": "yearOnYear",
          "isSplit": false,
          "default": "ipc"
        },
        "header": {
          "group": "<h5 class='header-title'>Ingredients</h5><h5 class='header-title border-right'><span class='LINESOFFORMULA'>@LINESOFFORMULA@</span></h5><h5 class='header-title border-right'><span class='AVG_PATENTEDINGREDIENT'>@AVG_PATENTEDINGREDIENT@%</span></h5><h5\n class='header-title border-right'><span class='AVG_STRATEGICINGREDIENT'>@AVG_STRATEGICINGREDIENT@%</span></h5><h5 class='header-title border-right'><span class='AVG_IFFINGREDNTS'>@AVG_IFFINGREDNTS@%</span></h5><h5 class='header-title'><span class='AVG_CATELOGINGREDIENTS'>@AVG_CATELOGINGREDIENTS@%</span></h5>",
          "split": null
        },
        "legend": {
          "group": {
            "header": {
              "right": {
                "name": "<p class='legend color-grey'>@dateRange@</p>",
                "format": "<p class='legend dropDownOption'><b>@dropDownOption@%</b></p>"
              }
            },
            "legendFormat": "<p class='legend'><b>@ipcPercentage@%</b></p>"
          },
          "split": {
            "header": {
              "left": {
                "name": null,
                "format": null
              },
              "right": {
                "name": null,
                "format": "<p class='legend dropDownOption'><b>@dropDownOption@%</b></p>"
              }
            },
            "legendFormat": null
          }
        }
    };

    let configResponse;

     spyOn(service,'getConfig').and.returnValue(Observable.of(mockConfigResponse));

    // get config - service call
    service
      .getConfig(dashboardName, firstLevelTab, secondLevelTab)
      .subscribe(resposnse => {
          configResponse = resposnse;
      });

    // response checking with mock data
    expect(mockConfigResponse).toEqual(configResponse);  

    // request object
    const req = httpTestingController.expectOne(appDataService.url.serviceUrl + service.url.config + service.url.bubbleChart);

    // request type
    expect(req.request.method).toEqual("POST");

    // request url 
    expect(req.request.url).toEqual(appDataService.url.serviceUrl + service.url.config + service.url.bubbleChart);

    // request body
    expect(req.request.body).toEqual(
        {
            'dashboard': dashboardName,
            'content': firstLevelTab,
            'report': secondLevelTab
        }
    );
    // set mock data return by the above request
    req.flush(mockConfigResponse);
  });
});
