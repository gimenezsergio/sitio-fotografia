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
  assert.match(html, /src="\/js\/main\.js"/);
  assert.match(html, /Fotografía de moda y editorial/);
});

test('la página y sus recursos responden por HTTP con tipos correctos', async () => {
  const recursos = [
    ['/', 'text/html'],
    ['/css/styles.css', 'text/css'],
    ['/css/responsive.css', 'text/css'],
    ['/js/main.js', 'text/javascript'],
    ['/data/fotografias.json', 'application/json'],
  ];

  for (const [ruta, tipo] of recursos) {
    const respuesta = await fetch(`${origen}${ruta}`);
    assert.equal(respuesta.status, 200, ruta);
    assert.match(respuesta.headers.get('content-type'), new RegExp(tipo));
  }
});

test('el servidor responde 404 a archivos inexistentes y 405 a métodos no admitidos', async () => {
  const inexistente = await fetch(`${origen}/no-existe`);
  assert.equal(inexistente.status, 404);

  const noPermitido = await fetch(origen, { method: 'POST' });
  assert.equal(noPermitido.status, 405);
});
