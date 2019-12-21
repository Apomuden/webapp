import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankBranchesSetupComponent } from './bank-branches-setup.component';

describe('BankBranchesSetupComponent', () => {
  let component: BankBranchesSetupComponent;
  let fixture: ComponentFixture<BankBranchesSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankBranchesSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankBranchesSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
