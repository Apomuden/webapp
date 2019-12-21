import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReligionSetupComponent } from './religion-setup.component';

describe('ReligionSetupComponent', () => {
  let component: ReligionSetupComponent;
  let fixture: ComponentFixture<ReligionSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReligionSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReligionSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
