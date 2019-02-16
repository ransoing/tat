import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingVideoComponent } from './training-video.component';

describe('TrainingVideoComponent', () => {
  let component: TrainingVideoComponent;
  let fixture: ComponentFixture<TrainingVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
