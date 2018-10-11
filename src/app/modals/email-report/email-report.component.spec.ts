import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailReportComponent } from './email-report.component';

describe('WhatToReportComponent', () => {
  let component: EmailReportComponent;
  let fixture: ComponentFixture<EmailReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
