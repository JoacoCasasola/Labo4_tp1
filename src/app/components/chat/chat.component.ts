import { Component, OnInit } from '@angular/core';
import { supabase } from '../supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [FormsModule, CommonModule]
})
export class ChatComponent implements OnInit {
  mensajes: any[] = [];
  nuevoMensaje: string = '';
  usuarioActual: string = '';

  ngOnInit(): void {
    this.obtenerUsuarioActual();
    this.cargarMensajes();
    this.escucharNuevosMensajes();
  }

  async obtenerUsuarioActual() {
    const { data } = await supabase.auth.getUser();
    if (data?.user?.email) {
      this.usuarioActual = data.user.email;
    }
  }

  async cargarMensajes() {
    const { data, error } = await supabase
      .from('mensajes_chat')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) console.error('Error al cargar mensajes:', error);
    else this.mensajes = data;
  }

  async enviarMensaje() {
    if (!this.nuevoMensaje.trim()) return;

    const mensaje = {
      usuario: this.usuarioActual,
      texto: this.nuevoMensaje,
    };

    try {
      const { error } = await supabase.from('mensajes_chat').insert([mensaje]);

      if (error) {
        console.error('Error al enviar mensaje:', error);
        alert('No se pudo enviar el mensaje. Inténtalo nuevamente.');
      } else {
        this.nuevoMensaje = '';
      }
    } catch (error) {
      console.error('Error inesperado al enviar mensaje:', error);
      alert('Ocurrió un error inesperado. Inténtalo nuevamente.');
    }
  }

  escucharNuevosMensajes() {
  supabase
    .channel('chat')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'mensajes_chat' },
      (payload) => {
        console.log('Nuevo mensaje recibido:', payload.new);
        this.mensajes.push(payload.new);
      }
    )
    .subscribe();
  }

  extraerNombreUsuario(email: string): string {
    return email.split('@')[0];
  }

  formatoHora(fecha: string): string {
    const date = new Date(fecha);
    const horas = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');

    return `${horas}:${minutos} ${dia}/${mes}`;
  }
}
