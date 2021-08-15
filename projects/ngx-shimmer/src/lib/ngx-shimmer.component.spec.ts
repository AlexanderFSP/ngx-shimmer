import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxShimmerComponent } from './ngx-shimmer.component';

describe('NgxShimmerComponent', () => {
  let component: NgxShimmerComponent;
  let fixture: ComponentFixture<NgxShimmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgxShimmerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
