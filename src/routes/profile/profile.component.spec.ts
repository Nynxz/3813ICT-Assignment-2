import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRoute } from './profile.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProfileComponent', () => {
  let component: ProfileRoute;
  let fixture: ComponentFixture<ProfileRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileRoute],
      providers: [
        provideHttpClientTesting(), // Use this to provide HttpClientTesting
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
