import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionSetupComponent } from './profession-setup.component';

describe('ProfessionSetupComponent', () => {
  let component: ProfessionSetupComponent;
  let fixture: ComponentFixture<ProfessionSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfessionSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
