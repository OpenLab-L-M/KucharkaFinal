export interface UserRegistration {
  email: string,
  password: string,
  profileName: string,
  confirmPassword: string
}

export interface RegistrationResponse {
  isSuccessfulRegistration: boolean;
  errors: string[];
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  isAuthSuccessful: boolean;
  errorMessage: string;
  token: string;
}
export interface confirmEmail{
  token:string;
  email:string;
}
export interface User {
  firstName: string;
  lastName: string;
  jwt: string;
}