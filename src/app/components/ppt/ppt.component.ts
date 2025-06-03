import { Component } from '@angular/core';
import { supabase } from '../supabase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ppt',
  templateUrl: './ppt.component.html',
  styleUrls: ['./ppt.component.css'],
  imports: [CommonModule]
})
export class PptComponent {
  opciones = ['piedra', 'papel', 'tijera'];
  puntajeJugador = 0;
  puntajeComputadora = 0;
  resultado = '';
  usuarioId: string | null = null;

  constructor() {}

  async ngOnInit(): Promise<void> {
    await this.obtenerUsuarioAutenticado();
  }

  async obtenerUsuarioAutenticado(): Promise<void> {
    const { data } = await supabase.auth.getUser();

    if (data?.user) {
      this.usuarioId = data.user.id;
    } else {
      alert('Debes iniciar sesión para jugar.');
      window.location.href = '/login';
    }
  }

  jugar(eleccionJugador: string): void {
    const eleccionComputadora =
      this.opciones[Math.floor(Math.random() * this.opciones.length)];

    if (eleccionJugador === eleccionComputadora) {
      this.resultado = 'Empate';
    } else if (
      (eleccionJugador === 'piedra' && eleccionComputadora === 'tijera') ||
      (eleccionJugador === 'papel' && eleccionComputadora === 'piedra') ||
      (eleccionJugador === 'tijera' && eleccionComputadora === 'papel')
    ) {
      this.resultado = 'Ganaste';
      this.puntajeJugador++;
    } else {
      this.resultado = 'Perdiste';
      this.puntajeComputadora++;
    }

    this.resultado += ` --> Tú: ${eleccionJugador} || Computadora: ${eleccionComputadora}`;

    if (this.puntajeJugador === 5 || this.puntajeComputadora === 5) {
      this.finalizarJuego(this.puntajeJugador === 5);
    }
  }

  reiniciarJuego(): void {
    this.puntajeJugador = 0;
    this.puntajeComputadora = 0;
    this.resultado = '';
  }

  async finalizarJuego(gano: boolean): Promise<void> {
    if (!this.usuarioId) {
      console.error('Usuario no autenticado');
      return;
    }

    const resultado = {
      user_id: this.usuarioId,
      juego: 'ppt',
      gano: gano,
      puntaje: this.puntajeJugador,
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