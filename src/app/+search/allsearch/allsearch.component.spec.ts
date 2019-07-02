import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllsearchComponent } from './allsearch.component';

describe('AllsearchComponent', () => {
  let component: AllsearchComponent;
  let fixture: ComponentFixture<AllsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
