import { TestBed } from '@angular/core/testing';

import { LoadingControlleServiceService } from './loading-controlle-service.service';

describe('LoadingControlleServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadingControlleServiceService = TestBed.get(LoadingControlleServiceService);
    expect(service).toBeTruthy();
  });
});
