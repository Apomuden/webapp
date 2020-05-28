import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NhisProviderLevelsSetupComponent } from './nhis-provider-levels-setup.component';

describe('NhisProviderLevelsSetupComponent', () => {
  let component: NhisProviderLevelsSetupComponent;
  let fixture: ComponentFixture<NhisProviderLevelsSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NhisProviderLevelsSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NhisProviderLevelsSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
