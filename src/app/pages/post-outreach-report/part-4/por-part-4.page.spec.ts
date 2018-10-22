import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PORPart4Page } from './por-part-4.page';

describe('PORPart4Page', () => {
  let component: PORPart4Page;
  let fixture: ComponentFixture<PORPart4Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PORPart4Page],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PORPart4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
