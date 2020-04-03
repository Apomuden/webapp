import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MohghsgroupingsComponent } from './mohghsgroupings.component';

describe('MohghsgroupingsComponent', () => {
  let component: MohghsgroupingsComponent;
  let fixture: ComponentFixture<MohghsgroupingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MohghsgroupingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MohghsgroupingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
