import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/auth/user.model';

export class AuthServiceStub {
  userSubject = new BehaviorSubject<User>(null);

  logout() {
    this.userSubject.next(null);
  }

  /**
   * Asynchronous. Uses an observable w/ 1-second timeout to mock logging in.
   * Correct email/password returns AuthResponse object. Incorrect returns an Error object.
   * @param email
   * @param password
   */
  login(email: string, password: string) {

    return Observable.create(observer => {
      setTimeout(() => {
        if ((email === 'jacob@email.com') && (password === 'qwertyuiop')) {
          observer.next({
            kind: 'kind value',
            idToken: 'idToken value',
            email: email,
            refreshToken: 'refreshToken value',
            expiresIn: 'expiresIn value',
            localId: 'localId value',
          });
        } else { observer.error('An error occurred.'); }
      }, 1000);
    });
  }
}
