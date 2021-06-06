import { Routes } from '@angular/router';

import { HomeComponent } from '@src/app/home/home.component';
import { MenuComponent } from '@src/app/menu/menu.component';
import { LoginComponent } from '@src/app/login/login.component';
import { ProfileComponent } from '@src/app/profile/profile.component';
import { SettingComponent } from '@src/app/setting/setting.component';
import { ReportComponent } from '@src/app/report/report.component';
import { CartComponent } from '@src/app/cart/cart.component';
import { RegistrationComponent } from '@src/app/registration/registration.component';

export const routes: Routes = [
  {
      path: '',
      redirectTo: '/login',
      pathMatch: 'full',
  },
  {
      path: 'home',
      component: HomeComponent,
  },
  {
      path: 'menu',
      component: MenuComponent,
  },
  {
      path: 'login',
      component: LoginComponent,
  },
  {
      path: 'profile',
      component: ProfileComponent,
  },
  {
      path: 'setting',
      component: SettingComponent, 
  },
  {
      path: 'report',
      component: ReportComponent, 
  },
  {
      path: 'cart',
      component: CartComponent, 
  },
  {
      path: 'registration',
      component: RegistrationComponent, 
  }
];
