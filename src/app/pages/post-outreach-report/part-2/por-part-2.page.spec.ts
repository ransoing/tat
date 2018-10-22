import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PORPart2Page } from './por-part-2.page';

describe('PORPart2Page', () => {
  let component: PORPart2Page;
  let fixture: ComponentFixture<PORPart2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PORPart2Page],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PORPart2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
