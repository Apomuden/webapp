import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsershipTypeSetupComponent } from './sponsership-type-setup.component';

describe('SponsershipTypeSetupComponent', () => {
  let component: SponsershipTypeSetupComponent;
  let fixture: ComponentFixture<SponsershipTypeSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsershipTypeSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsershipTypeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
