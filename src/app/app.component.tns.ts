import { Component, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { RouterExtensions } from "@nativescript/angular";
import { getString } from "@nativescript/core/application-settings";
import { Application } from "@nativescript/core";

import { FoodStockService } from './service/foodStock.service';
import { AuthService } from './service/auth.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './app.component.tns.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements AfterViewInit {
  public userOnline : boolean;
  public  showLimitTime = false;
  private  hourLimitRequest  = false;
  private  hourLimit : string;
  msgLimit = 'Plus que 1 heure';
  msg2Limit = "avant la fin des prises de commandes !";

  constructor(private _changeDetectionRef: ChangeDetectorRef, private routerExtensions: RouterExtensions, private foodStockService: FoodStockService, private authService: AuthService) {
    Application.on(Application.resumeEvent, () => {
      this.authService.refreshToken();
    });
  }

  @ViewChild(RadSideDrawerComponent, { static: false }) public drawerComponent: RadSideDrawerComponent;
  private drawer: RadSideDrawer;

  ngAfterViewInit(): void {
      this.drawer = this.drawerComponent.sideDrawer;
      this._changeDetectionRef.detectChanges();
  }

  public openDrawer(): void {
      this.limitTime();
      
      if(getString("token"))
        {
          this.userOnline = true;
        }
      else
        {
          this.userOnline = false;
        }
      this.drawer.showDrawer();
  }

  public limitTime(): void {
    if(!this.hourLimitRequest)
      {
       this.foodStockService.getHourLimit().subscribe(( result ) =>{
          this.hourLimit = result.hour_limit;
          this.HourLimitForOrder(result.hour_limit);
          this.hourLimitRequest = true;
        });
      }
    else{
      this.HourLimitForOrder(this.hourLimit);
    }
  }

  HourLimitForOrder(hourString:string):void{

    const hourLimit = new Date;
    const hourNow = new Date;
    
    const hour : number = parseInt(hourString.toString().slice(0, 2));
    const minute : number = parseInt(hourString.toString().slice(3, 5));
    const seconde : number = parseInt(hourString.toString().slice(6, 8));

    hourLimit.setHours(hour, minute, seconde);

    const msDiff = Date.parse(hourLimit.toString()) - Date.parse(hourNow.toString());

    const seconds = msDiff / 1000;
    const minutes  = (seconds / 60) % 100 ;
    const hours = seconds / 3600 ;
    
    if(hours < 3 && hours > 0 )
      {
        const hoursString = hours.toString().slice(0, 1);
        this.msgLimit =  "Il vous reste "+ hoursString +' heure ' ;
        this.showLimitTime = true;
      }
    else if(  hours < 2 && minutes < 10 && seconds > 0)
      {
        const minuteString = minutes.toString().slice(0, 1);
        this.msgLimit =  'Il vous reste que '+ minuteString +' minute ' ;
        this.showLimitTime = true;
      }
    else if(  hours < 2 && minutes < 60 && seconds > 0 )
      {
        const minuteString = minutes.toString().slice(0, 2);
        this.msgLimit  =  'Il vous reste que '+ minuteString +' minute ' ;
        this.showLimitTime = true;
      }

  }

  public onCloseDrawerTap(): void {
      this.drawer.closeDrawer();
  }
  
  public navigateToHome(): void {
    this.routerExtensions.navigate(["/home"], { clearHistory: true });
    this.drawerComponent.sideDrawer.closeDrawer();
  }

  public navigateToMenu(): void {
    this.routerExtensions.navigate(["/menu"], { clearHistory: true });
    this.drawerComponent.sideDrawer.closeDrawer();
  }

  public navigateToLogin(): void {
    this.routerExtensions.navigate(["/login"], { clearHistory: true });
    this.drawerComponent.sideDrawer.closeDrawer();
  }

  public navigateToProfile(): void {
    this.routerExtensions.navigate(["/profile"], { clearHistory: true });
    this.drawerComponent.sideDrawer.closeDrawer();
  }

  public navigateToSetting(): void {
    this.routerExtensions.navigate(["/setting"], { clearHistory: true });
    this.drawerComponent.sideDrawer.closeDrawer();
  }

  public navigateToReport(): void {
    this.routerExtensions.navigate(["/report"], { clearHistory: true });
    this.drawerComponent.sideDrawer.closeDrawer();
  }

  public navigateToCart(): void {
    this.routerExtensions.navigate(["/cart"], { clearHistory: true });
  }

}
