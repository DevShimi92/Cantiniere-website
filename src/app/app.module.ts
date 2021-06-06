import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';


import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { HomeComponent } from '@src/app/home/home.component';
import { LoginComponent } from '@src/app/login/login.component';
import { MenuComponent, MenuComponentDialog } from '@src/app/menu/menu.component';
import { ProfileComponent } from '@src/app/profile/profile.component';
import { SettingComponent } from '@src/app/setting/setting.component';
import { ReportComponent } from '@src/app/report/report.component';
import { CartComponent } from '@src/app/cart/cart.component';
import { RegistrationComponent } from '@src/app/registration/registration.component';
import { DashboardComponent, DashboardComponentDialogEditSolde, DashboardComponentDialogTypeArticle, DashboardComponentDialogArticle, DashboardComponentDialogMenu } from '@src/app/dashboard/dashboard.component';
import { RestPasswordComponent } from '@src/app/restPassword/restPassword.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MenuComponent,
    ProfileComponent,
    SettingComponent,
    ReportComponent,
    CartComponent,
    RegistrationComponent,
    DashboardComponent,
    DashboardComponentDialogEditSolde,
    DashboardComponentDialogTypeArticle,
    DashboardComponentDialogArticle,
    DashboardComponentDialogMenu,
    RestPasswordComponent,
    MenuComponentDialog,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatTabsModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
