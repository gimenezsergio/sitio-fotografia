/**
 * Vincula el visor nativo con una secuencia de fotografías de galería.
 * No administra foco, desplazamiento de fondo ni gestos: corresponden al paso 10.
 */
export function crearControladorLightbox({
  dialogo,
  imagen,
  botonAnterior,
  botonSiguiente,
  botonCerrar,
  fotografias,
  documento = globalThis.document,
} = {}) {
  if (!dialogo || !imagen || !botonAnterior || !botonSiguiente || !botonCerrar || !Array.isArray(fotografias)) {
    return null;
  }

  let indiceActivo = -1;

  function actualizarControles() {
    botonAnterior.disabled = indiceActivo <= 0;
    botonSiguiente.disabled = indiceActivo >= fotografias.length - 1;
  }

  function mostrar(indice) {
    const fotografia = fotografias[indice];
    if (!fotografia) return false;

    indiceActivo = indice;
    imagen.src = fotografia.archivo;
    imagen.alt = fotografia.alt;
    imagen.width = fotografia.ancho;
    imagen.height = fotografia.alto;
    actualizarControles();
    return true;
  }

  function abrir(indice) {
    if (!mostrar(indice)) return false;
    if (!dialogo.open) dialogo.showModal();
    return true;
  }

  function cerrar() {
    if (dialogo.open) dialogo.close();
  }

  function navegar(desplazamiento) {
    const destino = indiceActivo + desplazamiento;
    if (destino < 0 || destino >= fotografias.length) return false;
    return mostrar(destino);
  }

  function manejarTecla(evento) {
    if (!dialogo.open) return;

    if (evento.key === 'ArrowLeft') {
      evento.preventDefault();
      navegar(-1);
    }

    if (evento.key === 'ArrowRight') {
      evento.preventDefault();
      navegar(1);
    }

    if (evento.key === 'Escape') {
      evento.preventDefault();
      cerrar();
    }
  }

  const alCancelar = (evento) => {
    evento.preventDefault();
    cerrar();
  };

  botonAnterior.addEventListener('click', () => navegar(-1));
  botonSiguiente.addEventListener('click', () => navegar(1));
  botonCerrar.addEventListener('click', cerrar);
  dialogo.addEventListener('cancel', alCancelar);
  documento?.addEventListener('keydown', manejarTecla);

  return {
    abrir,
    cerrar,
    navegar,
    manejarTecla,
    get indiceActivo() {
      return indiceActivo;
    },
  };
}
