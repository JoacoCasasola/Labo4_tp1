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
  usuario = { correo: '', clave: '' };
  mensajeError: string = '';

  constructor(private router: Router) {}

  async iniciarSesion() {
    if (!this.usuario.correo || !this.usuario.clave) {
      this.mensajeError = 'Por favor, completa todos los campos.';
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: this.usuario.correo,
        password: this.usuario.clave,
      });

      if (error) throw error;

      const userId = data.user.id;
      await this.registrarLog(data.user.email!, userId);

      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      this.mensajeError = 
        error.message.includes('Invalid') 
          ? 'Credenciales incorrectas' 
          : 'Error al iniciar sesión. Inténtalo nuevamente.';
    }
  }

  private async registrarLog(email: string, userId: string) {
    const nombreUsuario = email.split('@')[0];

    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('usuarios_logueados')
        .select('user_id')
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('usuarios_logueados')
          .insert([
            {
              user_id: userId,
              email: email,
              nombre_usuario: nombreUsuario,
              fecha_login: new Date().toISOString()
            }
          ]);

        if (insertError) throw insertError;
      }

    } catch (error) {
      console.error('Error al registrar log:', error);
    }
  }

  registrarse() {
    this.router.navigate(['/registro']);
  }

  accesoRapido(tipo: 'admin' | 'invitado') {
    switch (tipo) {
      case 'admin':
        this.usuario.correo = 'admin@gmail.com';
        this.usuario.clave = 'admin123';
        break;
      case 'invitado':
        this.usuario.correo = 'invitado@gmail.com';
        this.usuario.clave = 'invitado123';
        break;
      default:
        this.mensajeError = 'Tipo de acceso rápido no válido.';
    }
  }
}