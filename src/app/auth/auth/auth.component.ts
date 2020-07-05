import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService, AuthResponseData } from '../auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error: string = null;

  public authForm: FormGroup;

  //=====================================================================


  constructor(private formBuilder: FormBuilder,
    private authService: AuthService) { }

  ngOnInit(): void {
    let email = '';
    let password = '';
    this.authForm = this.formBuilder.group({
      email: this.formBuilder.control(email, [Validators.required, Validators.email]),
      password: this.formBuilder.control(password, [Validators.required, Validators.minLength(6)])
    })
  }

  //===================================================================================

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit() {

    this.error=null;
    if (!this.authForm.valid) { return }

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    let authObs: Observable<AuthResponseData>

    this.isLoading = true;
    if (this.isLoginMode) { authObs = this.authService.login(email, password) } 
    else { authObs = this.authService.signup(email, password) }

    authObs.subscribe( 
      resData => {
        console.log(resData);
        this.isLoading = false;
      }, 
      errorMessage => {
        this.error = errorMessage
        this.isLoading = false;
      }
    )
  }



}
