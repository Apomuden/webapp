import { TestBed } from '@angular/core/testing';

import { LaboratoryService } from './laboratory.service';

describe('LaboratoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LaboratoryService = TestBed.get(LaboratoryService);
    expect(service).toBeTruthy();
  });
});
