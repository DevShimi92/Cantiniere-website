import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthService } from '../service/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  ForgotPasswordForm: FormGroup;
  done = false;
  error = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService ) {
   // do nothing.
 }

  ngOnInit(): void {
    
    this.ForgotPasswordForm = this.formBuilder.group({
      email: ''
    });

  }

  onSubmit(): void {

    if(this.validateEmail(this.ForgotPasswordForm.value.email))
      {
        this.error = false;
        this.authService.forgotPassword(this.ForgotPasswordForm.value.email).then(() => {
          this.done = true;
        });
      }
    else
    {
      this.error = true;
    }
  }



  validateEmail(email:string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

}
