import { TestBed } from '@angular/core/testing';

import { NgxShimmerService } from './ngx-shimmer.service';

describe('NgxShimmerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxShimmerService = TestBed.get(NgxShimmerService);
    expect(service).toBeTruthy();
  });
});
