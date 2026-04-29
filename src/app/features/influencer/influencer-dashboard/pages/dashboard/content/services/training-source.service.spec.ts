import { TestBed } from '@angular/core/testing';

import { TrainingSourceService } from './training-source.service';

describe('TrainingSourceService', () => {
  let service: TrainingSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
