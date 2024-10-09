import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRoute } from './home.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let component: HomeRoute;
  let fixture: ComponentFixture<HomeRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeRoute],
      providers: [
        provideHttpClientTesting(), // Use this to provide HttpClientTesting
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
