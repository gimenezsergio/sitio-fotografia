import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { crearControladorLightbox } from '../js/lightbox.js';

const estilos = await readFile(new URL('../css/lightbox.css', import.meta.url), 'utf8');

function crearElemento() {
  const escuchas = new Map();
  return {
    disabled: false,
    addEventListener(tipo, controlador) {
      escuchas.set(tipo, controlador);
    },
    activar(tipo = 'click') {
      const evento = { impedido: false, preventDefault() { this.impedido = true; } };
      escuchas.get(tipo)?.(evento);
      return evento;
    },
  };
}

function crearDialogo() {
  const dialogo = crearElemento();
  dialogo.open = false;
  dialogo.showModal = function showModal() {
    this.open = true;
  };
  dialogo.close = function close() {
    this.open = false;
  };
  return dialogo;
}

function crearDocumento() {
  const escuchas = new Map();
  return {
    addEventListener(tipo, controlador) {
      escuchas.set(tipo, controlador);
    },
    tecla(key) {
      const evento = { key, impedido: false, preventDefault() { this.impedido = true; } };
      escuchas.get('keydown')?.(evento);
      return evento;
    },
  };
}

function crearFotografias() {
  return [
    { archivo: '/images/portfolio/01.jpg', alt: 'Primera fotografía', ancho: 1440, alto: 1920 },
    { archivo: '/images/portfolio/02.jpg', alt: 'Segunda fotografía', ancho: 1440, alto: 1800 },
    { archivo: '/images/portfolio/03.jpg', alt: 'Tercera fotografía', ancho: 894, alto: 1192 },
  ];
}

function crearVisor() {
  const documento = crearDocumento();
  const dialogo = crearDialogo();
  const imagen = {};
  const botonAnterior = crearElemento();
  const botonSiguiente = crearElemento();
  const botonCerrar = crearElemento();
  const controlador = crearControladorLightbox({
    dialogo,
    imagen,
    botonAnterior,
    botonSiguiente,
    botonCerrar,
    fotografias: crearFotografias(),
    documento,
  });
  return { controlador, dialogo, imagen, botonAnterior, botonSiguiente, botonCerrar, documento };
}

test('abre la fotografía elegida y refleja los límites en los controles', () => {
  const { controlador, dialogo, imagen, botonAnterior, botonSiguiente } = crearVisor();

  assert.equal(controlador.abrir(0), true);
  assert.equal(dialogo.open, true);
  assert.equal(imagen.src, '/images/portfolio/01.jpg');
  assert.equal(imagen.alt, 'Primera fotografía');
  assert.equal(imagen.width, 1440);
  assert.equal(imagen.height, 1920);
  assert.equal(botonAnterior.disabled, true);
  assert.equal(botonSiguiente.disabled, false);
  assert.equal(controlador.indiceActivo, 0);
});

test('los controles y las flechas recorren la secuencia sin salir de sus límites', () => {
  const { controlador, imagen, botonAnterior, botonSiguiente, documento } = crearVisor();
  controlador.abrir(1);

  botonAnterior.activar();
  assert.equal(imagen.src, '/images/portfolio/01.jpg');
  assert.equal(botonAnterior.disabled, true);

  const flechaDerecha = documento.tecla('ArrowRight');
  assert.equal(flechaDerecha.impedido, true);
  assert.equal(imagen.src, '/images/portfolio/02.jpg');
  assert.equal(botonSiguiente.disabled, false);

  botonSiguiente.activar();
  assert.equal(imagen.src, '/images/portfolio/03.jpg');
  assert.equal(botonSiguiente.disabled, true);
  assert.equal(controlador.navegar(1), false);
  assert.equal(imagen.src, '/images/portfolio/03.jpg');
});

test('cierra con el botón, Escape y el evento cancel nativo', () => {
  const { controlador, dialogo, botonCerrar, documento } = crearVisor();
  controlador.abrir(1);
  botonCerrar.activar();
  assert.equal(dialogo.open, false);

  controlador.abrir(1);
  const escape = documento.tecla('Escape');
  assert.equal(escape.impedido, true);
  assert.equal(dialogo.open, false);

  controlador.abrir(1);
  const cancelacion = dialogo.activar('cancel');
  assert.equal(cancelacion.impedido, true);
  assert.equal(dialogo.open, false);
});

test('rechaza una apertura sin una fotografía válida', () => {
  const { controlador, dialogo } = crearVisor();
  assert.equal(controlador.abrir(-1), false);
  assert.equal(controlador.abrir(3), false);
  assert.equal(dialogo.open, false);
  assert.equal(crearControladorLightbox(), null);
});

test('el visor conserva la imagen completa sobre el fondo oscuro', () => {
  assert.match(estilos, /\.lightbox\s*\{[\s\S]*background:\s*var\(--color-fondo-lightbox\)/);
  assert.match(estilos, /\.lightbox__imagen\s*\{[\s\S]*object-fit:\s*contain/);
});
