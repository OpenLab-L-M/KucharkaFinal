import { Component, inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { equalValuesValidator, passwordStrengthValidator } from '../password-validators';
import { Router } from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';



@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatIconButton,
    MatButton,
    MatHint,
    MatSnackBarModule

    
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit {
  
  authService = inject(AuthenticationService);
  private router = inject(Router);
  constructor(private snackBar: MatSnackBar ){}

  registerForm: FormGroup;

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', passwordStrengthValidator()),
      confirmPassword: new FormControl('', equalValuesValidator('password')),
      profileName: new FormControl('', Validators.required) 
    });
  }

  register() {
    if(this.registerForm.valid) {
      this.authService.registerUser({...this.registerForm.value}).subscribe({
        next: () => {
          console.log('Registration successful!');
          let snackBarRef = this.snackBar.open('Poslali sme vám mail, prosím overte svoj účet', 'Undo', {
            duration: 5000
          });
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => console.log('Oops, something went wrong!', err)
      });
    }
  }

}
