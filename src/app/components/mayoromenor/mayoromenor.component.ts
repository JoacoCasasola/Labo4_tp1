import { Component, OnInit } from '@angular/core';
import { supabase } from '../supabase.service';

@Component({
  selector: 'app-mayoromenor',
  templateUrl: './mayoromenor.component.html',
  styleUrls: ['./mayoromenor.component.css'],
})
export class MayoromenorComponent implements OnInit {
  mazo: number[] = [];
  cartaActual: number = 0;
  puntos: number = 0;
  mensaje: string = '';
  usuarioId: string | null = null;
  usuarioEmail: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.obtenerUsuarioAutenticado();
    this.reiniciarJuego();
  }

  async obtenerUsuarioAutenticado() {
    const { data } = await supabase.auth.getUser();

    if (data?.user) {
      this.usuarioId = data.user.id;
      this.usuarioEmail = data.user.email || null;
    } else {
      alert('Debes iniciar sesión para jugar.');
      window.location.href = '/login';
    }
  }

  reiniciarJuego(): void {
    this.mazo = Array.from({ length: 13 }, (_, i) => i + 1);
    this.puntos = 0;
    this.mensaje = '';
    this.siguienteCarta();
  }

  siguienteCarta(): void {
    if (this.mazo.length === 0) {
      this.finalizarJuego();
      return;
    }
    const indiceAleatorio = Math.floor(Math.random() * this.mazo.length);
    this.cartaActual = this.mazo[indiceAleatorio];
    this.mazo.splice(indiceAleatorio, 1);
  }

  elegirOpcion(opcion: 'mayor' | 'menor'): void {

    const cartaAnterior = this.cartaActual;
    this.siguienteCarta();

    if (
      (opcion === 'mayor' && this.cartaActual > cartaAnterior) ||
      (opcion === 'menor' && this.cartaActual < cartaAnterior)
    ) {
      this.mensaje = '¡Correcto!';
      this.puntos++;
    } else {
      this.mensaje = '¡Incorrecto!';
    }
  }

  async finalizarJuego(): Promise<void> {
    this.mensaje = '🎉 ¡Fin del juego!';

    if (!this.usuarioId) {
      console.error('Usuario no autenticado');
      return;
    }

    const resultado = {
      user_id: this.usuarioId,
      email: this.usuarioEmail,
      juego: 'mayoromenor',
      puntaje: this.puntos,
      fecha: new Date().toISOString()
    };

    const { error } = await supabase.from('resultados').insert([resultado]);

    if (error) {
      console.error('Error al guardar el resultado:', error.message);
    } else {
      console.log('Resultado guardado correctamente');
    }
  }
}