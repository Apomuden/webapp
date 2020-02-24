import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WalkinRegistrationComponent} from './walkin-registration.component';

describe('WalkinRegistrationComponent', () => {
  let component: WalkinRegistrationComponent;
  let fixture: ComponentFixture<WalkinRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalkinRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkinRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
