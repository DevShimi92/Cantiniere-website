import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { HomeComponent } from '@src/app/home/home.component';
import { MenuComponent } from '@src/app/menu/menu.component';
import { ProfileComponent } from '@src/app/profile/profile.component';
import { SettingComponent } from '@src/app/setting/setting.component';
import { ReportComponent } from '@src/app/report/report.component';
import { CartComponent } from '@src/app/cart/cart.component';
import { RegistrationComponent } from '@src/app/registration/registration.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    ProfileComponent,
    SettingComponent,
    ReportComponent,
    CartComponent,
    RegistrationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
