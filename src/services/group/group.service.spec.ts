import { TestBed } from '@angular/core/testing';

import { GroupService } from './group.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('GroupService', () => {
  let service: GroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(), // Use this to provide HttpClientTesting
      ],
    });
    service = TestBed.inject(GroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
