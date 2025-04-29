import { Routes } from '@angular/router';
import { LoginComponent } from '../app/components/login/login.component';
import { HomeComponent } from '../app/components/home/home.component';
import { QuienSoyComponent } from '../app/components/quien-soy/quien-soy.component';
import { RegistroComponent } from '../app/components/registro/registro.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'quien-soy', component: QuienSoyComponent },
    ]
  }
];