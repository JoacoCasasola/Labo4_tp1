import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { supabase } from '../supabase.service';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class AhorcadoComponent implements OnInit {
  letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  palabraSecreta = this.generarPalabraSecreta();
  palabraOculta: string[] = Array(this.palabraSecreta.length).fill('_');
  letrasUsadas: string[] = [];
  intentosRestantes = 6;
  juegoTerminado = false;
  mensaje = '';

  usuarioId: string | null = null;
  usuarioEmail: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.obtenerUsuarioAutenticado();
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

  seleccionarLetra(letra: string): void {
    if (this.letrasUsadas.includes(letra) || this.juegoTerminado) return;

    this.letrasUsadas.push(letra);

    if (this.palabraSecreta.includes(letra)) {
      this.actualizarPalabraOculta(letra);
    } else {
      this.intentosRestantes--;
    }

    this.verificarEstadoDelJuego();
  }

  actualizarPalabraOculta(letra: string): void {
    this.palabraSecreta.split('').forEach((char, index) => {
      if (char === letra) {
        this.palabraOculta[index] = char;
      }
    });
  }

  verificarEstadoDelJuego(): void {
    if (!this.palabraOculta.includes('_')) {
      this.mensaje = '¡Ganaste!';
      this.guardarResultado(true);
      this.juegoTerminado = true;
    } else if (this.intentosRestantes === 0) {
      this.mensaje = '¡Perdiste!';
      this.guardarResultado(false);
      this.juegoTerminado = true;
    }
  }

  async guardarResultado(gano: boolean): Promise<void> {
    if (!this.usuarioId) {
      console.error('Usuario no autenticado');
      return;
    }

    const resultado = {
      user_id: this.usuarioId,
      email: this.usuarioEmail,
      juego: 'ahorcado',
      gano: gano,
      palabra: this.palabraSecreta,
      puntaje: this.intentosRestantes,
      fecha: new Date().toISOString()
    };

    const { error } = await supabase.from('resultados').insert([resultado]);

    if (error) {
      console.error('Error al guardar el resultado:', error.message);
    } else {
      console.log('Resultado guardado correctamente');
    }
  }

  reiniciarJuego(): void {
    this.palabraSecreta = this.generarPalabraSecreta();
    this.palabraOculta = Array(this.palabraSecreta.length).fill('_');
    this.letrasUsadas = [];
    this.intentosRestantes = 6;
    this.juegoTerminado = false;
    this.mensaje = '';
  }

  generarPalabraSecreta(): string {
    const palabras = ['ANGULAR', 'JAVASCRIPT', 'DEVELOPER', 'FRONTEND', 'BACKEND'];
    const indiceAleatorio = Math.floor(Math.random() * palabras.length);
    return palabras[indiceAleatorio];
  }
}