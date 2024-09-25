import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRoute } from './group.component';

describe('GroupComponent', () => {
  let component: GroupRoute;
  let fixture: ComponentFixture<GroupRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupRoute]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
