import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAdminPanelComponent } from './group-admin-panel.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('GroupAdminPanelComponent', () => {
  let component: GroupAdminPanelComponent;
  let fixture: ComponentFixture<GroupAdminPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupAdminPanelComponent],
      providers: [provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupAdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
