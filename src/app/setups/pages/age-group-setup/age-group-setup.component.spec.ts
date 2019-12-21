import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeGroupSetupComponent } from './age-group-setup.component';

describe('AgeGroupSetupComponent', () => {
  let component: AgeGroupSetupComponent;
  let fixture: ComponentFixture<AgeGroupSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgeGroupSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeGroupSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
