import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HowPage } from './how.page';

describe('HowPage', () => {
  let component: HowPage;
  let fixture: ComponentFixture<HowPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
