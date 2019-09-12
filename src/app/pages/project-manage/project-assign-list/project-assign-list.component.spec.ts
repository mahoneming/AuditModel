import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAssignListComponent } from './project-assign-list.component';

describe('ProjectAssignListComponent', () => {
  let component: ProjectAssignListComponent;
  let fixture: ComponentFixture<ProjectAssignListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectAssignListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAssignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
