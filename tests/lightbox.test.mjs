import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { crearControladorLightbox } from '../js/lightbox.js';

const estilos = await readFile(new URL('../css/lightbox.css', import.meta.url), 'utf8');

function crearElemento(documento) {
  const escuchas = new Map();
  return {
    disabled: false,
    addEventListener(tipo, controlador) {
      escuchas.set(tipo, controlador);
    },
    focus() {
      documento.activeElement = this;
    },
    activar(tipo = 'click', propiedades = {}) {
      const evento = {
        ...propiedades,
        impedido: false,
        preventDefault() { this.impedido = true; },
      };
      escuchas.get(tipo)?.(evento);
      return evento;
    },
  };
}

function crearDialogo(documento) {
  const dialogo = crearElemento(documento);
  dialogo.open = false;
  dialogo.showModal = function showModal() {
    this.open = true;
  };
  dialogo.close = function close() {
    this.open = false;
    this.activar('close');
  };
  return dialogo;
}

function crearDocumento() {
  const escuchas = new Map();
  return {
    activeElement: null,
    body: { style: { overflow: 'auto' } },
    addEventListener(tipo, controlador) {
      escuchas.set(tipo, controlador);
    },
    tecla(key, propiedades = {}) {
      const evento = {
        key,
        ...propiedades,
        impedido: false,
        preventDefault() { this.impedido = true; },
      };
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
  const dialogo = crearDialogo(documento);
  const imagen = crearElemento(documento);
  const botonAnterior = crearElemento(documento);
  const botonSiguiente = crearElemento(documento);
  const botonCerrar = crearElemento(documento);
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

test('lleva el foco al visor, lo contiene con Tab y lo restaura al activador', () => {
  const { controlador, botonCerrar, botonAnterior, botonSiguiente, documento } = crearVisor();
  const activador = crearElemento(documento);
  activador.focus();

  controlador.abrir(1);
  assert.equal(documento.activeElement, botonCerrar);

  const retroceso = documento.tecla('Tab', { shiftKey: true });
  assert.equal(retroceso.impedido, true);
  assert.equal(documento.activeElement, botonSiguiente);

  const avance = documento.tecla('Tab');
  assert.equal(avance.impedido, true);
  assert.equal(documento.activeElement, botonCerrar);

  botonAnterior.focus();
  controlador.cerrar();
  assert.equal(documento.activeElement, activador);
});

test('bloquea el desplazamiento de fondo y lo restaura al cerrar o cancelar', () => {
  const { controlador, dialogo, documento } = crearVisor();

  controlador.abrir(0);
  assert.equal(documento.body.style.overflow, 'hidden');
  controlador.cerrar();
  assert.equal(documento.body.style.overflow, 'auto');

  controlador.abrir(0);
  const cancelacion = dialogo.activar('cancel');
  assert.equal(cancelacion.impedido, true);
  assert.equal(documento.body.style.overflow, 'auto');
});

test('navega con deslizamientos horizontales y descarta gestos verticales o cortos', () => {
  const { controlador, imagen } = crearVisor();
  controlador.abrir(1);

  imagen.activar('pointerdown', { pointerId: 1, clientX: 240, clientY: 120, isPrimary: true });
  const haciaSiguiente = imagen.activar('pointerup', { pointerId: 1, clientX: 150, clientY: 130 });
  assert.equal(haciaSiguiente.impedido, true);
  assert.equal(controlador.indiceActivo, 2);

  imagen.activar('pointerdown', { pointerId: 2, clientX: 150, clientY: 120, isPrimary: true });
  imagen.activar('pointerup', { pointerId: 2, clientX: 230, clientY: 130 });
  assert.equal(controlador.indiceActivo, 1);

  imagen.activar('pointerdown', { pointerId: 3, clientX: 200, clientY: 100, isPrimary: true });
  const vertical = imagen.activar('pointerup', { pointerId: 3, clientX: 100, clientY: 260 });
  assert.equal(vertical.impedido, false);
  assert.equal(controlador.indiceActivo, 1);

  imagen.activar('pointerdown', { pointerId: 4, clientX: 200, clientY: 100, isPrimary: true });
  imagen.activar('pointerup', { pointerId: 4, clientX: 165, clientY: 100 });
  assert.equal(controlador.indiceActivo, 1);
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
  assert.match(estilos, /\.lightbox__imagen\s*\{[\s\S]*touch-action:\s*pan-y/);
});
