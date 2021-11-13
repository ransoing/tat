import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedFlagsSexMoversComponent } from './red-flags-sex-movers.component';

describe('RedFlagsSexMoversComponent', () => {
  let component: RedFlagsSexMoversComponent;
  let fixture: ComponentFixture<RedFlagsSexMoversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedFlagsSexMoversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedFlagsSexMoversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
