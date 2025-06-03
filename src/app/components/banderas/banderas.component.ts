import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { supabase } from '../supabase.service';
import { HttpClientModule } from '@angular/common/http';

interface Pais {
  name: {
    common: string;
  };
  flags: {
    png: string;
  };
}

@Component({
  selector: 'app-banderas',
  templateUrl: './banderas.component.html',
  styleUrls: ['./banderas.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule],
})
export class BanderasComponent implements OnInit {
  paises: Pais[] = [];
  banderaActual: string = '';
  respuestaCorrecta: string = '';
  opciones: string[] = [];
  puntos: number = 0;
  mensaje: string = '';
  mostrarBotonSiguiente: boolean = false;

  usuarioId: string | null = null;
  usuarioEmail: string | null = null;

  constructor(private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    await this.obtenerUsuarioAutenticado(); 
    this.cargarPaises();
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

  cargarPaises(): void {
    this.http
      .get<any[]>('https://restcountries.com/v3.1/all')
      .subscribe(
        (data) => {
          this.paises = data.map((pais) => ({
          name: { common: pais.name?.common || 'Desconocido' },
          flags: { png: pais.flags?.png || '' },
        })) as Pais[];
        console.log('Paises cargados:', this.paises);
        this.siguientePregunta();
        },
        (error) => {
          console.error('Error al cargar países:', error);
        }
      );
  }

  siguientePregunta(): void {
    this.mensaje = '';
    this.mostrarBotonSiguiente = false;

    const indiceAleatorio = Math.floor(Math.random() * this.paises.length);
    const paisSeleccionado = this.paises[indiceAleatorio];
    this.banderaActual = paisSeleccionado.flags.png;
    this.respuestaCorrecta = paisSeleccionado.name.common;

    this.opciones = [this.respuestaCorrecta]; 
    while (this.opciones.length < 4) {
      const indiceOpcion = Math.floor(Math.random() * this.paises.length);
      const opcion = this.paises[indiceOpcion].name.common;
      if (!this.opciones.includes(opcion)) {
        this.opciones.push(opcion);
      }
    }

    this.opciones = this.desordenarArray(this.opciones);
  }

  verificarRespuesta(opcion: string): void {
    if (opcion === this.respuestaCorrecta) {
      this.mensaje = '¡Correcto!';
      this.puntos++;
      this.mostrarBotonSiguiente = true;
    } else {
      this.mensaje = '¡Incorrecto!';
      this.finalizarJuego();
      return;
    } 
  }

  async finalizarJuego(): Promise<void> {
    console.log('Método finalizarJuego() llamado');

    if (!this.usuarioId) {
      console.error('Usuario no autenticado');
      return;
    }

    const resultado = {
      user_id: this.usuarioId,
      email: this.usuarioEmail,
      juego: 'banderas',
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

  desordenarArray(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }
}