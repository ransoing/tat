import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { POSPart6Page } from './pos-part-6.page';

describe('POSPart6Page', () => {
  let component: POSPart6Page;
  let fixture: ComponentFixture<POSPart6Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [POSPart6Page],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(POSPart6Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
