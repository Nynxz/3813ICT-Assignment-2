import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarServerWidgetComponent } from './sidebar-server-widget.component';

describe('SidebarServerWidgetComponent', () => {
  let component: SidebarServerWidgetComponent;
  let fixture: ComponentFixture<SidebarServerWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarServerWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarServerWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
