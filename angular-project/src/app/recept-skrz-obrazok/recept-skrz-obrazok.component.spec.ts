import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptSkrzObrazokComponent } from './recept-skrz-obrazok.component';

describe('ReceptSkrzObrazokComponent', () => {
  let component: ReceptSkrzObrazokComponent;
  let fixture: ComponentFixture<ReceptSkrzObrazokComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptSkrzObrazokComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptSkrzObrazokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
