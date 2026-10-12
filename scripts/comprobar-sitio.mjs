import assert from 'node:assert/strict';
import { crearServidorLocal } from './servidor-local.mjs';

const servidor = crearServidorLocal();

try {
  await new Promise((resolver, rechazar) => {
    servidor.once('error', rechazar);
    servidor.listen(0, '127.0.0.1', resolver);
  });

  const { port } = servidor.address();
  for (const ruta of ['/', '/css/styles.css', '/js/main.js', '/data/fotografias.json']) {
    const respuesta = await fetch(`http://127.0.0.1:${port}${ruta}`);
    assert.equal(respuesta.status, 200, `${ruta} debe responder 200`);
    assert.ok((await respuesta.text()).length > 0, `${ruta} no debe estar vacío`);
    process.stdout.write(`OK ${ruta}\n`);
  }
} finally {
  if (servidor.listening) {
    await new Promise((resolver, rechazar) => servidor.close((error) => error ? rechazar(error) : resolver()));
  }
}
