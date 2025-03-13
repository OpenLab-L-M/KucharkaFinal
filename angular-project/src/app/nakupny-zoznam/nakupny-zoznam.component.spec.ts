import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NakupnyZoznamComponent } from './nakupny-zoznam.component';

describe('NakupnyZoznamComponent', () => {
  let component: NakupnyZoznamComponent;
  let fixture: ComponentFixture<NakupnyZoznamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NakupnyZoznamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NakupnyZoznamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
