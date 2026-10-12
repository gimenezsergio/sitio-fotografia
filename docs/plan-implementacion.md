# Plan de implementación — Portfolio de Sergio Gimenez

**Alcance:** MVP público de una página, según `docs/especificacion.md` v1.0.  
**Estado general:** en desarrollo; pasos 1 a 6 completados, maqueta general completada.
**Arquitectura:** HTML5, CSS Vanilla, JavaScript Vanilla con módulos ES, JSON para fotografías, Debian y Nginx. Sin backend, generador estático ni aplicación privada de sesiones.

## Hallazgos y decisiones pendientes

No hay contradicciones estructurales. La especificación se declara lista para implementar, pero aún faltan insumos y detalles que condicionan algunos pasos:

| Tema | Riesgo o ambigüedad | Propuesta y dependencia |
| --- | --- | --- |
| Fotografías | Hay una preselección aceptada de publicaciones del perfil, pero aún no se revisaron las imágenes completas ni se obtuvieron archivos aptos para web. | Usar las publicaciones indicadas abajo como referencia. Verificar autoría, elección exacta en carruseles, encuadre y calidad antes de incorporar archivos. Necesario para pasos 6 a 8 y 13. |
| Retrato y correo | Faltan el retrato real y el correo de contacto. | No inventarlos. Necesarios para pasos 11 y 12. |
| Dominio e imagen para compartir | Sin dominio no pueden cerrarse URL canónica, sitemap, Open Graph ni HTTPS. | Completar antes de pasos 14 y 15. |
| Esquema JSON | El ejemplo no define variantes responsive, dimensiones, asociación de parejas ni encuadres editoriales. | Acordar un esquema mínimo documentado antes del paso 4. Conservar orden visual por orden del JSON y portada única. |
| Portada de pantalla completa | No se aclara si la cabecera cuenta dentro de la altura visible. | Propuesta: cabecera y portada caben juntas en una pantalla móvil visible, sin tapar imagen ni texto. Acordar antes del paso 6. |
| Fuentes | Se admiten fuentes locales o de sistema; faltan archivos y condiciones de uso. | Usar Cormorant Garamond e Inter locales solo con archivos autorizados; mientras tanto, alternativas de sistema. Antes del paso 2. |
| VPS existente | Se desconocen servicios, rutas y acceso. | Inspeccionar antes de definir o aplicar configuración; no afectar servicios existentes. Antes del paso 15. |

El texto provisional de presentación puede usarse hasta que Sergio entregue la versión final. El HTML inicial contendrá los textos principales aunque falle JavaScript. Las descripciones alternativas serán accesibles y nunca pies visibles. Un fallo de carga del JSON mostrará un aviso discreto en castellano.

## Ajuste visual solicitado después del paso 2

**Estado:** completado (12/10/2026). **Objetivo:** mostrar en el navegador la maqueta completa de la página, no solo la tipografía inicial.
**Tareas:** incorporar las cuatro secciones del MVP, navegación interna y marcadores visibles en castellano para los archivos fotográficos aún pendientes.
**Archivos:** `index.html`, `css/styles.css`, `css/responsive.css`, `tests/estructura.test.mjs`.
**Criterios de aceptación:** la página muestra portada, portfolio con ocho espacios, presentación y contacto; las fotos pendientes se identifican como temporales; navegación al contacto funciona y el diseño no desborda en móvil/escritorio.
**Pruebas:** `node --test`, comprobación HTTP, revisión visual en 360, 390, 768 y 1440 px.

**Registro de cierre:** `index.html` presenta las cuatro áreas, ocho espacios de galería y avisos temporales para portada, retrato y correo sin inventar recursos. El enlace `CONTACTO` cambia el destino a `#contacto`. `node --test` pasó 5/5 pruebas y la comprobación HTTP pasó para todos los recursos. Se revisaron capturas en 360, 390, 768 y 1440 px; se corrigió la cuadrícula de portada en escritorio tras detectar que el texto quedaba debajo de la imagen.

### Preselección fotográfica aceptada

La elección se basa en las miniaturas públicas del perfil de Instagram; el detalle de cada publicación pidió iniciar sesión. El orden es una propuesta editorial, pendiente de verificar los archivos completos, los carruseles y la calidad de origen. No se han descargado ni incorporado imágenes al proyecto.

