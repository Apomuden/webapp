import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleTypeServiceMapComponent } from './sample-type-service-map.component';

describe('SampleTypeServiceMapComponent', () => {
  let component: SampleTypeServiceMapComponent;
  let fixture: ComponentFixture<SampleTypeServiceMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleTypeServiceMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleTypeServiceMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
