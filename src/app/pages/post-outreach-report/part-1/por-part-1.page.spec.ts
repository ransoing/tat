import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PORPart1Page } from './por-part-1.page';

describe('PreOutreachSurveyPage', () => {
  let component: PORPart1Page;
  let fixture: ComponentFixture<PORPart1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PORPart1Page],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PORPart1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
