import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipSetupComponent } from './relationship-setup.component';

describe('RelationshipSetupComponent', () => {
  let component: RelationshipSetupComponent;
  let fixture: ComponentFixture<RelationshipSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationshipSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
