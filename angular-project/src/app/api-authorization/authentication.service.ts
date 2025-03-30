import { inject, Inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { RegistrationResponse, UserLogin, UserLoginResponse, UserRegistration, confirmEmail } from './user-registration';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './user-registration';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private httpClient = inject(HttpClient);
  private jwtHelper = inject(JwtHelperService);
  private userSource = new ReplaySubject<User | null>(1);
  user$ = this.userSource.asObservable();
  authenticated = signal(this.isAuthenticated());
  bsModalRef?: BsModalRef;
  displayingExpiringSessionModal = false;
  constructor(@Inject('BASE_URL') private baseUrl: string,


) {  }

  registerUser(userData: UserRegistration): Observable<RegistrationResponse> {
    return this.httpClient.post<RegistrationResponse>(this.baseUrl + '/user/register', userData);
  }

  loginUser(userData: UserLogin): Observable<UserLoginResponse> {
    return this.httpClient.post<UserLoginResponse>(this.baseUrl + '/user/login', userData);
  }

  logout() {
    localStorage.removeItem("token");
    this.authenticated.set(false);
  }

  storeToken(token: string) {
    localStorage.setItem("token", token);
    this.authenticated.set(true);
  }

  private isAuthenticated() {
    const token = localStorage.getItem("token");

    return token && !this.jwtHelper.isTokenExpired(token);
  }
  confirmEmail(model: confirmEmail){
    return this.httpClient.put(this.baseUrl + '/confirmEmail', model);
  }
  resendEmail(model: confirmEmail){
    return this.httpClient.post(this.baseUrl + '/resend-email-confirmation-link/' + model, model)
  }


  showNotification(isSuccess: boolean, title: string, message: string) {
    const initalState: ModalOptions = {
      initialState: {
        isSuccess,
        title,
        message
      }
    };

}
}