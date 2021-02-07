import { Component } from '@angular/core';
import { trigger, transition, state, animate, style } from '@angular/animations';

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
  routerLinkOnButton = '/registration';

  toggle():void {
    this.isOpen = !this.isOpen;
  }

  somethingInEmailField(event):void{
      console.log( event.target.value);
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
}
