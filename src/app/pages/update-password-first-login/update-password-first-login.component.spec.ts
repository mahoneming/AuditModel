import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePasswordFirstLoginComponent } from './update-password-first-login.component';

describe('UpdatePasswordFirstLoginComponent', () => {
  let component: UpdatePasswordFirstLoginComponent;
  let fixture: ComponentFixture<UpdatePasswordFirstLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePasswordFirstLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePasswordFirstLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
