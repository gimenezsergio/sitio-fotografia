import assert from 'node:assert/strict';
import test from 'node:test';
import { renderizarPortada } from '../js/portada.js';

function crearDocumentoDePrueba() {
  return {
    createElement(etiqueta) {
      assert.equal(etiqueta, 'img');
      return {
        style: { valores: {}, setProperty(nombre, valor) { this.valores[nombre] = valor; } },
      };
    },
  };
}

function crearContenedorDePrueba() {
  return {
    atributosEliminados: [],
    removeAttribute(nombre) { this.atributosEliminados.push(nombre); },
    replaceChildren(...hijos) { this.hijos = hijos; },
  };
}

test('renderiza la portada con texto alternativo, dimensiones, prioridad y encuadres', () => {
  const contenedor = crearContenedorDePrueba();
  const fotografias = [
    { id: 'portada', archivo: '/images/portada/portada.webp', alt: 'Modelo frente a un arco', composicion: 'portada', ancho: 1800, alto: 2400, posicionMovil: '50% 35%', posicionEscritorio: '45% 50%' },
    { id: 'foto-01', composicion: 'ancho-completo' },
  ];

  assert.equal(renderizarPortada(fotografias, contenedor, crearDocumentoDePrueba()), true);
  const imagen = contenedor.hijos[0];
  assert.equal(imagen.src, '/images/portada/portada.webp');
  assert.equal(imagen.alt, 'Modelo frente a un arco');
  assert.equal(imagen.width, 1800);
  assert.equal(imagen.height, 2400);
  assert.equal(imagen.loading, 'eager');
  assert.equal(imagen.fetchPriority, 'high');
  assert.deepEqual(imagen.style.valores, { '--posicion-movil': '50% 35%', '--posicion-escritorio': '45% 50%' });
  assert.deepEqual(contenedor.atributosEliminados, ['role', 'aria-label']);
});

test('conserva el marcador cuando todavía no hay una portada configurada', () => {
  const contenedor = crearContenedorDePrueba();
  assert.equal(renderizarPortada([], contenedor, crearDocumentoDePrueba()), false);
  assert.equal(contenedor.hijos, undefined);
});
