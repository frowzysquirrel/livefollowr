import { TestBed } from '@angular/core/testing';

import { LightswitchService } from './lightswitch.service';

describe('LightswitchService', () => {
  let service: LightswitchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LightswitchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
