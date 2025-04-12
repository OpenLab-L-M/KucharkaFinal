import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorCComponent } from './paginator-c.component';

describe('PaginatorCComponent', () => {
  let component: PaginatorCComponent;
  let fixture: ComponentFixture<PaginatorCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatorCComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginatorCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
