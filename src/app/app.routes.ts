import { Routes } from '@angular/router';
import { LoginComponent } from '../app/components/login/login.component';
import { HomeComponent } from '../app/components/home/home.component';
import { QuienSoyComponent } from '../app/components/quien-soy/quien-soy.component';
import { RegistroComponent } from '../app/components/registro/registro.component';
import { AhorcadoComponent } from './components/ahorcado/ahorcado.component';
import { MayoromenorComponent } from './components/mayoromenor/mayoromenor.component';
import { BanderasComponent } from './components/banderas/banderas.component';
import { PptComponent } from './components/ppt/ppt.component';
import { RecordsComponent } from './components/records/records.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'quien-soy', component: QuienSoyComponent },
      { path: 'ahorcado', component: AhorcadoComponent },
      { path: 'mayoromenor', component: MayoromenorComponent },
      { path: 'banderas', component: BanderasComponent },
      { path: 'ppt', component: PptComponent },
      { path: 'records', component: RecordsComponent },
    ]
  }
];