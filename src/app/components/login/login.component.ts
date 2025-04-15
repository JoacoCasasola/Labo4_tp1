import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
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

      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      this.mensajeError = 'Nombre o clave incorrectos.';
    }
  }
}