import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAdminPanelComponent } from './group-admin-panel.component';

describe('GroupAdminPanelComponent', () => {
  let component: GroupAdminPanelComponent;
  let fixture: ComponentFixture<GroupAdminPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupAdminPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupAdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
