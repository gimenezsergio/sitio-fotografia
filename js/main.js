import { cargarFotografias } from './cargar-fotografias.js';
import { renderizarPortada } from './portada.js';
import { renderizarGaleria } from './gallery.js';
import { crearControladorLightbox } from './lightbox.js';

const aviso = document.querySelector('#aviso-carga');

try {
  const fotografias = await cargarFotografias();
  renderizarPortada(fotografias, document.querySelector('.portada__imagen'));
  const fotosGaleria = fotografias.filter((fotografia) => fotografia.composicion !== 'portada');
  const lightbox = crearControladorLightbox({
    dialogo: document.querySelector('#lightbox'),
    imagen: document.querySelector('.lightbox__imagen'),
    botonAnterior: document.querySelector('.lightbox__anterior'),
    botonSiguiente: document.querySelector('.lightbox__siguiente'),
    botonCerrar: document.querySelector('.lightbox__cerrar'),
    fotografias: fotosGaleria,
  });

  renderizarGaleria(fotografias, document.querySelector('.portfolio__grilla'), document, {
    alSeleccionar: (indice) => lightbox?.abrir(indice),
  });
} catch {
  if (aviso) aviso.hidden = false;
}
