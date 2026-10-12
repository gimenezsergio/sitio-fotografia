/** Renderiza las fotografías de la galería, excluyendo la portada. */
export function renderizarGaleria(fotografias, contenedor, documento = globalThis.document, opciones = {}) {
  if (!Array.isArray(fotografias) || !contenedor || !documento) return 0;

  const imagenes = fotografias
    .filter((fotografia) => fotografia && fotografia.composicion !== 'portada')
    .map((fotografia, indice) => {
      const boton = documento.createElement('button');
      const imagen = documento.createElement('img');

      boton.type = 'button';
      boton.dataset.composicion = fotografia.composicion;
      boton.addEventListener('click', () => opciones.alSeleccionar?.(indice, fotografia));

      imagen.src = fotografia.archivo;
      imagen.alt = fotografia.alt;
      imagen.width = fotografia.ancho;
      imagen.height = fotografia.alto;
      imagen.loading = 'lazy';
      imagen.decoding = 'async';
      boton.append(imagen);
      return boton;
    });

  contenedor.replaceChildren(...imagenes);
  return imagenes.length;
}
