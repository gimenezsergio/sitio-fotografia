import { cargarFotografias } from './cargar-fotografias.js';
import { renderizarPortada } from './portada.js';
import { renderizarGaleria } from './gallery.js';

const aviso = document.querySelector('#aviso-carga');

try {
  const fotografias = await cargarFotografias();
  renderizarPortada(fotografias, document.querySelector('.portada__imagen'));
  renderizarGaleria(fotografias, document.querySelector('.portfolio__grilla'));
} catch {
  if (aviso) aviso.hidden = false;
}
