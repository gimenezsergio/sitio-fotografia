import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { validarFotografias } from '../scripts/validar-fotografias.mjs';

async function prepararProyectoTemporal() {
  const raiz = await mkdtemp(path.join(os.tmpdir(), 'portfolio-fotos-'));
  await mkdir(path.join(raiz, 'images'), { recursive: true });
  for (const nombre of ['portada.webp', 'uno.jpg', 'dos.jpg', 'tres.jpg', 'mini.webp']) {
    await writeFile(path.join(raiz, 'images', nombre), 'imagen de prueba');
  }
  return raiz;
}

function crearConfiguracion() {
  return {
    fotografias: [
      { id: 'portada', archivo: '/images/portada.webp', alt: 'Modelo frente a un arco', composicion: 'portada', ancho: 1800, alto: 2400, posicionMovil: '50% 40%', posicionEscritorio: '50% 50%' },
      { id: 'uno', archivo: '/images/uno.jpg', alt: 'Retrato con abrigo', composicion: 'ancho-completo', ancho: 1200, alto: 1600 },
      { id: 'dos', archivo: '/images/dos.jpg', alt: 'Retrato de perfil', composicion: 'pareja-izquierda', ancho: 900, alto: 1200 },
      { id: 'tres', archivo: '/images/tres.jpg', alt: 'Retrato junto a una pared', composicion: 'pareja-derecha', ancho: 900, alto: 1200 },
    ],
  };
}

test('acepta una configuración completa con portada, dimensiones y pareja', async (t) => {
  const raiz = await prepararProyectoTemporal();
  t.after(() => rm(raiz, { recursive: true, force: true }));
  assert.deepEqual(validarFotografias(crearConfiguracion(), raiz), []);
});

test('rechaza configuración vacía, identificadores repetidos y archivos ausentes', async (t) => {
  const raiz = await prepararProyectoTemporal();
  t.after(() => rm(raiz, { recursive: true, force: true }));
  const configuracion = crearConfiguracion();
  configuracion.fotografias[1].id = 'portada';
  configuracion.fotografias[1].archivo = '/images/no-existe.jpg';
  const errores = validarFotografias({ fotografias: [] }, raiz).join('\n') + validarFotografias(configuracion, raiz).join('\n');
  assert.match(errores, /agregá una portada/);
  assert.match(errores, /está repetido/);
  assert.match(errores, /no existe el archivo/);
});

test('rechaza composiciones inválidas, portada faltante o duplicada y parejas incompletas', async (t) => {
  const raiz = await prepararProyectoTemporal();
  t.after(() => rm(raiz, { recursive: true, force: true }));
  const configuracion = crearConfiguracion();
  configuracion.fotografias[0].composicion = 'vertical-destacada';
  configuracion.fotografias[1].composicion = 'pareja-izquierda';
  configuracion.fotografias[2].composicion = 'pareja-derecha';
  configuracion.fotografias[3].composicion = 'panorama';
  let errores = validarFotografias(configuracion, raiz).join('\n');
  assert.match(errores, /composición inválida/);
  assert.match(errores, /exactamente una portada/);

  const parejaIncompleta = crearConfiguracion();
  parejaIncompleta.fotografias[2].composicion = 'pareja-izquierda';
  parejaIncompleta.fotografias[3].composicion = 'ancho-completo';
  errores = validarFotografias(parejaIncompleta, raiz).join('\n');
  assert.match(errores, /pareja derecha/);

  const parejaInvertida = crearConfiguracion();
  parejaInvertida.fotografias[2].composicion = 'pareja-derecha';
  errores = validarFotografias(parejaInvertida, raiz).join('\n');
  assert.match(errores, /precedida por su pareja izquierda/);

  const dosPortadas = crearConfiguracion();
  dosPortadas.fotografias[1].composicion = 'portada';
  errores = validarFotografias(dosPortadas, raiz).join('\n');
  assert.match(errores, /exactamente una portada; se encontraron 2/);
});

test('valida descripciones, dimensiones, encuadres y variantes responsive', async (t) => {
  const raiz = await prepararProyectoTemporal();
  t.after(() => rm(raiz, { recursive: true, force: true }));
  const configuracion = crearConfiguracion();
  configuracion.fotografias[0].alt = ' ';
  configuracion.fotografias[0].ancho = 1000;
  configuracion.fotografias[0].alto = 0;
  configuracion.fotografias[0].posicionMovil = '101% 50%';
  configuracion.fotografias[0].variantes = [
    { archivo: '/images/mini.webp', ancho: 800 },
    { archivo: '/images/uno.jpg', ancho: 800 },
    { archivo: '/images/no-existe.webp', ancho: 1900 },
  ];
  configuracion.fotografias[1].posicionMovil = '50% 50%';
  const errores = validarFotografias(configuracion, raiz).join('\n');
  assert.match(errores, /descripción alternativa/);
  assert.match(errores, /números enteros positivos/);
  assert.match(errores, /dos porcentajes entre 0% y 100%/);
  assert.match(errores, /este encuadre solo corresponde a la portada/);
  assert.match(errores, /no repitas el ancho/);
  assert.match(errores, /debe ser menor que el ancho/);
  assert.match(errores, /no existe el archivo/);
});

test('rechaza rutas fuera del directorio de imágenes', async (t) => {
  const raiz = await prepararProyectoTemporal();
  t.after(() => rm(raiz, { recursive: true, force: true }));
  const configuracion = crearConfiguracion();
  configuracion.fotografias[0].archivo = '/images/../README.md';
  assert.match(validarFotografias(configuracion, raiz).join('\n'), /permanecer dentro de images/);
});
