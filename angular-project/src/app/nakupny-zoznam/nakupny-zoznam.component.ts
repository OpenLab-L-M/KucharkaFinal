import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/services/user.service';
import { Subject, take, takeUntil } from 'rxjs';
import { NakupnyZoznam } from '../DTOs/NakupnyZoznamDTO';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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
  route = inject(ActivatedRoute)
  userService = inject(UserService);
  addIngr = new FormControl('');
  private destroy$ = new Subject<void>();
  pIsChecked = new FormControl(null)
  
  ngOnInit(){
    const day = this.route.snapshot.paramMap.get('name');
    console.log(day);
    this.userService.getList(day)
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => this.ingrediencie.set(result));
  }
  day: string = "";
  addIngredient(){
    this.day = this.route.snapshot.paramMap.get('name');
    this.nIngrediencie.push(this.addIngr.value)
    this.userService.pridatDoNakupnehoZoznamu({
      name: this.addIngr.value,
      isChecked: this.pIsChecked.value,
      day: this.day
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
