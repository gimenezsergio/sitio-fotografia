import { createReadStream, statSync } from 'node:fs';
import { createServer as createHttpServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const raizProyecto = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const tiposContenido = new Map([
  ['.avif', 'image/avif'],
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
]);

export function crearServidorLocal() {
  return createHttpServer((solicitud, respuesta) => {
    if (solicitud.method !== 'GET' && solicitud.method !== 'HEAD') {
      respuesta.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }

    let rutaSolicitada;
    try {
      rutaSolicitada = decodeURIComponent(new URL(solicitud.url, 'http://localhost').pathname);
    } catch {
      respuesta.writeHead(400).end('Solicitud inválida');
      return;
    }

    const rutaRelativa = rutaSolicitada === '/' ? 'index.html' : rutaSolicitada.slice(1);
    const rutaArchivo = path.resolve(raizProyecto, rutaRelativa);
    if (rutaArchivo !== raizProyecto && !rutaArchivo.startsWith(`${raizProyecto}${path.sep}`)) {
      respuesta.writeHead(403).end('Acceso denegado');
      return;
    }

    try {
      if (!statSync(rutaArchivo).isFile()) throw new Error('No es un archivo');
    } catch {
      respuesta.writeHead(404).end('No encontrado');
      return;
    }

    respuesta.writeHead(200, {
      'Content-Type': tiposContenido.get(path.extname(rutaArchivo)) ?? 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    });
    if (solicitud.method === 'HEAD') {
      respuesta.end();
      return;
    }
    createReadStream(rutaArchivo).pipe(respuesta);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const puerto = Number(process.env.PORT ?? 4173);
  const servidor = crearServidorLocal();
  servidor.listen(puerto, '127.0.0.1', () => {
    const direccion = servidor.address();
    process.stdout.write(`Sitio local disponible en http://127.0.0.1:${direccion.port}\n`);
  });
}
