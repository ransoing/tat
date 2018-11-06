import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursLogComponent } from './hours-log.component';

describe('HoursLogComponent', () => {
  let component: HoursLogComponent;
  let fixture: ComponentFixture<HoursLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoursLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoursLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
