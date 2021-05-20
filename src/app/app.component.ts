import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { trigger, transition, state, animate, style, useAnimation } from '@angular/animations';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";

import { errorFormAnimation } from '././animation/animation';
import { DefaultService } from './default.service';
import { AuthService } from './service/auth.service';

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
  coockerLogIn = false;
  isOpen = false;
  valueOfButton = 'Pas de compte ?'
  errorInLogin = false;
  errorInEmail = false;
  passwordEmpty = false;
  loginForm: FormGroup;
  routerLinkOnButton = '/registration';

  dataUser : any;
  helper = new JwtHelperService();

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private defaultService: DefaultService) { 
    defaultService.changeEmitted$.subscribe(any => {
      this.toggle();
    });
   }

  ngOnInit():void {

    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });

    if (sessionStorage.getItem('token'))
    {
      if(sessionStorage.getItem('cooker') == 'true')
        {
          this.coockerLogIn = true;
        }
      else
        {
          this.accountLogIn = true;
        }
      
    }

  }


  public toggle():void {
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

  async onSubmit():Promise<void> {
      
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
          this.authService.login(this.loginForm.value.email,this.loginForm.value.password).then((logtinOK) => {

          if (logtinOK)
              {
                  if ( sessionStorage.getItem('cooker') == 'true' )
                    {    
                        this.coockerLogIn= true;
                    }
                  else
                    {
                        this.accountLogIn= true;
                    }

                  this.isOpen = false
              }

          }).catch(() => {
            this.errorInLogin = true;
            this.valueOfButton = 'Identifiant oublié?';
            this.routerLinkOnButton = '/login'; 
          });
          
        }
    }

  logout():void
    {
      sessionStorage.clear();
      this.accountLogIn=false;
      this.coockerLogIn=false;
      this.router.navigate([""]).then(() => {
        location.reload();
      });
    }

  validateEmail(email:string):boolean {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

}