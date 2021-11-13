import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedFlagsSexOtrComponent } from './red-flags-sex-otr.component';

describe('RedFlagsSexOtrComponent', () => {
  let component: RedFlagsSexOtrComponent;
  let fixture: ComponentFixture<RedFlagsSexOtrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedFlagsSexOtrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedFlagsSexOtrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
