import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit,OnInit {
  public userOnline = false;
  title = 'Cantiniere-website';

  constructor(private _changeDetectionRef: ChangeDetectorRef) {
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

}
