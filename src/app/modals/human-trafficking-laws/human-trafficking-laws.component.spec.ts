import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanTraffickingLawsComponent } from './human-trafficking-laws.component';

describe('HumanTraffickingLawsComponent', () => {
  let component: HumanTraffickingLawsComponent;
  let fixture: ComponentFixture<HumanTraffickingLawsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumanTraffickingLawsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanTraffickingLawsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
