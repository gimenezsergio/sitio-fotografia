import { cargarFotografias } from './cargar-fotografias.js';

const aviso = document.querySelector('#aviso-carga');

try {
  await cargarFotografias();
} catch {
  if (aviso) aviso.hidden = false;
}
