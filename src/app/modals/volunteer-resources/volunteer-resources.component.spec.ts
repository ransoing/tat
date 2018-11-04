import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerResourcesComponent } from './volunteer-resources.component';

describe('VolunteerResourcesComponent', () => {
  let component: VolunteerResourcesComponent;
  let fixture: ComponentFixture<VolunteerResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolunteerResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolunteerResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
