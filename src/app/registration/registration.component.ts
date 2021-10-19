import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { User } from '../shared/models/user.model';
import { UserService } from '../service/user.service'

type ValidationErrors = {
  [key: string]: boolean;
};


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})

export class RegistrationComponent implements OnInit {

  user : User;
  
  registrationForm: FormGroup;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  ]);

  constructor( private formBuilder: FormBuilder, private router: Router, private _snackBar: MatSnackBar, private userService: UserService ) { 
    this.user = new User();
  }

  ngOnInit(): void {
    
    this.registrationForm = this.formBuilder.group({
      last_name: ['',Validators.required],
      first_name: ['',Validators.required],
      email: this.emailFormControl,
      password: ['',Validators.required],
      confirmPassword: ['']
    }, { validator: this.checkIfSamePassword });

  }
  
  onSubmit():void {

    if(this.registrationForm.valid)
      {

        this.user = this.registrationForm.value;

        this.userService.createUser(this.user).then(() => {

            this.router.navigate([""]).then(() => {
              location.reload();
            });
        })
        .catch((error) => {
          if(error.status == 409)
            {
              this.emailFormControl.setErrors({existing: true});
            }
          else
            {
              this._snackBar.openFromComponent(SettingSnackRegistrationComponent, {
                duration: 20 * 1000,
              });
              console.log(error); 
            }
        });

      }

  }

  checkIfSamePassword(c: AbstractControl):  ValidationErrors | null{   
    if (c) {
      const password = c.get('password')?.value;
      const confirmPassword = c.get('confirmPassword')?.value;

      if(password === confirmPassword)
        {
          c.get('confirmPassword')?.setErrors(null);
        }
      else
        {
          c.get('confirmPassword')?.setErrors({notSame: true});
          return ({notSame: true});
        }

    }
      return null;
  }

}

@Component({
  selector: 'snack-error-app-registration',
  template: '<span> Une erreur est survenue, veuillez réessayer ultérieurement. </span>',
})
export class SettingSnackRegistrationComponent {}