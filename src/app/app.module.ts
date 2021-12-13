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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';


import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { HomeComponent, HomeDialogComponent } from '@src/app/home/home.component';
import { LoginComponent } from '@src/app/login/login.component';
import { MenuComponent, MenuDialogComponent } from '@src/app/menu/menu.component';
import { ProfileComponent, ProfileDialogComponent } from '@src/app/profile/profile.component';
import { SettingComponent } from '@src/app/setting/setting.component';
import { ReportComponent } from '@src/app/report/report.component';
import { CartComponent } from '@src/app/cart/cart.component';
import { RegistrationComponent } from '@src/app/registration/registration.component';
import { DashboardComponent } from '@src/app/dashboard/dashboard.component';
import { DashboardTabUserComponent, DashboardDialogEditSoldeComponent, DashboardDialogListOrderComponent, DashboardDialogOrderContentComponent } from '@src/app/dashboard/dashboard-tab-user.component';
import { DashboardTabEditFoodComponent, DashboardDialogTypeArticleComponent, DashboardDialogArticleComponent } from '@src/app/dashboard/dashboard-tab-edit-food.component';
import { DashboardSettingComponent} from '@src/app/dashboard/dashboard-tab-setting.component';
import { DashboardRecapOrderComponent} from '@src/app/dashboard/dashboard-tab-recap-order.component';
import { DashboardDialogMenuComponent } from '@src/app/dashboard/dashboard-dialog-menu.component';
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
    DashboardTabUserComponent,
    DashboardDialogEditSoldeComponent,
    DashboardDialogListOrderComponent,
    DashboardDialogOrderContentComponent,
    DashboardTabEditFoodComponent,
    DashboardSettingComponent,
    DashboardRecapOrderComponent,
    DashboardDialogTypeArticleComponent,
    DashboardDialogArticleComponent,
    DashboardDialogMenuComponent,
    RestPasswordComponent,
    MenuDialogComponent,
    ProfileDialogComponent,
    HomeDialogComponent,
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
    MatSlideToggleModule,
    MatSnackBarModule,
    MatExpansionModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
