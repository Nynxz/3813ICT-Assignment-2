import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessagesenderComponent } from './chat-messagesender.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ChatMessagesenderComponent', () => {
  let component: ChatMessagesenderComponent;
  let fixture: ComponentFixture<ChatMessagesenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMessagesenderComponent],
      providers: [
        provideHttpClientTesting(), // Use this to provide HttpClientTesting
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatMessagesenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
