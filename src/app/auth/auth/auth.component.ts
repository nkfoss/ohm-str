import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

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

    if (!this.authForm.valid) { return }

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    this.isLoading = true;
    if (this.isLoginMode) {
      //...
    } else {
      this.authService.signup(email, password).subscribe(resData => {
        console.log(resData)
        this.isLoading = false;
      }, errorMessage => {    // Our service will give us a message, rather than the error object
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      })
      this.authForm.reset()
    }
  }



}
