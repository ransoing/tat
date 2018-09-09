import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatToReportComponent } from './what-to-report.component';

describe('WhatToReportComponent', () => {
  let component: WhatToReportComponent;
  let fixture: ComponentFixture<WhatToReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatToReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatToReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
