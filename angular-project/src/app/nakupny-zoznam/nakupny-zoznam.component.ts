import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/services/user.service';
import { Subject, take, takeUntil } from 'rxjs';
import { NakupnyZoznam } from '../DTOs/NakupnyZoznamDTO';

@Component({
  selector: 'app-nakupny-zoznam',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './nakupny-zoznam.component.html',
  styleUrl: './nakupny-zoznam.component.css'
})
export class NakupnyZoznamComponent {
  ingrediencie = signal<NakupnyZoznam[]>([]);
  nIngrediencie: string[] = [];
  
  userService = inject(UserService);
  addIngr = new FormControl('');
  private destroy$ = new Subject<void>();
  pIsChecked = new FormControl(null)
  
  ngOnInit(){
    this.userService.getList()
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => this.ingrediencie.set(result));
  }

  addIngredient(){
    this.nIngrediencie.push(this.addIngr.value)
    this.userService.pridatDoNakupnehoZoznamu({
      name: this.addIngr.value,
      isChecked: this.pIsChecked.value,
    }).pipe(takeUntil(this.destroy$))
    .subscribe(result => this.ingrediencie.update(x => [...x, result]))
    this.addIngr.reset;
    

  }

  checkOwned(id: number){
    this.userService.checkOwned(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe();
  }

}
