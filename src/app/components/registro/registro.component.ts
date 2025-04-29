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
  nuevoUsuario = { nombre: '', clave: '' };
  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(private router: Router) {}

  async registrarUsuario() {
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.clave) {
      this.mensajeError = 'Por favor, completa todos los campos.';
      return;
    }

    try {
      const { data: usuariosExistentes, error: consultaError } = await supabase
        .from('usuarios')
        .select('nombre')
        .eq('nombre', this.nuevoUsuario.nombre);

      if (consultaError) {
        throw consultaError;
      }

      if (usuariosExistentes && usuariosExistentes.length > 0) {
        this.mensajeError = 'El nombre de usuario ya está registrado.';
        return;
      }

      const { error: insercionError } = await supabase
        .from('usuarios')
        .insert([{ nombre: this.nuevoUsuario.nombre, clave: this.nuevoUsuario.clave }]);

      if (insercionError) {
        throw insercionError;
      }

      await this.registrarLog(this.nuevoUsuario.nombre);

      this.mensajeExito = '¡Registro exitoso! Iniciando sesión...';
      this.mensajeError = ''; 

      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1000);
      
    } catch (error: any) {
      console.error('Error al registrar usuario:', error);
      this.mensajeError = 'Error al registrar usuario. Inténtalo nuevamente.';
    }
  }

  private async registrarLog(nombreUsuario: string) {
    try {
      console.log('Intentando registrar log para el usuario:', nombreUsuario);

      const { error } = await supabase
        .from('logs_actividad')
        .insert([{ usuario: nombreUsuario }]);

      if (error) {
        console.error('Error al registrar log:', error);
        throw new Error('Hubo un problema al registrar la actividad.');
      }

      console.log('Log registrado exitosamente.');
    } catch (error) {
      console.error('Error inesperado al registrar log:', error);
      this.mensajeError = 'Ocurrió un error al registrar la actividad. Por favor, intenta nuevamente.';
    }
  }
}