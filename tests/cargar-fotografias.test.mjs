import assert from 'node:assert/strict';
import test from 'node:test';
import { cargarFotografias } from '../js/cargar-fotografias.js';

test('devuelve la lista del JSON cuando la respuesta HTTP es correcta', async () => {
  const fotos = [{ id: 'portada' }];
  const obtener = async (url) => {
    assert.equal(url, '/data/fotografias.json');
    return { ok: true, json: async () => ({ fotografias: fotos }) };
  };
  assert.equal(await cargarFotografias(undefined, obtener), fotos);
});

test('rechaza respuestas HTTP fallidas', async () => {
  await assert.rejects(
    cargarFotografias('/datos.json', async () => ({ ok: false, status: 404 })),
    /estado 404/,
  );
});

test('rechaza JSON sin una lista de fotografías', async () => {
  await assert.rejects(
    cargarFotografias('/datos.json', async () => ({ ok: true, json: async () => ({ imagenes: [] }) })),
    /lista de fotografías válida/,
  );
});

test('propaga errores de red y de análisis JSON', async () => {
  await assert.rejects(cargarFotografias('/datos.json', async () => { throw new Error('sin conexión'); }), /sin conexión/);
  await assert.rejects(cargarFotografias('/datos.json', async () => ({ ok: true, json: async () => { throw new Error('JSON inválido'); } })), /JSON inválido/);
});
