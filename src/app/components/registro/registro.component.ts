import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class RegistroComponent {
  nuevoUsuario = { correo: '', clave: '' };
  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(private router: Router) {}

  async registrarUsuario(): Promise<void> {
    if (!this.nuevoUsuario.correo || !this.nuevoUsuario.clave) {
      this.mensajeError = 'Por favor, completa todos los campos.';
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: this.nuevoUsuario.correo,
        password: this.nuevoUsuario.clave
      });

      if (error) throw new Error(`Error en registro: ${error.message}`);

      console.log('Respuesta de signUp:', data);

      const userId = data.user?.id;
      const userEmail = data.user?.email;

      if (!userId || !userEmail) {
        throw new Error('No se obtuvo ID o correo del nuevo usuario');
      }

      const { error: userInsertError } = await supabase
        .from('users')
        .insert({ id: userId, correo: userEmail });

      if (userInsertError) {
        console.warn('Advertencia al insertar en users:', userInsertError.message);
      }

      const nombre_usuario = userEmail.split('@')[0];

      const { error: logInsertError } = await supabase
        .from('usuarios_logueados')
        .insert({
          user_id: userId,
          email: userEmail,
          nombre_usuario,
          fecha_login: new Date().toISOString()
        });

      if (logInsertError) {
        console.error('Error al insertar en usuarios_logueados:', logInsertError.message);
        throw new Error('No se pudo completar el registro en la base de datos.');
      }

      this.mensajeExito = '¡Registro exitoso! Iniciando sesión...';
      setTimeout(() => this.router.navigate(['/home']), 1500);

    } catch (error: any) {
      console.error('Error completo:', error);
      this.mensajeError = error.message || 'Ocurrió un error inesperado.';
    }
  }
}