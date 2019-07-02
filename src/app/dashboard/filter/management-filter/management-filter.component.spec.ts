import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementFilterComponent } from './management-filter.component';

describe('MdFilterComponent', () => {
  let component: ManagementFilterComponent;
  let fixture: ComponentFixture<ManagementFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
