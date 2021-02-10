import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { trigger, transition, state, animate, style } from '@angular/animations';

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
        backgroundColor: '#fefffe'
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
            backgroundColor: '#fefffe'
          }))
      ]),
    ]),
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  accountLogIn = false;
  isOpen = false;
  valueInEmail = false;
  loginForm: FormGroup;
  routerLinkOnButton = '/registration';

  constructor(private formBuilder: FormBuilder,private defaultService: DefaultService) { 
    this.loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });
  }

  ngOnInit():void {

    if (sessionStorage.getItem('token'))
    {
      this.accountLogIn = true;
    }

  }


  toggle():void {
    this.isOpen = !this.isOpen;
  }

  somethingInEmailField(event):void{
      if (event.target.value == '')
        { 
          this.valueInEmail = false;
          this.routerLinkOnButton = '/registration';
        }
      else
        {
          this.valueInEmail = true;
          this.routerLinkOnButton = '';  
        }
  }

  onSubmit():void
    {
      if(this.loginForm.value.email != '' && this.loginForm.value.password != '')
      {
        this.defaultService.getToken(this.loginForm.value.email,this.loginForm.value.password).subscribe(data => 
          {
            if(data != null){
              sessionStorage.setItem('token', data.token);
              this.accountLogIn= true;
              this.isOpen = false
              }
          });
      }
    }

  logout():void
    {
      sessionStorage.clear();
      this.accountLogIn=false;
      location.reload();
    }

}
