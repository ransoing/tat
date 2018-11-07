import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursLogFormComponent } from './hours-log-form.component';

describe('HoursLogFormComponent', () => {
  let component: HoursLogFormComponent;
  let fixture: ComponentFixture<HoursLogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoursLogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoursLogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
