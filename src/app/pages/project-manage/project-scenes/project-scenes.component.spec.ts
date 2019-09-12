import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectScenesComponent } from './project-scenes.component';

describe('ProjectScenesComponent', () => {
  let component: ProjectScenesComponent;
  let fixture: ComponentFixture<ProjectScenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectScenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectScenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
