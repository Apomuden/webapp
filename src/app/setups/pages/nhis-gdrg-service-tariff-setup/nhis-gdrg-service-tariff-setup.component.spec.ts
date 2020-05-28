import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NhisGdrgServiceTariffSetupComponent } from './nhis-gdrg-service-tariff-setup.component';

describe('NhisGdrgServiceTariffSetupComponent', () => {
  let component: NhisGdrgServiceTariffSetupComponent;
  let fixture: ComponentFixture<NhisGdrgServiceTariffSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NhisGdrgServiceTariffSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NhisGdrgServiceTariffSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
