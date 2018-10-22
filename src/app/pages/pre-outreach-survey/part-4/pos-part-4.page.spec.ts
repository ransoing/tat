import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { POSPart4Page } from './pos-part-4.page';

describe('POSPart4Page', () => {
  let component: POSPart4Page;
  let fixture: ComponentFixture<POSPart4Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [POSPart4Page],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(POSPart4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
