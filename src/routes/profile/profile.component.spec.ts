import { ComponentFixture, TestBed } from '@angular/core/testing';

import {ProfileRoute } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileRoute;
  let fixture: ComponentFixture<ProfileRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileRoute]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
