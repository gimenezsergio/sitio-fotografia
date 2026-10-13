# SER. — Portfolio fotográfico

Sitio público de SER. (`https://byser.com.ar/`), de Sergio Gimenez, fotógrafo de moda y editorial en Buenos Aires. Desarrollado con HTML, CSS y JavaScript sin frameworks.

La URL canónica, Open Graph, Twitter Cards, `robots.txt` y `sitemap.xml` usan el dominio oficial. El favicon «S» aprobado se sirve en 16 × 16 y 32 × 32 píxeles desde `images/`. La imagen social tipográfica aprobada se sirve desde `/images/ser-open-graph.png` (1200 × 630 píxeles). Los archivos de `docs/propuestas-identidad/` conservan las propuestas originales y no se sirven como recursos activos.

## Requisitos para desarrollo

- Node.js 18 o posterior, solo para ejecutar el servidor local y las pruebas.

## Servir el sitio localmente

Desde la raíz del proyecto:

```sh
node scripts/servidor-local.mjs
```

Luego abrir <http://127.0.0.1:4173/>. Se puede elegir otro puerto definiendo `PORT`, por ejemplo `PORT=8080 node scripts/servidor-local.mjs`.

## Comprobaciones

```sh
node --test
node scripts/comprobar-sitio.mjs
```

No se requieren paquetes externos. Node.js no forma parte de los requisitos del sitio publicado.

## Configuración fotográfica

`data/fotografias.json` contiene un objeto con una lista ordenada `fotografias`. Cada foto requiere:

- `id`: identificador único en minúsculas, números y guiones.
- `archivo`: ruta local existente bajo `/images/`, con extensión AVIF, JPEG, PNG o WebP.
- `alt`: descripción accesible; no se muestra como pie de foto.
- `composicion`: `portada`, `ancho-completo`, `vertical-destacada`, `pareja-izquierda`, `pareja-derecha`, `desplazada-izquierda` o `desplazada-derecha`.
- `ancho` y `alto`: dimensiones originales en píxeles, como enteros positivos.

La lista debe tener exactamente una portada. Una foto `pareja-izquierda` debe ir inmediatamente antes de su `pareja-derecha`. Solo la portada admite `posicionMovil` y `posicionEscritorio`, cada una con dos porcentajes (por ejemplo, `"50% 40%"`). Las variantes responsive son opcionales y usan `{ "archivo": "/images/portada-800.webp", "ancho": 800 }`; sus anchos deben ser únicos y menores que el original. El sitio las convierte en `srcset`/`sizes`; guardá cada variante bajo `/images/` y mantené su formato (JPEG o WebP). En este proyecto se generan con ImageMagick, que solo hace falta al preparar imágenes y no al servir el sitio:

```sh
magick imagen-original.jpg -resize '800x>' -quality 82 imagen-800.jpg
```

Validá el archivo antes de incorporarlo:

```sh
node scripts/validar-fotografias.mjs
```

También podés indicar otro archivo JSON como argumento. El validador exige al menos una foto y que todos los archivos existan. Las pruebas automatizadas usan imágenes temporales y no agregan fotos ficticias al portfolio.
