import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionManageComponent } from './region-manage.component';

describe('RegionManageComponent', () => {
  let component: RegionManageComponent;
  let fixture: ComponentFixture<RegionManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
