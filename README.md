# Portfolio fotográfico

Sitio público de Sergio Gimenez, desarrollado con HTML, CSS y JavaScript sin frameworks.

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
