import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresetSearchComponent } from './preset-search.component';

describe('PresetSearchComponent', () => {
  let component: PresetSearchComponent;
  let fixture: ComponentFixture<PresetSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresetSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresetSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
