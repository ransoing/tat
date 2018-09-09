import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudyBComponent } from './case-study-b.component';

describe('CaseStudyBComponent', () => {
  let component: CaseStudyBComponent;
  let fixture: ComponentFixture<CaseStudyBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseStudyBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseStudyBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
