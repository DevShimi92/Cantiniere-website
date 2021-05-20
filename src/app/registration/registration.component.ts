import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../shared/models/user.model';
import { UserService } from '../service/user.service'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})

export class RegistrationComponent implements OnInit {

  user : User;
  
  registrationForm: FormGroup;

  emptyLastName = false;
  emptyName = false;
  errorEmail = false;
  errorEmailMsg ='';
  errorPassword = false;
  errorCheckPassword = false;
  errorPasswordMsg ='';

  constructor( private formBuilder: FormBuilder, private router: Router, private userService: UserService ) { 
    this.user = new User();
  }

  ngOnInit(): void {
    
    this.registrationForm = this.formBuilder.group({
      last_name:'',
      first_name:'',
      email: '',
      password: '',
      checkPassword: ''
    });

  }

  onSubmit():void {

    if(!this.registrationForm.value.last_name)
      {
        this.emptyLastName = true;
      }
    else
      { 
        this.emptyLastName = false;
      }

    if(!this.registrationForm.value.first_name)
      {
        this.emptyName = true;
      }
    else
      { 
        this.emptyName = false;
      }
      
    if(!this.registrationForm.value.email)
      {
        this.errorEmail = true;
        this.errorEmailMsg = 'Email requis'
      }
    else if (!this.validateEmail(this.registrationForm.value.email))
      {
        this.errorEmail = true;
        this.errorEmailMsg = 'Email invalide'
      }
    else
      { 
        this.errorEmail = false;
      }
     
    if(!this.registrationForm.value.password )
      {
        this.errorPassword = true;
        this.errorPasswordMsg = 'Mot de passe requis';
      }
    else
      { 
        this.errorPassword = false;
      }

   if (!this.registrationForm.value.checkPassword && this.errorPassword == false)
      {
        this.errorCheckPassword = true;
        this.errorPasswordMsg = 'Mot de passe de confirmation requis';
      }
    else if(this.registrationForm.value.password != this.registrationForm.value.checkPassword && this.registrationForm.value.checkPassword != '')
      {
        this.errorCheckPassword = true;
        this.errorPasswordMsg = ' Les Mot de passe entrée sont différents';
      }
    else
      { 
        this.errorCheckPassword = false;
      }
  
    
    if(!this.emptyLastName && !this.emptyName && !this.errorEmail && ! this.errorPassword  && ! this.errorCheckPassword)
      {

        this.user = this.registrationForm.value;
        console.log(this.user);

        this.userService.createUser(this.user).then(() => {

            this.router.navigate([""]).then(() => {
              location.reload();
            });
        })
        .catch((error) => {
          if(error.status == 409)
            {
              this.errorEmail = true;
              this.errorEmailMsg = 'Cet email est déja présente dans notre base de donnée.'
            }
          else
            {
              console.log(error); 
            }
        });

      }
    
  }


  validateEmail(email:string):boolean {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

}
