import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IllnessTypeComponent } from './illness-type.component';

describe('IllnessTypeComponent', () => {
  let component: IllnessTypeComponent;
  let fixture: ComponentFixture<IllnessTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IllnessTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IllnessTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
