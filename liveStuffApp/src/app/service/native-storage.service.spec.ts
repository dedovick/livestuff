import { TestBed } from '@angular/core/testing';

import { NativeStorageService } from './native-storage.service';

describe('NativeStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NativeStorageService = TestBed.get(NativeStorageService);
    expect(service).toBeTruthy();
  });
});
