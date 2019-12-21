import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccreditationSetupComponent } from './accreditation-setup.component';

describe('AccreditationSetupComponent', () => {
  let component: AccreditationSetupComponent;
  let fixture: ComponentFixture<AccreditationSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccreditationSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccreditationSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
