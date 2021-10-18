import { Component } from '@angular/core';
import { clear } from "@nativescript/core/application-settings";
import { RouterExtensions } from "@nativescript/angular";

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})
export class SettingComponent  {
  title = 'Cantiniere-website';

  constructor( private routerExtensions: RouterExtensions) {
   // do nothing.
  }

  logout(): void {
    clear();
    this.routerExtensions.navigate(["/home"], { clearHistory: true });
  }

}
