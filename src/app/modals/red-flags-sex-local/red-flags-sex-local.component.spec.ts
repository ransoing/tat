import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedFlagsSexLocalComponent } from './red-flags-sex-local.component';

describe('RedFlagsSexLocalComponent', () => {
  let component: RedFlagsSexLocalComponent;
  let fixture: ComponentFixture<RedFlagsSexLocalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedFlagsSexLocalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedFlagsSexLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
