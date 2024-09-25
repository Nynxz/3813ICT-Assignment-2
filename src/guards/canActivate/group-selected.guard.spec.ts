import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { groupSelectedGuard } from './group-selected.guard';

describe('groupSelectedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => groupSelectedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
