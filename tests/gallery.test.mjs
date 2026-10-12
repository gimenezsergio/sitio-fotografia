import assert from 'node:assert/strict';
import test from 'node:test';
import { renderizarGaleria } from '../js/gallery.js';

function crearElemento(etiqueta) {
  const escuchas = new Map();
  return {
    etiqueta,
    dataset: {},
    addEventListener(tipo, controlador) {
      escuchas.set(tipo, controlador);
    },
    append(...hijos) {
      this.hijos = hijos;
    },
    hacerClick() {
      escuchas.get('click')?.();
    },
  };
}

function crearDocumentoDePrueba() {
  return {
    createElement: crearElemento,
  };
}

function crearContenedorDePrueba() {
  return {
    replaceChildren(...hijos) {
      this.hijos = hijos;
    },
  };
}

function crearFotografia(id, composicion = 'ancho-completo') {
  return {
    id,
    archivo: `/images/${id}.webp`,
    alt: `Fotografía ${id}`,
    composicion,
    ancho: 1800,
    alto: 1200,
  };
}

test('renderiza botones de galería en el orden recibido y excluye la portada', () => {
  const contenedor = crearContenedorDePrueba();
  const fotografias = [
    crearFotografia('foto-02'),
    crearFotografia('portada', 'portada'),
    crearFotografia('foto-01', 'vertical-destacada'),
  ];

  assert.equal(renderizarGaleria(fotografias, contenedor, crearDocumentoDePrueba()), 2);
  assert.deepEqual(contenedor.hijos.map((boton) => boton.hijos[0].src), ['/images/foto-02.webp', '/images/foto-01.webp']);
  assert.deepEqual(contenedor.hijos.map((boton) => boton.etiqueta), ['button', 'button']);
  assert.deepEqual(contenedor.hijos.map((boton) => boton.type), ['button', 'button']);
});

test('expone la composición en el botón sin cambiar el orden de la galería', () => {
  const contenedor = crearContenedorDePrueba();
  const composiciones = [
    'ancho-completo',
    'vertical-destacada',
    'pareja-izquierda',
    'pareja-derecha',
    'desplazada-izquierda',
    'desplazada-derecha',
  ];
  const fotografias = composiciones.map((composicion, indice) => crearFotografia(`foto-${indice + 1}`, composicion));

  renderizarGaleria(fotografias, contenedor, crearDocumentoDePrueba());

  assert.deepEqual(contenedor.hijos.map((boton) => boton.hijos[0].src), fotografias.map((fotografia) => fotografia.archivo));
  assert.deepEqual(contenedor.hijos.map((boton) => boton.dataset.composicion), composiciones);
});

test('mantiene alt, dimensiones y carga diferida en la imagen del botón', () => {
  const contenedor = crearContenedorDePrueba();
  const fotografia = { ...crearFotografia('foto-horizontal'), ancho: 2400, alto: 1600 };

  renderizarGaleria([fotografia], contenedor, crearDocumentoDePrueba());
  const imagen = contenedor.hijos[0].hijos[0];
  assert.equal(imagen.alt, 'Fotografía foto-horizontal');
  assert.equal(imagen.width, 2400);
  assert.equal(imagen.height, 1600);
  assert.equal(imagen.loading, 'lazy');
  assert.equal(imagen.decoding, 'async');
  assert.equal(imagen.style, undefined);
});

test('notifica el índice de galería correspondiente cuando se activa cada foto', () => {
  const contenedor = crearContenedorDePrueba();
  const activaciones = [];
  const fotografias = [crearFotografia('foto-01'), crearFotografia('portada', 'portada'), crearFotografia('foto-02')];

  renderizarGaleria(fotografias, contenedor, crearDocumentoDePrueba(), {
    alSeleccionar(indice, fotografia) {
      activaciones.push([indice, fotografia.id]);
    },
  });

  contenedor.hijos[0].hacerClick();
  contenedor.hijos[1].hacerClick();
  assert.deepEqual(activaciones, [[0, 'foto-01'], [1, 'foto-02']]);
});

test('vacía el contenedor y devuelve cero cuando la lista no tiene fotografías de galería', () => {
  const contenedor = crearContenedorDePrueba();
  assert.equal(renderizarGaleria([], contenedor, crearDocumentoDePrueba()), 0);
  assert.deepEqual(contenedor.hijos, []);
  assert.equal(renderizarGaleria([crearFotografia('portada', 'portada')], contenedor, crearDocumentoDePrueba()), 0);
  assert.deepEqual(contenedor.hijos, []);
});

test('no falla ni modifica nada cuando falta el contenedor', () => {
  const fotografias = [crearFotografia('foto-01')];
  assert.equal(renderizarGaleria(fotografias, null), 0);
});
