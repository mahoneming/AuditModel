import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignManageComponent } from './assign-manage.component';

describe('AssignManageComponent', () => {
  let component: AssignManageComponent;
  let fixture: ComponentFixture<AssignManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
