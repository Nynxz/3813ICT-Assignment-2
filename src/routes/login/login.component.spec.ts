import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRoute } from './login.component';

describe('LoginComponent', () => {
  let component: LoginRoute;
  let fixture: ComponentFixture<LoginRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginRoute]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
