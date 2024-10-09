import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(), // Use this to provide HttpClientTesting
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
