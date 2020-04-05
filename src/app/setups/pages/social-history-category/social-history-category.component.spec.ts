import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialHistoryCategoryComponent } from './social-history-category.component';

describe('SocialHistoryCategoryComponent', () => {
  let component: SocialHistoryCategoryComponent;
  let fixture: ComponentFixture<SocialHistoryCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialHistoryCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialHistoryCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
