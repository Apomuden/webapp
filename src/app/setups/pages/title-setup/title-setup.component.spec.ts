import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleSetupComponent } from './title-setup.component';

describe('TitleSetupComponent', () => {
  let component: TitleSetupComponent;
  let fixture: ComponentFixture<TitleSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
