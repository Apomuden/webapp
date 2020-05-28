import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NhisMdcSetupComponent } from './nhis-mdc-setup.component';

describe('NhisMdcSetupComponent', () => {
  let component: NhisMdcSetupComponent;
  let fixture: ComponentFixture<NhisMdcSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NhisMdcSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NhisMdcSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
