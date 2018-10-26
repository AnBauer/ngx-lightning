import { TestBed } from '@angular/core/testing';

import { NgLightningService } from './ng-lightning.service';

describe('NgLightningService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgLightningService = TestBed.get(NgLightningService);
    expect(service).toBeTruthy();
  });
});
