import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudyDComponent } from './case-study-d.component';

describe('CaseStudyDComponent', () => {
  let component: CaseStudyDComponent;
  let fixture: ComponentFixture<CaseStudyDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseStudyDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseStudyDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
