import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raizProyecto = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const composicionesValidas = new Set([
  'portada',
  'ancho-completo',
  'vertical-destacada',
  'pareja-izquierda',
  'pareja-derecha',
  'desplazada-izquierda',
  'desplazada-derecha',
]);
const extensionesImagen = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp']);

function agregarError(errores, prefijo, mensaje) {
  errores.push(`${prefijo}: ${mensaje}`);
}

function validarRutaImagen(archivo, prefijo, raiz, errores) {
  if (typeof archivo !== 'string' || !archivo.startsWith('/images/') || archivo.includes('?') || archivo.includes('#')) {
    agregarError(errores, prefijo, 'el archivo debe ser una ruta local bajo /images/');
    return null;
  }

  let rutaDecodificada;
  try {
    rutaDecodificada = decodeURIComponent(archivo);
  } catch {
    agregarError(errores, prefijo, 'la ruta del archivo contiene codificación inválida');
    return null;
  }

  const directorioImagenes = path.resolve(raiz, 'images');
  const rutaFisica = path.resolve(raiz, `.${rutaDecodificada}`);
  if (!rutaFisica.startsWith(`${directorioImagenes}${path.sep}`)) {
    agregarError(errores, prefijo, 'la ruta debe permanecer dentro de images/');
    return null;
  }

  if (!extensionesImagen.has(path.extname(rutaFisica).toLowerCase())) {
    agregarError(errores, prefijo, 'la extensión debe ser AVIF, JPEG, PNG o WebP');
  }

  if (!existsSync(rutaFisica) || !statSync(rutaFisica).isFile()) {
    agregarError(errores, prefijo, `no existe el archivo ${archivo}`);
    return null;
  }

  return rutaFisica;
}

function esDimensionPositiva(valor) {
  return Number.isInteger(valor) && valor > 0;
}

function validarPosicion(valor) {
  if (typeof valor !== 'string') return false;
  const componentes = valor.trim().split(/\s+/);
  return componentes.length === 2 && componentes.every((componente) => {
    const coincidencia = /^(\d{1,3})%$/.exec(componente);
    return coincidencia && Number(coincidencia[1]) <= 100;
  });
}

/** Devuelve una lista vacía cuando la configuración cumple el contrato. */
export function validarFotografias(configuracion, raiz = raizProyecto) {
  const errores = [];
  if (!configuracion || typeof configuracion !== 'object' || Array.isArray(configuracion)) {
    return ['La configuración debe ser un objeto JSON.'];
  }
  if (!Array.isArray(configuracion.fotografias)) {
    return ['La propiedad "fotografias" debe ser una lista.'];
  }

  const fotografias = configuracion.fotografias;
  if (fotografias.length === 0) {
    agregarError(errores, 'fotografias', 'agregá una portada antes de validar el portfolio');
  }

  const identificadores = new Set();
  for (const [indice, fotografia] of fotografias.entries()) {
    const prefijo = `fotografias[${indice}]`;
    if (!fotografia || typeof fotografia !== 'object' || Array.isArray(fotografia)) {
      agregarError(errores, prefijo, 'cada elemento debe ser un objeto');
      continue;
    }

    if (typeof fotografia.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fotografia.id)) {
      agregarError(errores, prefijo, 'id debe usar minúsculas, números y guiones');
    } else if (identificadores.has(fotografia.id)) {
      agregarError(errores, prefijo, `el identificador "${fotografia.id}" está repetido`);
    } else {
      identificadores.add(fotografia.id);
    }

    validarRutaImagen(fotografia.archivo, `${prefijo}.archivo`, raiz, errores);

    if (typeof fotografia.alt !== 'string' || fotografia.alt.trim().length === 0) {
      agregarError(errores, `${prefijo}.alt`, 'agregá una descripción alternativa');
    }

    if (!composicionesValidas.has(fotografia.composicion)) {
      agregarError(errores, `${prefijo}.composicion`, `composición inválida "${fotografia.composicion ?? ''}"`);
    }

    if (!esDimensionPositiva(fotografia.ancho) || !esDimensionPositiva(fotografia.alto)) {
      agregarError(errores, prefijo, 'ancho y alto deben ser números enteros positivos');
    }

    for (const campo of ['posicionMovil', 'posicionEscritorio']) {
      if (fotografia[campo] !== undefined && !validarPosicion(fotografia[campo])) {
        agregarError(errores, `${prefijo}.${campo}`, 'usá dos porcentajes entre 0% y 100%');
      }
      if (fotografia[campo] !== undefined && fotografia.composicion !== 'portada') {
        agregarError(errores, `${prefijo}.${campo}`, 'este encuadre solo corresponde a la portada');
      }
    }

    if (fotografia.variantes !== undefined) {
      if (!Array.isArray(fotografia.variantes)) {
        agregarError(errores, `${prefijo}.variantes`, 'debe ser una lista');
      } else {
        const anchos = new Set();
        fotografia.variantes.forEach((variante, indiceVariante) => {
          const prefijoVariante = `${prefijo}.variantes[${indiceVariante}]`;
          if (!variante || typeof variante !== 'object' || Array.isArray(variante)) {
            agregarError(errores, prefijoVariante, 'cada variante debe ser un objeto');
            return;
          }
          validarRutaImagen(variante.archivo, `${prefijoVariante}.archivo`, raiz, errores);
          if (!esDimensionPositiva(variante.ancho)) {
            agregarError(errores, `${prefijoVariante}.ancho`, 'el ancho debe ser un número entero positivo');
          } else {
            if (esDimensionPositiva(fotografia.ancho) && variante.ancho >= fotografia.ancho) {
              agregarError(errores, `${prefijoVariante}.ancho`, 'debe ser menor que el ancho de la imagen original');
            }
            if (anchos.has(variante.ancho)) {
              agregarError(errores, `${prefijoVariante}.ancho`, 'no repitas el ancho de otra variante');
            }
            anchos.add(variante.ancho);
          }
        });
      }
    }
  }

  const portadas = fotografias.filter((fotografia) => fotografia?.composicion === 'portada');
  if (portadas.length !== 1) {
    agregarError(errores, 'fotografias', `debe haber exactamente una portada; se encontraron ${portadas.length}`);
  }

  fotografias.forEach((fotografia, indice) => {
    if (fotografia?.composicion === 'pareja-izquierda' && fotografias[indice + 1]?.composicion !== 'pareja-derecha') {
      agregarError(errores, `fotografias[${indice}]`, 'la foto izquierda debe estar seguida por su pareja derecha');
    }
    if (fotografia?.composicion === 'pareja-derecha' && fotografias[indice - 1]?.composicion !== 'pareja-izquierda') {
      agregarError(errores, `fotografias[${indice}]`, 'la foto derecha debe estar precedida por su pareja izquierda');
    }
  });

  return errores;
}

async function ejecutar() {
  const rutaConfiguracion = path.resolve(process.argv[2] ?? path.join(raizProyecto, 'data/fotografias.json'));
  let configuracion;
  try {
    configuracion = JSON.parse(await readFile(rutaConfiguracion, 'utf8'));
  } catch (error) {
    process.stderr.write(`No se pudo leer la configuración JSON: ${error.message}\n`);
    process.exitCode = 1;
    return;
  }

  const errores = validarFotografias(configuracion, raizProyecto);
  if (errores.length > 0) {
    process.stderr.write(`La configuración fotográfica tiene ${errores.length} problema(s):\n`);
    for (const error of errores) process.stderr.write(`- ${error}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`Configuración fotográfica válida: ${configuracion.fotografias.length} imágenes.\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await ejecutar();
}
