import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { POSPart1Page } from './pos-part-1.page';

describe('PreOutreachSurveyPage', () => {
  let component: POSPart1Page;
  let fixture: ComponentFixture<POSPart1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [POSPart1Page],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(POSPart1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
