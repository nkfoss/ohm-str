import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService, AuthResponseData } from '../auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  private isLoginMode = true;
  isLoading = false;
  error: string = null;

  public authForm: FormGroup;

  // =====================================================================


  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {

    // Build/populate the sign-in form.
    const email = '';
    const password = '';
    this.authForm = this.formBuilder.group({
      email: this.formBuilder.control(email, [Validators.required, Validators.email]),
      password: this.formBuilder.control(password, [Validators.required, Validators.minLength(6)])
    });
  }

  // ===================================================================================

  // Switch from login to sign-up mode.
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }


  onSubmit() {

    this.error = null; // Reset any previous error message.

    if (!this.authForm.valid) { return; }

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;
    let authObs: Observable<AuthResponseData>;

    this.isLoading = true; // Displays the loading spinner

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
        authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
  }



}
