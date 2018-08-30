import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedFlagsPage } from './red-flags.page';

describe('RedFlagsPage', () => {
  let component: RedFlagsPage;
  let fixture: ComponentFixture<RedFlagsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedFlagsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedFlagsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
