import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})

export class RegistrationComponent implements OnInit {
  
  registrationForm: FormGroup;

  constructor( private formBuilder: FormBuilder ) { }

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
        console.log("nom vide")
      }
    if(!this.registrationForm.value.firstNName)
      {
        console.log("prénom vide")
      }
    if(!this.registrationForm.value.email)
      {
        console.log("email vide")
      }
    else if (!this.validateEmail(this.registrationForm.value.email))
      {
        console.log("email invalide")
      }
    if(!this.registrationForm.value.password )
      {
        console.log("Mot de passe 1 vide")
      }
    else if (!this.registrationForm.value.checkPassword)
      {
        console.log("Mot de passe 2 vide")
      }
    else if(this.registrationForm.value.password != this.registrationForm.value.checkPassword)
      {
        console.log("Mot de passe différent")
      }
    
  }


  validateEmail(email:string):boolean {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

}
