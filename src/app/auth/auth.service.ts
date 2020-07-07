import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators'
import { throwError, Subject, BehaviorSubject } from 'rxjs'
import * as data from '../shared/credentials.json'
import { User } from './user.model';
import { Router } from '@angular/router';

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

  userSubject = new BehaviorSubject<User>(null);
  private tokenTimer: any;

  // =====================================================================

  constructor(private http: HttpClient,
    private router: Router) { }

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

  autoLogin() {

    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string } = JSON.parse( localStorage.getItem('userData') )

    if ( !userData ) { return } 
    
    const loadedUser = new User(
      userData.email, 
      userData.id, 
      userData._token,
      new Date(userData._tokenExpirationDate) 
    );

    if (loadedUser.token) { 
      this.userSubject.next(loadedUser) 
      const expirationDuration = 
        new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      this.autoLogout(expirationDuration)
    }
    
  }

  logout() {
    if (this.tokenTimer) { clearTimeout(this.tokenTimer )}
    localStorage.removeItem('userData');
    this.userSubject.next(null)
    this.router.navigate(['/auth'])
  }

  autoLogout(expirationDuration: number) {
    this.tokenTimer = setTimeout( () => { this.logout(); } , expirationDuration)
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
    this.autoLogout(expiresIn * 1000)

    localStorage.setItem( 'userData', JSON.stringify(user) )
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
