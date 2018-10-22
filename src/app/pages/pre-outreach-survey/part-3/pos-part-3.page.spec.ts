import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { POSPart3Page } from './pos-part-3.page';

describe('POSPart3Page', () => {
  let component: POSPart3Page;
  let fixture: ComponentFixture<POSPart3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [POSPart3Page],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(POSPart3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
