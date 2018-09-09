import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTatComponent } from './about-tat.component';

describe('AboutTatComponent', () => {
  let component: AboutTatComponent;
  let fixture: ComponentFixture<AboutTatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutTatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutTatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
