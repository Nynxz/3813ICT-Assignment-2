import { TestBed } from '@angular/core/testing';

import { PreferencesService } from './preferences.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('PreferencesService', () => {
  let service: PreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(), // Use this to provide HttpClientTesting
      ],
    });
    service = TestBed.inject(PreferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
