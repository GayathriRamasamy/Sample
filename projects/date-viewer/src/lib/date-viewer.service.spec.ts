import { TestBed } from '@angular/core/testing';

import { DateViewerService } from './date-viewer.service';

describe('DateViewerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DateViewerService = TestBed.get(DateViewerService);
    expect(service).toBeTruthy();
  });
});
