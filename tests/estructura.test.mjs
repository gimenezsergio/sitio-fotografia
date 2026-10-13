import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
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
  assert.match(html, /<meta name="description" content="SER\. — Fotografía de moda y editorial en Buenos Aires, Argentina\.">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/byser\.com\.ar\/">/);
  assert.match(html, /<meta property="og:type" content="website">/);
  assert.match(html, /<meta property="og:locale" content="es_AR">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/byser\.com\.ar\/">/);
  assert.match(html, /<meta property="og:title" content="SER\. — Fotografía de moda y editorial">/);
  assert.match(html, /<meta property="og:description" content="SER\. — Fotografía de moda y editorial en Buenos Aires, Argentina\.">/);
  assert.match(html, /<meta property="og:image" content="https:\/\/byser\.com\.ar\/images\/ser-open-graph\.png">/);
  assert.match(html, /<meta property="og:image:type" content="image\/png">/);
  assert.match(html, /<meta property="og:image:width" content="1200">/);
  assert.match(html, /<meta property="og:image:height" content="630">/);
  assert.match(html, /<meta property="og:image:alt" content="SER\. — Fotografía de moda y editorial">/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
  assert.match(html, /<meta name="twitter:title" content="SER\. — Fotografía de moda y editorial">/);
  assert.match(html, /<meta name="twitter:description" content="SER\. — Fotografía de moda y editorial en Buenos Aires, Argentina\.">/);
  assert.match(html, /<meta name="twitter:image" content="https:\/\/byser\.com\.ar\/images\/ser-open-graph\.png">/);
  assert.match(html, /<meta name="twitter:image:alt" content="SER\. — Fotografía de moda y editorial">/);
  assert.match(html, /<link rel="icon" type="image\/png" sizes="16x16" href="\/images\/favicon-16\.png">/);
  assert.match(html, /<link rel="icon" type="image\/png" sizes="32x32" href="\/images\/favicon-32\.png">/);
  assert.match(html, /<title>SER\. — Fotografía de moda y editorial<\/title>/);
  assert.match(html, /aria-label="Inicio — SER\."[^>]*>SER\.<\/a>/);
  assert.match(html, /<h1 id="presentacion-titulo">SER\.<\/h1>/);
  assert.match(html, /<p class="sobrelinea">Sobre mí<\/p>\s*<h2 id="presentacion-personal-titulo">Sergio Gimenez<\/h2>/);
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
  assert.match(html, /href="https:\/\/www\.instagram\.com\/sergiogimenezph\/"[^>]*>Instagram<\/a>/);
  assert.doesNotMatch(html, /mailto:|Correo electrónico pendiente de configurar/);
  assert.match(html, /id="aviso-carga" role="status" hidden/);
  assert.match(html, /No se pudieron cargar las fotografías/);

  const galeria = html.match(/<section class="portfolio"[\s\S]*?<\/section>/)?.[0];
  assert.ok(galeria, 'la galería debe estar presente');
  assert.equal((galeria.match(/class="marcador-imagen /g) ?? []).length, 8);
  assert.match(html, /Fotografía de portada pendiente/);
  assert.match(html, /Retrato de Sergio Gimenez sentado frente a un fondo claro/);
  assert.match(html, /<dialog class="lightbox" id="lightbox" aria-label="Visor de fotografías" aria-modal="true">/);
  assert.match(html, /class="lightbox__cerrar" type="button">Cerrar/);
  assert.match(html, /class="lightbox__anterior" type="button">Anterior/);
  assert.match(html, /class="lightbox__siguiente" type="button">Siguiente/);
  assert.match(html, /<img class="lightbox__imagen" alt="">/);
  assert.match(html, /<picture class="presentacion__retrato">/);
  assert.match(html, /src="\/images\/Sergio-Gimenez\.png"/);
  assert.match(html, /alt="Retrato de Sergio Gimenez sentado frente a un fondo claro"/);
  assert.match(html, /width="1024"\s+height="1536"\s+loading="lazy"\s+decoding="async"/);
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
    ['/robots.txt', 'text/plain'],
    ['/sitemap.xml', 'application/xml'],
    ['/images/favicon-16.png', 'image/png'],
    ['/images/favicon-32.png', 'image/png'],
    ['/images/ser-open-graph.png', 'image/png'],
    ['/images/portada/portada.jpg', 'image/jpeg'],
    ['/images/Sergio-Gimenez.png', 'image/png'],
    ['/images/perfil/variantes/sergio-600.webp', 'image/webp'],
    ['/images/perfil/variantes/sergio-900.webp', 'image/webp'],
    ['/images/portfolio/01.jpg', 'image/jpeg'],
    ['/images/portfolio/02.webp', 'image/webp'],
    ['/images/portfolio/04.jpg', 'image/jpeg'],
    ['/images/portfolio/05.jpg', 'image/jpeg'],
    ['/images/portfolio/07.jpg', 'image/jpeg'],
  ];

  const configuracion = JSON.parse(await readFile(new URL('../data/fotografias.json', import.meta.url), 'utf8'));
  for (const fotografia of configuracion.fotografias) {
    if (fotografia.composicion !== 'portada') {
      const extension = fotografia.archivo.split('.').at(-1);
      const tipo = extension === 'webp' ? 'image/webp' : extension === 'png' ? 'image/png' : 'image/jpeg';
      recursos.push([fotografia.archivo, tipo]);
    }
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

  const robots = await fetch(`${origen}/robots.txt`);
  assert.equal(await robots.text(), 'User-agent: *\nAllow: /\nSitemap: https://byser.com.ar/sitemap.xml\n');

  const sitemap = await fetch(`${origen}/sitemap.xml`);
  assert.equal(await sitemap.text(), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://byser.com.ar/</loc>
  </url>
</urlset>
`);
});

test('la configuración de producción define ocho fotos de galería en orden', async () => {
  const contenido = await readFile(new URL('../data/fotografias.json', import.meta.url), 'utf8');
  const fotografias = JSON.parse(contenido).fotografias;
  assert.equal(fotografias.filter((foto) => foto.composicion === 'portada').length, 1);
  assert.deepEqual(fotografias.filter((foto) => foto.composicion !== 'portada').map((foto) => foto.id), [
    'capucha-gris', 'abrigo-claro-arcos', 'flores-fondo-rosa', 'retrato-estudio',
    'moda-urbana-mochila', 'denim-muro-turquesa', 'top-claro-denim', 'retrato-blanco-negro',
  ]);
});

test('las fotos y sus variantes están directamente en una sola carpeta', async () => {
  const contenido = await readFile(new URL('../data/fotografias.json', import.meta.url), 'utf8');
  const fotografias = JSON.parse(contenido).fotografias.filter((foto) => foto.composicion !== 'portada');
  const rutas = fotografias.flatMap((foto) => [foto.archivo, ...(foto.variantes ?? []).map((variante) => variante.archivo)]);
  const entradas = await readdir(new URL('../images/portfolio/', import.meta.url), { withFileTypes: true });

  assert.ok(rutas.every((ruta) => /^\/images\/portfolio\/[^/]+$/.test(ruta)));
  assert.ok(entradas.every((entrada) => entrada.isFile()), 'images/portfolio no debe contener subcarpetas');
});

test('el servidor responde 404 a archivos inexistentes y 405 a métodos no admitidos', async () => {
  const inexistente = await fetch(`${origen}/no-existe`);
  assert.equal(inexistente.status, 404);

  const noPermitido = await fetch(origen, { method: 'POST' });
  assert.equal(noPermitido.status, 405);
});
