/** Inserta la portada configurada y devuelve si encontró una. */
export function renderizarPortada(fotografias, contenedor, documento = document) {
  const portada = fotografias.find((fotografia) => fotografia.composicion === 'portada');
  if (!portada || !contenedor) return false;

  const imagen = documento.createElement('img');
  imagen.src = portada.archivo;
  imagen.alt = portada.alt;
  imagen.width = portada.ancho;
  imagen.height = portada.alto;
  imagen.loading = 'eager';
  imagen.fetchPriority = 'high';

  if (portada.posicionMovil) imagen.style.setProperty('--posicion-movil', portada.posicionMovil);
  if (portada.posicionEscritorio) imagen.style.setProperty('--posicion-escritorio', portada.posicionEscritorio);

  contenedor.removeAttribute('role');
  contenedor.removeAttribute('aria-label');
  contenedor.replaceChildren(imagen);
  return true;
}
