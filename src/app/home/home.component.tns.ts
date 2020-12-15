import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit,OnInit {
  private _mainContentText: string;
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

  set mainContentText(value: string) {
      this._mainContentText = value;
  }

  public openDrawer(): void {
      this.drawer.showDrawer();
  }

  public onCloseDrawerTap(): void {
      this.drawer.closeDrawer();
  }

}
