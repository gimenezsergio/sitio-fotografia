/** Renderiza las fotografías de la galería, excluyendo la portada. */
export function renderizarGaleria(fotografias, contenedor, documento = globalThis.document) {
  if (!Array.isArray(fotografias) || !contenedor || !documento) return 0;

  const imagenes = fotografias
    .filter((fotografia) => fotografia && fotografia.composicion !== 'portada')
    .map((fotografia) => {
      const imagen = documento.createElement('img');
      imagen.src = fotografia.archivo;
      imagen.alt = fotografia.alt;
      imagen.width = fotografia.ancho;
      imagen.height = fotografia.alto;
      imagen.loading = 'lazy';
      imagen.decoding = 'async';
      imagen.dataset.composicion = fotografia.composicion;
      return imagen;
    });

  contenedor.replaceChildren(...imagenes);
  return imagenes.length;
}
