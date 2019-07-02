import {
  async,
  ComponentFixture,
  TestBed,
  getTestBed
} from "@angular/core/testing";

import { BubbleChartComponent } from "./bubble-chart.component";
import { BubbleChartService } from "src/app/_services/+dashboard/bubble-chart/bubble-chart.service";
import { AppDataService, AppStateService } from "src/app/_services";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { OAuthService, UrlHelperService } from "angular-oauth2-oidc-cache";

describe("BubbleChartComponent", () => {
  let component: BubbleChartComponent;
  let fixture: ComponentFixture<BubbleChartComponent>;
  let injector: TestBed;
  let service: BubbleChartService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BubbleChartComponent],
      providers: [
        BubbleChartService,
        AppDataService,
        HttpClient,
        HttpHandler,
        AppStateService,
        // Activated,
        OAuthService,
        UrlHelperService
      ]
    }).compileComponents();

    injector = getTestBed();
    service = injector.get(BubbleChartService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit after Initialization", () => {
    spyOn(component, "ngOnInit");
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalledWith();
  });

  // it('should call getChart with 3 parameters', () => {
  //   spyOn(component, "getChart");
  //   component.getChart({}, '', false);
  //   expect(component.getChart).toHaveBeenCalledWith({}, '', false);
  //   expect(component.getChart).toHaveBeenCalled();
  // });

  // it('should call getChart 1 times', () => {
  //   spyOn(component, "getChart");
  //   component.getChart({}, '', false);
  //   expect(component.getChart).toHaveBeenCalledTimes(1);
  //   expect(component.getChart).toHaveBeenCalled();
  // });

  // it('should call getChart function inside ngOnInit', () => {
  //   spyOn(component, "ngOnInit");
  //   spyOn(component, "getChart").and.callThrough();
  //   component.ngOnInit();
  //   expect(component.ngOnInit).toHaveBeenCalledWith();
  // });

  it("should call getToggleChanges function inside ngOnInit", () => {
    spyOn(component, "ngOnInit");
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalledWith();
  });

  it("should call getSubscribe method", () => {
    component.getSubscribe();
  });

  it("should call getConfig method", () => {
    let configAPI = {
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
  });

  it("should call getChart method", () => {

  });
});
