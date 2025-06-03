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

      if (error) throw error;

      // Extrae ID y Email del usuario registrado
      const userId = data.user?.id;
      const userEmail = data.user?.email;

      if (!userId || !userEmail) {
        throw new Error('No se pudo obtener información del usuario');
      }

      // Guarda en tabla usuarios (opcional)
      const { error: insertUsuariosError } = await supabase
        .from('users')
        .insert({ id: userId, correo: userEmail });

      if (insertUsuariosError) {
        console.warn('Advertencia al guardar en usuarios:', insertUsuariosError.message);
      }

      // Guarda en tabla usuarios_logueados
      const nombre_usuario = userEmail.split('@')[0];

      const { error: insertLogueadosError } = await supabase
        .from('usuarios_logueados')
        .upsert({
          user_id: userId,
          email: userEmail,
          nombre_usuario,
          fecha_login: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (insertLogueadosError) {
        console.error('Error al guardar en usuarios_logueados:', insertLogueadosError.message);
      }

      this.mensajeExito = '¡Registro exitoso! Iniciando sesión...';
      this.mensajeError = '';

      setTimeout(() => this.router.navigate(['/home']), 1500);

    } catch (error: any) {
      console.error('Detalles del error:', {
        message: error.message,
        status: error.status,
        originalError: error
      });

      this.mensajeError = `Error al registrar: ${error.message}`;
    }
  }
}