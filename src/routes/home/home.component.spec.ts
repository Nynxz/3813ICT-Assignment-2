import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRoute } from './home.component';

describe('HomeComponent', () => {
  let component: HomeRoute;
  let fixture: ComponentFixture<HomeRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeRoute]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
