import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, before, test } from 'node:test';
import { crearServidorLocal } from '../scripts/servidor-local.mjs';

const servidor = crearServidorLocal();
let origen;

before(async () => {
  await new Promise((resolver, rechazar) => {
    servidor.once('error', rechazar);
    servidor.listen(0, '127.0.0.1', resolver);
  });
  origen = `http://127.0.0.1:${servidor.address().port}`;
});

after(async () => {
  if (!servidor.listening) return;
  await new Promise((resolver, rechazar) => servidor.close((error) => error ? rechazar(error) : resolver()));
});

test('el HTML declara castellano argentino y referencias locales existentes', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<html lang="es-AR">/);
  assert.match(html, /href="\/css\/styles\.css"/);
  assert.match(html, /href="\/css\/responsive\.css"/);
  assert.match(html, /href="\/css\/lightbox\.css"/);
  assert.match(html, /src="\/js\/main\.js"/);
  assert.match(html, /Fotografía de moda y editorial/);
  assert.match(html, /href="#contacto"/);
  assert.match(html, /id="contacto"/);
  assert.match(html, /class="portada"/);
  assert.match(html, /class="presentacion"/);
  assert.match(html, /class="contacto"/);
  assert.match(html, /id="aviso-carga" role="status" hidden/);
  assert.match(html, /No se pudieron cargar las fotografías/);

  const galeria = html.match(/<section class="portfolio"[\s\S]*?<\/section>/)?.[0];
  assert.ok(galeria, 'la galería debe estar presente');
  assert.equal((galeria.match(/class="marcador-imagen /g) ?? []).length, 8);
  assert.match(html, /Fotografía de portada pendiente/);
  assert.match(html, /Retrato pendiente/);
  assert.match(html, /<dialog class="lightbox" id="lightbox" aria-label="Visor de fotografías" aria-modal="true">/);
  assert.match(html, /class="lightbox__cerrar" type="button">Cerrar/);
  assert.match(html, /class="lightbox__anterior" type="button">Anterior/);
  assert.match(html, /class="lightbox__siguiente" type="button">Siguiente/);
  assert.match(html, /<img class="lightbox__imagen" alt="">/);
});

test('la página y sus recursos responden por HTTP con tipos correctos', async () => {
  const recursos = [
    ['/', 'text/html'],
    ['/css/styles.css', 'text/css'],
    ['/css/responsive.css', 'text/css'],
    ['/css/lightbox.css', 'text/css'],
    ['/js/main.js', 'text/javascript'],
    ['/js/gallery.js', 'text/javascript'],
    ['/js/lightbox.js', 'text/javascript'],
    ['/data/fotografias.json', 'application/json'],
    ['/images/portada/portada.jpg', 'image/jpeg'],
    ['/images/portfolio/01.jpg', 'image/jpeg'],
    ['/images/portfolio/02.webp', 'image/webp'],
    ['/images/portfolio/03.jpg', 'image/jpeg'],
    ['/images/portfolio/04.jpg', 'image/jpeg'],
    ['/images/portfolio/05.jpg', 'image/jpeg'],
    ['/images/portfolio/06.jpg', 'image/jpeg'],
    ['/images/portfolio/07.jpg', 'image/jpeg'],
    ['/images/portfolio/08.jpg', 'image/jpeg'],
  ];

  const configuracion = JSON.parse(await readFile(new URL('../data/fotografias.json', import.meta.url), 'utf8'));
  for (const fotografia of configuracion.fotografias) {
    for (const variante of fotografia.variantes ?? []) {
      const extension = variante.archivo.split('.').at(-1);
      recursos.push([variante.archivo, extension === 'webp' ? 'image/webp' : 'image/jpeg']);
    }
  }

  for (const [ruta, tipo] of recursos) {
    const respuesta = await fetch(`${origen}${ruta}`);
    assert.equal(respuesta.status, 200, ruta);
    assert.match(respuesta.headers.get('content-type'), new RegExp(tipo));
  }
});

test('la configuración de producción define ocho fotos de galería en orden', async () => {
  const contenido = await readFile(new URL('../data/fotografias.json', import.meta.url), 'utf8');
  const fotografias = JSON.parse(contenido).fotografias;
  assert.equal(fotografias.filter((foto) => foto.composicion === 'portada').length, 1);
  assert.deepEqual(fotografias.filter((foto) => foto.composicion !== 'portada').map((foto) => foto.id), [
    'capucha-gris', 'abrigo-claro-arcos', 'conjunto-falda-marron', 'retrato-estudio',
    'retrato-muro-azul', 'abrigo-gris-muro', 'top-claro-denim', 'conjunto-negro-muro',
  ]);
});

test('el servidor responde 404 a archivos inexistentes y 405 a métodos no admitidos', async () => {
  const inexistente = await fetch(`${origen}/no-existe`);
  assert.equal(inexistente.status, 404);

  const noPermitido = await fetch(origen, { method: 'POST' });
  assert.equal(noPermitido.status, 405);
});
