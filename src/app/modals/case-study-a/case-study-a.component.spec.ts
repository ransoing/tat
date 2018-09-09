import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudyAComponent } from './case-study-a.component';

describe('CaseStudyAComponent', () => {
  let component: CaseStudyAComponent;
  let fixture: ComponentFixture<CaseStudyAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseStudyAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseStudyAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
