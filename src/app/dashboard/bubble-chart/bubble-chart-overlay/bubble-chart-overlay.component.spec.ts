import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleChartOverlayComponent } from './bubble-chart-overlay.component';

describe('BubbleChartOverlayComponent', () => {
  let component: BubbleChartOverlayComponent;
  let fixture: ComponentFixture<BubbleChartOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubbleChartOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleChartOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
