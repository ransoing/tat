import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PORPart3Page } from './por-part-3.page';

describe('PORPart3Page', () => {
  let component: PORPart3Page;
  let fixture: ComponentFixture<PORPart3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PORPart3Page],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PORPart3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
