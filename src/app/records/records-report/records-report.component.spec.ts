import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsReportComponent } from './records-report.component';

describe('RecordsReportComponent', () => {
  let component: RecordsReportComponent;
  let fixture: ComponentFixture<RecordsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
