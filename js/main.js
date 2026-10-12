import { cargarFotografias } from './cargar-fotografias.js';
import { renderizarPortada } from './portada.js';

const aviso = document.querySelector('#aviso-carga');

try {
  const fotografias = await cargarFotografias();
  renderizarPortada(fotografias, document.querySelector('.portada__imagen'));
} catch {
  if (aviso) aviso.hidden = false;
}
