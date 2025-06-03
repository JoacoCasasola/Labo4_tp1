import { Component } from '@angular/core';

@Component({
  selector: 'app-quien-soy',
  templateUrl: './quien-soy.component.html',
  styleUrls: ['./quien-soy.component.css']
})
export class QuienSoyComponent {
  titulo = 'Joaquín Casasola';
  presentacion = 'Soy un estudiante de la UTN Avellaneda apasionado por la tecnología, actualmente buscando mi primera oportunidad laboral en el mundo IT. Me considero una persona proactiva, con gran capacidad de aprendizaje y motivación para crecer profesionalmente en este campo.';
  habilidades = 'Entre mis habilidades se encuentran: programación en JavaScript/TypeScript, Angular, HTML/CSS y conocimientos básicos de backend.';
  juegoTitulo = 'Piedra, Papel o Tijeras';
  juegoDescripcion = 'Piedra, Papel o Tijeras es un juego clásico de manos que he implementado digitalmente. Las reglas son simples: la piedra vence a las tijeras rompiéndolas, las tijeras vencen al papel cortándolo, y el papel vence a la piedra envolviéndola. En caso de que ambos jugadores elijan la misma opción, es un empate.';
  juegoObjetivo = 'El objetivo de mi implementación fue practicar conceptos de programación como lógica condicional, manejo de estados y interacción con el usuario, todo dentro de un entorno Angular.';
}