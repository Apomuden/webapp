import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdTypeSetupComponent } from './id-type-setup.component';

describe('IdTypeSetupComponent', () => {
  let component: IdTypeSetupComponent;
  let fixture: ComponentFixture<IdTypeSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdTypeSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdTypeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
