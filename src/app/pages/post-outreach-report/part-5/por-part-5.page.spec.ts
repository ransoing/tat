import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PORPart5Page } from './por-part-5.page';

describe('PORPart5Page', () => {
  let component: PORPart5Page;
  let fixture: ComponentFixture<PORPart5Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PORPart5Page],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PORPart5Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
