import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpdFilterComponent } from './spd-filter.component';

describe('FilterComponent', () => {
  let component: SpdFilterComponent;
  let fixture: ComponentFixture<SpdFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpdFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpdFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
