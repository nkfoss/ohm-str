import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  public authForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  //=====================================================================

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
    this.isLoginMode  = !this.isLoginMode
  }

  onSubmit() {
    console.log(this.authForm.value)
  }



}
