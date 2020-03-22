import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainTypeComponent } from './complain-type.component';

describe('ComplainTypeComponent', () => {
  let component: ComplainTypeComponent;
  let fixture: ComponentFixture<ComplainTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplainTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
