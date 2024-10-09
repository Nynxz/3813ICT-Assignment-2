import { TestBed } from '@angular/core/testing';

import { ChatService } from './chat.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(), // Use this to provide HttpClientTesting
      ],
    });
    service = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
