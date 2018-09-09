import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudyCComponent } from './case-study-c.component';

describe('CaseStudyCComponent', () => {
  let component: CaseStudyCComponent;
  let fixture: ComponentFixture<CaseStudyCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseStudyCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseStudyCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
