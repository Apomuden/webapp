import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabCoreComponent } from './lab-core.component';

describe('LabCoreComponent', () => {
  let component: LabCoreComponent;
  let fixture: ComponentFixture<LabCoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabCoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
