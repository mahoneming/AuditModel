import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectReviewListComponent } from './project-review-list.component';

describe('ProjectReviewListComponent', () => {
  let component: ProjectReviewListComponent;
  let fixture: ComponentFixture<ProjectReviewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectReviewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectReviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
