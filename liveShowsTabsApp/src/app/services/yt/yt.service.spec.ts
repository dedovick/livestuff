import { TestBed } from '@angular/core/testing';

import { YtService } from './yt.service';

describe('YtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YtService = TestBed.get(YtService);
    expect(service).toBeTruthy();
  });
});
