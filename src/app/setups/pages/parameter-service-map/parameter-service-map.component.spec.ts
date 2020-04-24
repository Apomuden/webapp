import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterServiceMapComponent } from './parameter-service-map.component';

describe('ParameterServiceMapComponent', () => {
  let component: ParameterServiceMapComponent;
  let fixture: ComponentFixture<ParameterServiceMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterServiceMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterServiceMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
