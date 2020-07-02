import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as data from '../shared/credentials.json'

interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {  
    let secret = data.apiKey;
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=' + secret,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    );
  }
}
