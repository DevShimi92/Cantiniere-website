import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { trigger, transition, state, animate, style, useAnimation } from '@angular/animations';
import { Router } from '@angular/router';

import { errorFormAnimation } from '././animation/animation';
import { DefaultService } from './default.service';

@Component({
  selector: 'app-root',
  animations: [
    trigger('openClose', [
      state('closed', style({
        height: '60px',
        opacity: 0,
      },)),
      state('open', style({
        height: '6%',
        opacity: 1,
      })),
      transition('open => closed', [
          animate("1s", style({
            height: '60px',
            opacity: 0,
          })),
      ]),
      transition('closed => open', [
          animate("1s", style({
            height: '6%',
            opacity: 1,
          }))
      ]),
    ]),
    trigger('showErrorOnForm', [
      transition('* => active', [
        useAnimation(errorFormAnimation),
    ]),
    ]),
    trigger('showErrorOnEmail', [
      transition('* => active', [
        useAnimation(errorFormAnimation),
    ]),
    ]),
    trigger('passwordEmptyAnima', [
      transition('* => active', [
        useAnimation(errorFormAnimation)
    ]),
    ])
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  accountLogIn = false;
  isOpen = false;
  valueOfButton = 'Pas de compte ?'
  errorInLogin = false;
  errorInEmail = false;
  passwordEmpty = false;
  loginForm: FormGroup;
  routerLinkOnButton = '/registration';

  constructor(private formBuilder: FormBuilder, private router: Router, private defaultService: DefaultService) {  }

  ngOnInit():void {

    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });

    if (sessionStorage.getItem('token'))
    {
      this.accountLogIn = true;
    }

  }


  toggle():void {
    this.isOpen = !this.isOpen;
  }

  somethingInEmailField(event):void {
      if (event.target.value == '')
        { 
          this.valueOfButton = 'Pas de compte ?';
          this.routerLinkOnButton = '/registration';
        }
      else
        {
          this.valueOfButton = '     Connexion    ';
          this.errorInEmail = false;
          this.routerLinkOnButton = '';  
        }
  }

  somethingInPasswordField(event):void {
    if (event.target.value != '')
          {
            this.valueOfButton = '     Connexion    ';
            this.errorInEmail = false;
            this.routerLinkOnButton = '';  
          }
}

  onSubmit():void {
      
      this.errorInLogin = false;

      if(!this.validateEmail(this.loginForm.value.email) && this.loginForm.value.email != '')
        {
          if(this.routerLinkOnButton == '/login')
            {
              this.isOpen = false;
            }
          this.errorInEmail = !this.errorInEmail;
          this.valueOfButton = 'Identifiant oublié?';
          this.routerLinkOnButton = '/login';
        }
      else if( this.loginForm.value.email != '' && this.loginForm.value.password == '')
        {
          this.passwordEmpty = !this.passwordEmpty;
          this.valueOfButton = 'Identifiant oublié?';
          this.routerLinkOnButton = '/login';
        }
      else if(this.loginForm.value.email != '' && this.loginForm.value.password != '')
        {
          this.defaultService.getToken(this.loginForm.value.email,this.loginForm.value.password).subscribe((response) => 
              {
                  sessionStorage.setItem('token', response.token);
                  this.accountLogIn= true;
                  this.isOpen = false
              },
            (error) => 
              {
                if(error.status == 401)
                {
                  this.errorInLogin = true;
                  this.valueOfButton = 'Identifiant oublié?';
                  this.routerLinkOnButton = '/login';
                }
                else
                {
                  console.log(error);
                }
              }
          );
        }
    }

  logout():void
    {
      sessionStorage.clear();
      this.accountLogIn=false;
      this.router.navigate([""]).then(() => {
        location.reload();
      });
    }

  validateEmail(email:string):boolean {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

}
