/**
 * Vincula el visor nativo con una secuencia de fotografías de galería.
 * Incluye foco, desplazamiento de fondo y gestos para completar el uso accesible.
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
  let activador = null;
  let overflowAnterior = null;
  let inicioPuntero = null;

  const umbralDeslizamiento = 48;

  function obtenerControlesConFoco() {
    return [botonCerrar, botonAnterior, botonSiguiente]
      .filter((control) => !control.disabled && typeof control.focus === 'function');
  }

  function moverFoco(control) {
    control?.focus?.();
  }

  function bloquearDesplazamiento() {
    const cuerpo = documento?.body;
    if (!cuerpo?.style || overflowAnterior !== null) return;

    overflowAnterior = cuerpo.style.overflow;
    cuerpo.style.overflow = 'hidden';
  }

  function restaurarDesplazamiento() {
    const cuerpo = documento?.body;
    if (!cuerpo?.style || overflowAnterior === null) return;

    cuerpo.style.overflow = overflowAnterior;
    overflowAnterior = null;
  }

  function finalizarCierre() {
    restaurarDesplazamiento();

    const focoArestaurar = activador;
    activador = null;
    moverFoco(focoArestaurar);
  }

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

    if (!dialogo.open) {
      activador = documento?.activeElement ?? null;
      bloquearDesplazamiento();
      dialogo.showModal();
      moverFoco(botonCerrar);
    }

    return true;
  }

  function cerrar() {
    if (!dialogo.open) return;

    dialogo.close();
    finalizarCierre();
  }

  function navegar(desplazamiento) {
    const destino = indiceActivo + desplazamiento;
    if (destino < 0 || destino >= fotografias.length) return false;
    return mostrar(destino);
  }

  function manejarTecla(evento) {
    if (!dialogo.open) return;

    if (evento.key === 'Tab') {
      const controles = obtenerControlesConFoco();
      if (controles.length === 0) return;

      const primerControl = controles[0];
      const ultimoControl = controles[controles.length - 1];
      const focoActual = documento?.activeElement;

      if (evento.shiftKey && (focoActual === primerControl || !controles.includes(focoActual))) {
        evento.preventDefault();
        moverFoco(ultimoControl);
      } else if (!evento.shiftKey && (focoActual === ultimoControl || !controles.includes(focoActual))) {
        evento.preventDefault();
        moverFoco(primerControl);
      }

      return;
    }

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

  const alCerrar = () => finalizarCierre();

  function iniciarGesto(evento) {
    if (!dialogo.open || evento.isPrimary === false) return;
    if (!Number.isFinite(evento.clientX) || !Number.isFinite(evento.clientY)) return;

    inicioPuntero = {
      id: evento.pointerId,
      x: evento.clientX,
      y: evento.clientY,
    };

    imagen.setPointerCapture?.(evento.pointerId);
  }

  function terminarGesto(evento) {
    if (!inicioPuntero || evento.pointerId !== inicioPuntero.id) return;

    const inicio = inicioPuntero;
    inicioPuntero = null;
    if (!Number.isFinite(evento.clientX) || !Number.isFinite(evento.clientY)) return;

    const desplazamientoX = evento.clientX - inicio.x;
    const desplazamientoY = evento.clientY - inicio.y;
    const esHorizontal = Math.abs(desplazamientoX) >= umbralDeslizamiento
      && Math.abs(desplazamientoX) > Math.abs(desplazamientoY);

    if (!esHorizontal) return;

    evento.preventDefault?.();
    navegar(desplazamientoX < 0 ? 1 : -1);
  }

  function cancelarGesto(evento) {
    if (inicioPuntero && evento.pointerId === inicioPuntero.id) inicioPuntero = null;
  }

  botonAnterior.addEventListener('click', () => navegar(-1));
  botonSiguiente.addEventListener('click', () => navegar(1));
  botonCerrar.addEventListener('click', cerrar);
  dialogo.addEventListener('cancel', alCancelar);
  dialogo.addEventListener('close', alCerrar);
  documento?.addEventListener('keydown', manejarTecla);
  imagen.addEventListener?.('pointerdown', iniciarGesto);
  imagen.addEventListener?.('pointerup', terminarGesto);
  imagen.addEventListener?.('pointercancel', cancelarGesto);

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
