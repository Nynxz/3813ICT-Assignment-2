import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRoute } from './login.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginRoute;
  let fixture: ComponentFixture<LoginRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginRoute],
      providers: [
        provideHttpClientTesting(), // Use this to provide HttpClientTesting
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
