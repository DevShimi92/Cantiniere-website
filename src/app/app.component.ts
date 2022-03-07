import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { trigger, transition, state, animate, style, useAnimation } from '@angular/animations';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DataUser } from './shared/models/dataUser.model';
import { errorFormAnimation } from '././animation/animation';
import { AuthService } from './service/auth.service';
import { FoodStockService } from './service/foodStock.service';
import { EventEmitterService } from './service/event-emitter.service';

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

  dataUser : DataUser;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private foodStockService: FoodStockService, private _snackBar: MatSnackBar, private eventEmitterService: EventEmitterService) { 
    this.eventEmitterService.changeEmitted$.subscribe(() => {
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

    this.foodStockService.getHourLimit().subscribe(( result ) =>{
      this.HourLimitForOrder(result.hour_limit);
    });

  }


  public toggle():void {
    this.isOpen = !this.isOpen;
  }

  somethingInEmailField():void {

    const value =(<HTMLInputElement>document.getElementById('email')).value;

      if ( value == '')
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

  somethingInPasswordField():void {

    const value =(<HTMLInputElement>document.getElementById('password')).value;

    if (value != '')
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

          })
          .catch(() => {
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
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[\d]{1,3}\.[\d]{1,3}\.[0-9]{1,3}\.[\d]{1,3}\])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

  HourLimitForOrder(hourString:string):void{

    let msg : string;
    const hourLimit = new Date;
    const hourNow = new Date;
    
    const hour : number = parseInt(hourString.toString().slice(0, 2));
    const minute : number = parseInt(hourString.toString().slice(3, 5));
    const seconde : number = parseInt(hourString.toString().slice(6, 8));

    hourLimit.setHours(hour, minute, seconde);

    const msDiff = Date.parse(hourLimit.toString()) - Date.parse(hourNow.toString());

    if(msDiff > 0)
    {
      sessionStorage.setItem('hourLimit', 'true');
    }
    else
    {
      sessionStorage.setItem('hourLimit', 'false');
    }

    const seconds = msDiff / 1000;
    const minutes  = (seconds / 60) % 100 ;
    const hours = seconds / 3600 ;

    if(hours < 2 && minutes > 60  )
      {
        const hoursString = hours.toString().slice(0, 1);
        msg =  "Il vous reste "+ hoursString +' heure pour commander un plat avant la fermeture des commandes pour aujourd hui !' ;

        this._snackBar.open(msg,'', {
          duration: 7 * 1000,
        });

      }
    else if( hours < 2 && minutes < 10 && seconds > 0)
      {
        const minuteString = minutes.toString().slice(0, 1);
        msg =  'Il vous reste que '+ minuteString +' minute pour commander un plat avant la fermeture des commandes pour aujourd hui !' ;
  
        this._snackBar.open(msg,'', {
          duration: 7 * 1000,
        });
  
      }
    else if( hours < 2 && minutes < 60 && seconds > 0)
    {
      const minuteString = minutes.toString().slice(0, 2);
      msg =  'Il vous reste que '+ minuteString +' minute pour commander un plat avant la fermeture des commandes pour aujourd hui !' ;

      this._snackBar.open(msg,'', {
        duration: 7 * 1000,
      });

    }

  }

}
