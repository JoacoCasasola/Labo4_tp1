import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  usuario = { nombre: '', clave: '' };
  mensajeError: string = '';

  constructor(private router: Router) {}

  async iniciarSesion() {
    if (!this.usuario.nombre || !this.usuario.clave) {
      this.mensajeError = 'Por favor, completa todos los campos.';
      return;
    }

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('nombre', this.usuario.nombre)
        .eq('clave', this.usuario.clave)
        .single();

      if (error) {
        throw error;
      }

      await this.registrarLog(this.usuario.nombre);

      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      this.mensajeError = 'Nombre o clave incorrectos.';
    }
  }

  private async registrarLog(nombreUsuario: string) {
    try {
      const { error } = await supabase
        .from('logs_actividad')
        .insert([{ usuario: nombreUsuario }]);

      if (error) {
        console.error('Error al registrar log:', error);
      }
    } catch (error) {
      console.error('Error inesperado al registrar log:', error);
    }
  }

  registrarse() {
    this.router.navigate(['/registro']);
  }


  accesoRapido(tipo: 'admin' | 'invitado') {
    switch (tipo) {
      case 'admin':
        this.usuario.nombre = 'admin';
        this.usuario.clave = 'admin';
        break;
      case 'invitado':
        this.usuario.nombre = 'invitado';
        this.usuario.clave = 'invitado';
        break;
      default:
        this.mensajeError = 'Tipo de acceso rápido no válido.';
    }
  }
}