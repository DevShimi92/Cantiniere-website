import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultService } from '../default.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})

export class RegistrationComponent implements OnInit {
  
  registrationForm: FormGroup;

  emptyLastName = false;
  emptyName = false;
  errorEmail = false;
  errorEmailMsg ='';
  errorPassword = false;
  errorCheckPassword = false;
  errorPasswordMsg ='';

  constructor( private formBuilder: FormBuilder, private router: Router, private defaultService: DefaultService ) { }

  ngOnInit(): void {
    
    this.registrationForm = this.formBuilder.group({
      lastName:'',
      firstNName:'',
      email: '',
      password: '',
      checkPassword: ''
    });

  }

  onSubmit():void {

    if(!this.registrationForm.value.lastName)
      {
        this.emptyLastName = true;
      }
    else
      { 
        this.emptyLastName = false;
      }

    if(!this.registrationForm.value.firstNName)
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
        this.defaultService.register(this.registrationForm.value.lastName, this.registrationForm.value.firstNName, this.registrationForm.value.email, this.registrationForm.value.password).subscribe((response) => 
              {
                  sessionStorage.setItem('token', response.token);
                  this.router.navigate([""]).then(() => {
                    location.reload();
                  });
              },
            (error) => 
              {
                if(error.status == 409)
                  {
                    this.errorEmail = true;
                    this.errorEmailMsg = 'Cet email est déja présente dans notre base de donnée.'
                  }
                else
                  {
                    console.log(error); 
                  }
              }
          );
      }
    
  }


  validateEmail(email:string):boolean {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

}
