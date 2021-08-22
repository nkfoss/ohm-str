import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthServiceStub } from 'src/app/shared/mocks/auth.service.mock';
import { AuthService } from '../auth.service';
import { AuthComponent } from './auth.component';

describe('auth', () => {
  let auth: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [AuthComponent],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub }
      ]
    });

    fixture = TestBed.createComponent(AuthComponent);
    auth = fixture.debugElement.componentInstance;

    fixture.detectChanges();
  });

  it('should create the Auth Component', () => {
    expect(auth).toBeTruthy();
  });

  it('should have an authForm with blank email and password', () => {
    expect(auth.authForm).toBeTruthy();
    expect(auth.authForm.get('email').value).toBe('');
    expect(auth.authForm.get('password').value).toBe('');
  });

  it('should have an invalid form (short password)', () => {
    auth.authForm.get('email').setValue('jacob@email.com');
    auth.authForm.get('password').setValue('jacob');
    expect(auth.authForm.valid).toBe(false);
  });

  it('should have an invalid form (email format)', () => {
    auth.authForm.get('email').setValue('jacob');
    auth.authForm.get('password').setValue('jacob1');
    expect(auth.authForm.valid).toBe(false);
  });

  it('should have a valid form (email/pass good)', () => {
    auth.authForm.get('email').setValue('jacob@email.com');
    auth.authForm.get('password').setValue('qwertyuiop');
    expect(auth.authForm.valid).toBe(true);
  });

  it('should receive an AuthResponse object, stop loading, and navigate home when logging in', async(() => {
    const router = TestBed.inject(Router);
    const consoleSpy = spyOn(console, 'log');
    const navigateSpy = spyOn(router, 'navigate');

    auth.authForm.get('email').setValue('jacob@email.com');
    auth.authForm.get('password').setValue('qwertyuiop');
    auth.onSubmit();
    fixture.detectChanges();

    // Wait for the async tasks to complete. There's probably a better way to do this.
    setTimeout(() => {
      const authResponseObject = {
        kind: 'kind value',
        idToken: 'idToken value',
        email: 'jacob@email.com',
        refreshToken: 'refreshToken value',
        expiresIn: 'expiresIn value',
        localId: 'localId value',
      };
      expect(consoleSpy).toHaveBeenCalledWith(authResponseObject);
      expect(auth.isLoading).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/home']);
    }, 1000);

  }));

  it('should set the error property and stop loading after a failed login', async(() => {
    auth.authForm.get('email').setValue('wrong@wrong.wrong');
    auth.authForm.get('password').setValue('wrongwrong');
    auth.onSubmit();
    fixture.detectChanges();

    // Wait for the async tasks to complete. There's probably a better way to do this.
    setTimeout(() => {
      expect(auth.error).toEqual('An error occurred.');
      expect(auth.isLoading).toBe(false);
    }, 1500);

  }));

  it('should NOT call service.login() if the form is invalid', () => {
    const authService = fixture.debugElement.injector.get(AuthService);
    const loginSpy = spyOn(authService, 'login');
    auth.onSubmit(); // Email and password left blank.
    expect(loginSpy).not.toHaveBeenCalled();
  });


});
