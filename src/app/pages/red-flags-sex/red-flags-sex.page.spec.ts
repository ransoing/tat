import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedFlagsSexPage } from './red-flags-sex.page';

describe('RedFlagsSexPage', () => {
  let component: RedFlagsSexPage;
  let fixture: ComponentFixture<RedFlagsSexPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedFlagsSexPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedFlagsSexPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
