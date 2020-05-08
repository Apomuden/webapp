import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineRoutesComponent } from './medicine-routes.component';

describe('MedicineRoutesComponent', () => {
  let component: MedicineRoutesComponent;
  let fixture: ComponentFixture<MedicineRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicineRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
