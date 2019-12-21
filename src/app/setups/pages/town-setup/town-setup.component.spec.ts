import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TownSetupComponent } from './town-setup.component';

describe('TownSetupComponent', () => {
  let component: TownSetupComponent;
  let fixture: ComponentFixture<TownSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TownSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TownSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
