import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostOutreachSelectionComponent } from './post-outreach-selection.component';

describe('PostOutreachSelectionComponent', () => {
  let component: PostOutreachSelectionComponent;
  let fixture: ComponentFixture<PostOutreachSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostOutreachSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostOutreachSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
