import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EisuComponent } from './eisu.component';

describe('EisuComponent', () => {
  let component: EisuComponent;
  let fixture: ComponentFixture<EisuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EisuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EisuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
