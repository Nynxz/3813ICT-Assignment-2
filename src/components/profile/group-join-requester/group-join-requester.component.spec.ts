import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupJoinRequesterComponent } from './group-join-requester.component';

describe('GroupJoinRequesterComponent', () => {
  let component: GroupJoinRequesterComponent;
  let fixture: ComponentFixture<GroupJoinRequesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupJoinRequesterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupJoinRequesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