- **Portada:** [vestido oscuro frente a los arcos](https://www.instagram.com/sergiogimenezph/p/DUWteB_jQpG/).
- **Portfolio, en orden:** [capucha gris](https://www.instagram.com/sergiogimenezph/p/DcwP3IvRNV2/), [abrigo claro entre arcos](https://www.instagram.com/damaris.medina_/p/DdHtIMGFFCg/), [conjunto oscuro y falda marrón](https://www.instagram.com/morena.myn/p/DdPiu5RCYyZ/), [retrato de estudio](https://www.instagram.com/sergiogimenezph/p/DZknAClEZa2/), [modelo pelirroja junto al muro azul](https://www.instagram.com/sergiogimenezph/p/DUEQ4lZiaqv/), [abrigo gris contra el muro](https://www.instagram.com/sergiogimenezph/p/Db1SO8pRqfI/), [top claro y denim](https://www.instagram.com/sergiogimenezph/p/DVb5sUSibyv/), [modelo de negro junto al muro cálido](https://www.instagram.com/sergiogimenezph/p/DSF6rP5icK2/).

Para el sitio se prefieren exportaciones originales facilitadas por Sergio. Si se recurre a archivos publicados en Instagram, se comprobará su resolución y se evitará presentarlos como versiones definitivas si la calidad no alcanza.

## Método y pruebas

Se implementará un paso por vez. Los estados permitidos son `pendiente`, `en progreso`, `completado` y `bloqueado`. Cada paso se marca `completado` solo tras verificar sus criterios y ejecutar sus pruebas; se registrarán fecha, archivos, comandos y resultados. Una prueba fallida deja el paso `en progreso` o `bloqueado`.

Desde el paso 1 se usarán comprobaciones automáticas con Node.js y su ejecutor integrado (`node --test`); Node será una herramienta de desarrollo, no un requisito de producción. Las pruebas del JSON empiezan antes de renderizar fotografías. Playwright, previsto en la especificación, se añadirá como dependencia de desarrollo cuando haya interacciones de navegador que probar, justificando y documentando su instalación. No se añadirá al sitio publicado. La revisión visual y manual de accesibilidad complementará esas pruebas.

## Pasos

### Paso 1 — Base servida por HTTP

**Estado:** completado (12/10/2026). **Depende de:** autorización explícita de Sergio.
**Objetivo:** abrir una página HTML mínima mediante HTTP local.  
**Tareas:** inicializar Git si sigue ausente; crear estructura pública, HTML semántico, README con instrucciones locales, `.gitignore` y una comprobación automática de estructura y respuesta HTTP.  
**Archivos:** `index.html`, `README.md`, `.gitignore`, `css/styles.css`, `js/main.js`, `data/fotografias.json`, `scripts/comprobar-sitio.mjs`, `tests/estructura.test.mjs`; carpetas `images/portada/`, `images/portfolio/`, `images/perfil/` y `fonts/` cuando se necesiten.  
**Criterios de aceptación:** respuesta 200 local; `lang="es-AR"`; CSS y módulo JS cargan; texto inicial castellano; consola sin errores.  
**Pruebas:** `node --test`, comprobación HTTP del script y apertura manual con revisión de consola.

**Registro de cierre:** se crearon los archivos de base, estructura de imágenes, servidor local y pruebas, y se inicializó Git. `node --test` pasó 3/3 pruebas; `node scripts/comprobar-sitio.mjs` devolvió 200 para HTML, CSS, JS y JSON; el navegador mostró el título y los textos iniciales. La primera ejecución detectó un error en la validación de rutas, que se corrigió antes de repetir y aprobar las pruebas.

### Paso 2 — Base visual mobile first

**Estado:** completado (12/10/2026). **Depende de:** paso 1 y decisión sobre fuentes.
**Objetivo:** establecer paleta, tipografía y reglas de legibilidad.  
**Tareas:** definir los cuatro colores de la especificación, jerarquía, espaciados, fuentes locales autorizadas o alternativas de sistema y movimiento reducido.  
**Archivos:** `css/styles.css`, `css/responsive.css`, `fonts/` si corresponde, `tests/`.  
**Criterios de aceptación:** colores correctos, texto legible, sin fuentes externas obligatorias ni desplazamiento horizontal a 360, 390, 768 y 1440 px.  
**Pruebas:** `node --test`, inspección en cuatro anchos, contraste y `prefers-reduced-motion`.

**Registro de cierre:** se definieron los tokens de color y tipografía con alternativas de sistema, espaciado adaptable, jerarquía editorial y reglas responsive. `node --test` pasó 5/5 pruebas, incluyendo contraste AA para texto principal, paleta, breakpoints y movimiento reducido. `node scripts/comprobar-sitio.mjs` confirmó respuesta 200 de HTML, CSS base, CSS responsive, JS y JSON. La revisión visual en 360, 390, 768 y 1440 px mostró texto legible y sin desbordamiento horizontal.

### Paso 3 — Cabecera y destino de navegación

**Estado:** completado (12/10/2026). **Depende de:** paso 2.
**Objetivo:** hacer funcional la navegación mínima.  
**Tareas:** cabecera con solo `SERGIO GIMENEZ` y `CONTACTO`; crear destino semántico de la sección final y ajustar foco y ancla.  
**Archivos:** `index.html`, `css/styles.css`, `css/responsive.css`, `tests/`.  
**Criterios de aceptación:** el enlace llega al destino con teclado y ratón sin ocultar contenido.  
**Pruebas:** `node --test`, Tab y Enter, revisión a 360 y 1440 px.

**Registro de cierre:** cabecera con nombre y enlace `CONTACTO`; se verificó el destino `#contacto` en navegador y el enlace interno se incluye en las pruebas de estructura.

### Paso 4 — Contrato y validación de fotografías

**Estado:** completado (12/10/2026). **Depende de:** paso 1 y acuerdo sobre esquema JSON.
**Objetivo:** tener una configuración comprobable antes de mostrar imágenes.  
**Tareas:** definir identificador, ruta, `alt`, composición, dimensiones, variantes y encuadres opcionales; validar archivos, portada única y parejas completas; documentar el contrato.  
**Archivos:** `data/fotografias.json`, `scripts/validar-fotografias.mjs`, `tests/fotografias.test.mjs`, `README.md`.  
**Criterios de aceptación:** el validador acepta datos correctos y rechaza identificadores duplicados, archivos ausentes, composiciones inválidas, portada incorrecta y parejas incompletas con errores comprensibles.  
**Pruebas:** `node --test` con casos válidos e inválidos; `node scripts/validar-fotografias.mjs` cuando haya imágenes reales.

**Registro de cierre:** se definió y documentó el esquema JSON (identificador, ruta, texto alternativo, composición, dimensiones, variantes y encuadres de portada) y se implementó `scripts/validar-fotografias.mjs`. Las pruebas cubren configuración válida, IDs repetidos, archivos faltantes, rutas fuera de `images/`, composición y portada, parejas, descripciones, dimensiones, encuadres y variantes. `node --test` pasó 10/10 pruebas. El JSON de producción sigue vacío porque faltan las fotos originales; el validador lo informa como incompleto hasta incorporarlas.

### Paso 5 — Carga del JSON en navegador

**Estado:** completado (12/10/2026). **Depende de:** paso 4.
**Objetivo:** leer configuración sin dejar la página vacía ante un fallo.  
**Tareas:** cargar JSON con `fetch`, distinguir éxito y error y mostrar aviso discreto en castellano; separar carga y renderizado.  
**Archivos:** `js/main.js`, `index.html`, `css/styles.css`, `tests/`.  
**Criterios de aceptación:** los datos válidos se leen por HTTP; respuesta fallida o JSON inválido muestra el aviso; el texto principal permanece.  
**Pruebas:** `node --test`, prueba de navegador con carga correcta y fallida, consola sin errores no controlados.

**Registro de cierre:** se agregó un cargador independiente que obtiene y valida la forma de la lista JSON, y el punto de entrada muestra un aviso accesible y discreto ante fallos HTTP, de red o de análisis. El contenido principal ya presente en HTML permanece disponible. `node --test` pasó 14/14 pruebas: carga, error HTTP, estructura JSON, fallos de red/análisis, aviso en HTML y recursos servidos por HTTP.

### Paso 6 — Portada editorial

**Estado:** completado (12/10/2026). **Depende de:** pasos 2 y 5, fotografía autorizada y criterio de altura/encuadre.
**Objetivo:** presentar la identidad visual y profesional.  
**Tareas:** cargar portada desde JSON con posición móvil/escritorio; incluir en HTML inicial nombre, «Fotografía de moda y editorial» y «Buenos Aires, Argentina»; evitar texto sobre rostros.  
**Archivos:** `index.html`, `js/main.js`, `css/styles.css`, `css/responsive.css`, `data/fotografias.json`, `images/portada/`, `scripts/servidor-local.mjs`, `tests/`.
**Criterios de aceptación:** una portada, altura acordada, encuadre intencional y texto legible en móvil y escritorio incluso si JavaScript falla.  
**Pruebas:** validador, `node --test`, revisión a 360, 390, 768 y 1440 px, texto y consola con y sin JS.

**Registro de cierre:** se incorporó desde la publicación seleccionada del perfil una imagen JPEG de 1080 × 1440 en `images/portada/portada.jpg`. El JSON define la portada, texto alternativo, dimensiones y encuadres para móvil y escritorio. El renderizador la presenta con carga prioritaria y mantiene el texto como HTML. Se añadieron tipos MIME para AVIF, JPEG, PNG y WebP al servidor local. `node scripts/validar-fotografias.mjs` pasó; `node --test` pasó 16/16; la comprobación HTTP pasó para página, módulos, JSON e imagen JPEG. Revisión visual confirmada a 360, 390, 768 y 1440 px: el sujeto queda completo, el texto no se superpone a la imagen y el diseño no desborda horizontalmente.

### Paso 7 — Galería lineal desde JSON

**Estado:** pendiente. **Depende de:** pasos 5 y 6 y ocho fotos autorizadas.  
**Objetivo:** mostrar ocho fotos en el orden configurado.  
**Tareas:** renderizar imágenes con `alt`, dimensiones y carga diferida; preservar proporciones y omitir pies y metadatos visibles.  
**Archivos:** `index.html`, `js/gallery.js`, `js/main.js`, `css/styles.css`, `data/fotografias.json`, `images/portfolio/`, `tests/`.  
**Criterios de aceptación:** exactamente ocho fotos además de portada; cambiar el orden JSON cambia el orden visual; no hay recortes arbitrarios.  
**Pruebas:** validador, `node --test`, prueba funcional de cantidad y orden, revisión móvil/escritorio.

### Paso 8 — Composiciones editoriales

**Estado:** pendiente. **Depende de:** paso 7.  
**Objetivo:** dar ritmo visual a la secuencia sin dividirla en categorías.  
**Tareas:** implementar ancho completo, vertical destacada, parejas y composición asimétrica según JSON; conservar proporciones salvo encuadre explícito.  
**Archivos:** `js/gallery.js`, `css/styles.css`, `css/responsive.css`, `data/fotografias.json`, `tests/`.  
**Criterios de aceptación:** cada composición aparece correctamente; parejas completas; ningún desbordamiento ni recorte imprevisto.  
**Pruebas:** validador, `node --test`, revisión visual a 360, 390, 768 y 1440 px.

### Paso 9 — Lightbox: apertura y navegación

**Estado:** pendiente. **Depende de:** paso 7.  
**Objetivo:** ampliar y recorrer todas las fotos.  
**Tareas:** visor oscuro con imagen completa, botones anterior/siguiente/cerrar, Escape y flechas; nombres accesibles en castellano.  
**Archivos:** `index.html`, `js/lightbox.js`, `js/gallery.js`, `css/lightbox.css`, `tests/`.  
**Criterios de aceptación:** cualquiera de las ocho fotos abre; se recorre y cierra; sin recortes ni metadatos visibles.  
**Pruebas:** `node --test` y pruebas funcionales de botones, límites, Escape y flechas; incorporar Playwright como herramienta de desarrollo si se aprueba.

### Paso 10 — Lightbox: accesibilidad y tacto

**Estado:** pendiente. **Depende de:** paso 9.  
**Objetivo:** completar uso con teclado y móvil.  
**Tareas:** retener foco en visor, restaurarlo al activador, bloquear scroll de fondo, añadir gestos táctiles y respetar movimiento reducido.  
**Archivos:** `js/lightbox.js`, `css/lightbox.css`, `tests/`.  
**Criterios de aceptación:** Tab permanece en visor; cierre restaura foco; fondo inmóvil; gesto y botón de cierre funcionan.  
**Pruebas:** `node --test`, pruebas funcionales de foco y scroll, revisión manual con teclado y pantalla táctil.

### Paso 11 — Presentación personal

**Estado:** pendiente. **Depende de:** paso 2 y retrato real.  
**Objetivo:** presentar a Sergio con retrato, nombre, ubicación y texto editable.  
**Tareas:** añadir sección semántica, retrato autorizado y texto provisional o aprobado en HTML.  
**Archivos:** `index.html`, `css/styles.css`, `css/responsive.css`, `images/perfil/`, `tests/`.  
**Criterios de aceptación:** cuatro elementos presentes, texto independiente de JS, retrato con alternativa accesible y diseño legible en móvil/escritorio.  
**Pruebas:** `node --test`, revisión responsive y con teclado.

### Paso 12 — Contacto definitivo

**Estado:** pendiente. **Depende de:** paso 3 y correo aprobado.  
**Objetivo:** ofrecer Instagram y correo sin formulario.  
**Tareas:** completar sección negra tinta con invitación breve, Instagram especificado y `mailto:` definitivo.  
**Archivos:** `index.html`, `css/styles.css`, `css/responsive.css`, `tests/`.  
**Criterios de aceptación:** ambos destinos correctos; `CONTACTO` llega; no hay formulario; contraste y foco adecuados.  
**Pruebas:** `node --test`, comprobación de URLs y teclado, revisión de contraste.

### Paso 13 — Imágenes responsive y rendimiento

**Estado:** pendiente. **Depende de:** pasos 6 a 8 y originales autorizados.  
**Objetivo:** evitar transferencias excesivas y saltos de diseño.  
**Tareas:** generar variantes WebP y AVIF cuando convenga; `srcset`/`sizes`; priorizar portada, carga diferida del portfolio y dimensiones explícitas.  
**Archivos:** `data/fotografias.json`, `images/`, `js/gallery.js`, `js/main.js`, `index.html`, `scripts/validar-fotografias.mjs`, `tests/`.  
**Criterios de aceptación:** móvil descarga tamaños apropiados, portada tiene prioridad, galería no se descarga de inicio y diseño se mantiene estable.  
**Pruebas:** validador, `node --test`, inspección de red móvil y Lighthouse representativo sin umbral arbitrario previo.

### Paso 14 — SEO y revisión integral

**Estado:** pendiente. **Depende de:** pasos 6 a 13, dominio e imagen autorizada para compartir.  
**Objetivo:** dejar completo el sitio público.  
**Tareas:** título, descripción, Open Graph, favicon, URL canónica, `robots.txt`, sitemap; revisar castellano, accesibilidad y alcance.  
**Archivos:** `index.html`, `robots.txt`, `sitemap.xml`, `images/` para favicon e imagen social, `tests/`, `README.md`.  
**Criterios de aceptación:** metadatos y rutas reales, texto principal en HTML, sin errores importantes ni funcionalidades fuera del MVP.  
**Pruebas:** `node --test`, validador, flujos completos, visual en cuatro anchos, teclado, contraste, movimiento reducido y Lighthouse.

### Paso 15 — Publicación en Debian/Nginx

**Estado:** pendiente. **Depende de:** paso 14, dominio y acceso al VPS.  
**Objetivo:** servir el portfolio por HTTPS y documentar actualizaciones repetibles.  
**Tareas:** inspeccionar servicios existentes; preparar configuración Nginx, certificado, rutas y caché; documentar despliegue desde GitHub antes de tocar el servidor.  
**Archivos:** `README.md` y, si corresponde, configuración versionada en `deploy/`; cambios en VPS tras inspección y aprobación concreta.  
**Criterios de aceptación:** sitio disponible por HTTPS, redirección HTTP correcta, actualización reproducible y otros servicios operativos.  
**Pruebas:** `nginx -t`, comprobaciones HTTP/HTTPS, rutas, certificado, caché y flujos esenciales en producción.

## Registro de avance

Al iniciar cada paso se cambia su estado a `en progreso`. Al finalizar se anotan fecha, archivos modificados, comandos, resultados y criterios verificados. Si falta un insumo o falla una prueba, se registra la causa y se usa `bloqueado` cuando no pueda avanzarse. Tras cada paso se revisa el resultado antes de continuar.
