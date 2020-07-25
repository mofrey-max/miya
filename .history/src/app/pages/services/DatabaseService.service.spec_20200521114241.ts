import { TestBed } from '@angular/core/testing';

import { DatabaseServiceService } from './DatabaseService.service';

describe('DatabaseServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatabaseServiceService = TestBed.get(DatabaseServiceService);
    expect(service).toBeTruthy();
  });
});
