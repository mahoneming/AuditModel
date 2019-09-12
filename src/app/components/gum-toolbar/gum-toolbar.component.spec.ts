import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GumToolbarComponent } from './gum-toolbar.component';

describe('GumToolbarComponent', () => {
  let component: GumToolbarComponent;
  let fixture: ComponentFixture<GumToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GumToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GumToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
