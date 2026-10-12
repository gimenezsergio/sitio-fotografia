/** Lee la configuración fotográfica y devuelve su lista ordenada. */
export async function cargarFotografias(url = '/data/fotografias.json', obtener = fetch) {
  const respuesta = await obtener(url);
  if (!respuesta.ok) {
    throw new Error(`La configuración respondió con estado ${respuesta.status}.`);
  }

  const configuracion = await respuesta.json();
  if (!configuracion || typeof configuracion !== 'object' || !Array.isArray(configuracion.fotografias)) {
    throw new Error('La configuración no contiene una lista de fotografías válida.');
  }

  return configuracion.fotografias;
}
