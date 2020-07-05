import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators'
import { throwError, Subject } from 'rxjs'
import * as data from '../shared/credentials.json'
import { User } from './user.model';

export interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  userSubject = new Subject<User>();

  // =====================================================================

  constructor(private http: HttpClient) { }

  // =====================================================================

  signup(email: string, password: string) {
    let secret = data.apiKey;
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + secret,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleErrorResponse),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
      }));
  }

  login(email: string, password: string) {
    let secret = data.apiKey
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + secret,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError(this.handleErrorResponse),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
      })
    )
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      userId,
      token,
      expirationDate
    );
    this.userSubject.next(user)
  }

  private handleErrorResponse(errorRes: HttpErrorResponse) {

    let errorMessage = "An unknown error occurred"

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage)
    }

    // ~ else...
    switch (errorRes.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage = 'This email exists already.'
        break;
      case "OPERATION_NOT_ALLOWED":
        errorMessage = 'Password sign-in is disabled for this project.'
        break;
      case "TOO_MANY_ATTEMPTS_TRY_LATER":
        errorMessage = 'Too many attempts, try again later.'
        break;
      case "INVALID_PASSWORD":
        errorMessage = 'Wrong password';
        break;
      case "EMAIL_NOT_FOUND":
        errorMessage = 'email does not exist'
        break;
      case "USER_DISABLED":
        errorMessage = 'this user has been temporarily suspended'
        break;
    }
    return throwError(errorMessage)
  }
}
