import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { RouterExtensions } from "@nativescript/angular";


@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './app.component.tns.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit,OnInit {
  public userOnline = false;
  title = 'Cantiniere-website';

  constructor(private _changeDetectionRef: ChangeDetectorRef,private routerExtensions: RouterExtensions) {
   // do nothing.
  }

  @ViewChild(RadSideDrawerComponent, { static: false }) public drawerComponent: RadSideDrawerComponent;
  private drawer: RadSideDrawer;

  ngAfterViewInit(): void {
      this.drawer = this.drawerComponent.sideDrawer;
      this._changeDetectionRef.detectChanges();
  }

  ngOnInit(): void {
    // do nothing
  }

  public openDrawer(): void {
      this.drawer.showDrawer();
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


}
