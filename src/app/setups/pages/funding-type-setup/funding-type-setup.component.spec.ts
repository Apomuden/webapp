import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingTypeSetupComponent } from './funding-type-setup.component';

describe('FundingTypeSetupComponent', () => {
  let component: FundingTypeSetupComponent;
  let fixture: ComponentFixture<FundingTypeSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundingTypeSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingTypeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
