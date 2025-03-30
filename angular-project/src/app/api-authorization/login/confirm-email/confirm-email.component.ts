import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { confirmEmail } from '../../user-registration'; // Ensure this is the correct import (type or class)
import { User } from '../../user-registration';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css'] // Fixed this from `styleUrl` to `styleUrls`
})
export class ConfirmEmailComponent implements OnInit {

  success = true;

  constructor(
    private accountService: AuthenticationService,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log("ngOnInit triggered");

    this.activatedRoute.queryParamMap.subscribe((params: any) => {
      const confirmEmailData: confirmEmail = {
        token: params.get('token'),
        email: params.get('email'),
      };

      console.log(confirmEmailData.token, confirmEmailData.email);

      this.accountService.confirmEmail(confirmEmailData).subscribe({
        next: (response: any) => {
          this.accountService.showNotification(true, response.value.title, response.value.message);
          this.success = true;
        },
        error: (error) => {
          this.success = false;
          this.accountService.showNotification(false, "Failed", error.error);
        }
      });
    });
  }

  resendEmailConfirmationLink() {
    this.router.navigateByUrl('/account/send-email/resend-email-confirmation-link');
  }
}