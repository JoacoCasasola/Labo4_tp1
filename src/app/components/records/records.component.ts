import { Component, OnInit } from '@angular/core';
import { supabase } from '../supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface RecordJuego {
  juegoClave: string;
  juegoNombre: string;
  max_puntaje: number;
  usuario: string;
}

const JUEGOS = [
  { clave: 'ahorcado', nombre: 'Ahorcado' },
  { clave: 'mayoromenor', nombre: 'Mayor o Menor' },
  { clave: 'banderas', nombre: 'Preguntados' },
  { clave: 'ppt', nombre: 'Piedra, Papel o Tijera' }
] as const;

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class RecordsComponent implements OnInit {
  records: RecordJuego[] = [];
  loading = true;

  constructor() {}

  async ngOnInit(): Promise<void> {
    for (const juego of JUEGOS) {
      const { data, error } = await supabase
        .from('resultados')
        .select('puntaje, user_id')
        .eq('juego', juego.clave)
        .order('puntaje', { ascending: false })
        .limit(1);

      if (!error && data?.length > 0) {
        const userId = data[0].user_id;
        const nombreUsuario = await this.getNombreUsuario(userId);

        this.records.push({
          juegoClave: juego.clave,
          juegoNombre: juego.nombre,
          max_puntaje: data[0].puntaje,
          usuario: nombreUsuario
        });
      }
    }

    this.loading = false;
  }

  async getNombreUsuario(userId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('usuarios_logueados')
        .select('nombre_usuario')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.warn(`No se encontró el usuario ${userId}:`, error.message);
        return 'desconocido';
      }

      return data.nombre_usuario || 'desconocido';
    } catch (err) {
      console.error(`Error inesperado al obtener usuario ${userId}:`, err);
      return 'desconocido';
    }
  }
}