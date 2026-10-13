# Plan de implementación — Portfolio SER.

**Alcance:** MVP público de una página, según `docs/especificacion.md` v1.1.
**Estado general:** sitio público implementado y revisado; pasos 1 a 14 completados, paso 15 (publicación VPS) pendiente.
**Arquitectura:** HTML5, CSS Vanilla, JavaScript Vanilla con módulos ES, JSON para fotografías, Debian y Nginx. Sin backend, generador estático ni aplicación privada de sesiones.

## Hallazgos y decisiones pendientes

No hay contradicciones estructurales. La especificación se declara lista para implementar, pero aún faltan insumos y detalles que condicionan algunos pasos:

| Tema | Riesgo o ambigüedad | Propuesta y dependencia |
| --- | --- | --- |
| Texto de presentación | El texto actual funciona como versión provisional. | Mantenerlo hasta que Sergio decida si quiere reemplazarlo. No bloquea la revisión técnica. |
| VPS existente | Se desconocen servicios, rutas y acceso. | Inspeccionar antes de definir o aplicar configuración; no afectar servicios existentes. Antes del paso 15. |

La portada, el retrato y las ocho fotografías de galería ya están incorporados. El contacto queda por ahora solo en Instagram, sin correo ni texto provisional visible. El HTML inicial contiene el texto principal aunque falle JavaScript; las descripciones alternativas son accesibles y nunca pies visibles. Un fallo de carga del JSON muestra un aviso discreto en castellano.

## Ajuste visual solicitado después del paso 2

**Estado:** completado (12/10/2026). **Objetivo:** mostrar en el navegador la maqueta completa de la página, no solo la tipografía inicial.
**Tareas:** incorporar las cuatro secciones del MVP, navegación interna y marcadores visibles en castellano para los archivos fotográficos aún pendientes.
**Archivos:** `index.html`, `css/styles.css`, `css/responsive.css`, `tests/estructura.test.mjs`.
**Criterios de aceptación:** la página muestra portada, portfolio con ocho espacios, presentación y contacto; las fotos pendientes se identifican como temporales; navegación al contacto funciona y el diseño no desborda en móvil/escritorio.
**Pruebas:** `node --test`, comprobación HTTP, revisión visual en 360, 390, 768 y 1440 px.

**Registro de cierre:** `index.html` presenta las cuatro áreas, ocho espacios de galería y avisos temporales para portada, retrato y correo sin inventar recursos. El enlace `CONTACTO` cambia el destino a `#contacto`. `node --test` pasó 5/5 pruebas y la comprobación HTTP pasó para todos los recursos. Se revisaron capturas en 360, 390, 768 y 1440 px; se corrigió la cuadrícula de portada en escritorio tras detectar que el texto quedaba debajo de la imagen.

### Preselección fotográfica aceptada

La elección se basa en la preselección editorial aprobada. Las fotos originales y sus variantes están incorporadas en el sitio. Las futuras incorporaciones se revisarán por autoría, encuadre y calidad antes de publicarlas.

- **Portada:** [vestido oscuro frente a los arcos](https://www.instagram.com/sergiogimenezph/p/DUWteB_jQpG/).
- **Portfolio, en orden:** [capucha gris](https://www.instagram.com/sergiogimenezph/p/DcwP3IvRNV2/), [abrigo claro entre arcos](https://www.instagram.com/damaris.medina_/p/DdHtIMGFFCg/), [conjunto oscuro y falda marrón](https://www.instagram.com/morena.myn/p/DdPiu5RCYyZ/), [retrato de estudio](https://www.instagram.com/sergiogimenezph/p/DZknAClEZa2/), [modelo pelirroja junto al muro azul](https://www.instagram.com/sergiogimenezph/p/DUEQ4lZiaqv/), [abrigo gris contra el muro](https://www.instagram.com/sergiogimenezph/p/Db1SO8pRqfI/), [top claro y denim](https://www.instagram.com/sergiogimenezph/p/DVb5sUSibyv/), [modelo de negro junto al muro cálido](https://www.instagram.com/sergiogimenezph/p/DSF6rP5icK2/).

Las fotografías activas se administran desde `data/fotografias.json`; la galería contiene ocho trabajos y una portada.

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
**Tareas:** cabecera con la marca y `CONTACTO`; crear destino semántico de la sección final y ajustar foco y ancla. La marca vigente desde el 13/10/2026 es `SER.`.
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

**Estado:** completado (12/10/2026). **Depende de:** pasos 5 y 6 y ocho fotos del perfil.
**Objetivo:** mostrar ocho fotos en el orden configurado.  
**Tareas:** renderizar imágenes con `alt`, dimensiones y carga diferida; preservar proporciones y omitir pies y metadatos visibles.  
**Archivos:** `index.html`, `js/gallery.js`, `js/main.js`, `css/styles.css`, `data/fotografias.json`, `images/portfolio/`, `tests/`.  
**Criterios de aceptación:** exactamente ocho fotos además de portada; cambiar el orden JSON cambia el orden visual; no hay recortes arbitrarios.  
**Pruebas:** validador, `node --test`, prueba funcional de cantidad y orden, revisión móvil/escritorio.

**Registro de cierre:** se añadieron ocho fotos de galería al JSON y un módulo Vanilla JS que las renderiza en el orden configurado, con textos alternativos, dimensiones y carga diferida; la portada se excluye de la galería. La cuadrícula mantiene las proporciones y presenta la secuencia a una columna para dejar las composiciones editoriales para el paso 8. `node scripts/validar-fotografias.mjs` pasó con nueve imágenes; `node --test` pasó 21/21; `node scripts/comprobar-sitio.mjs` y `git diff --check` pasaron. HTTP confirmó el módulo y los ocho archivos con sus tipos MIME. En navegador se verificaron las ocho imágenes y el orden en el árbol accesible, y la visualización a 390 px y escritorio no mostró recortes ni desbordamiento.

**Nota de contenido inicial:** siete fotos correspondían a las publicaciones preseleccionadas. Para la octava posición se incorporó entonces una miniatura alternativa de 480 × 640 del perfil porque no se pudo extraer el recurso original. Esa imagen ya no forma parte de la selección activa.

**Actualización de selección (12/10/2026):** Sergio eliminó las fotos iniciales 03, 06 y 08 y agregó cuatro archivos. La galería activa conserva 01, 02, 04 y 07 e incorpora las cuatro nuevas; la foto 05 se reemplazó en la secuencia por la nueva del muro turquesa para reducir la repetición de fondos azules. El JSON vuelve a cumplir la cantidad de ocho fotos y no referencia las imágenes eliminadas.

### Paso 8 — Composiciones editoriales

**Estado:** completado (12/10/2026). **Depende de:** paso 7.
**Objetivo:** dar ritmo visual a la secuencia sin dividirla en categorías.  
**Tareas:** implementar ancho completo, vertical destacada, parejas y composición asimétrica según JSON; conservar proporciones salvo encuadre explícito.  
**Archivos:** `js/gallery.js`, `css/styles.css`, `css/responsive.css`, `data/fotografias.json`, `tests/`.  
**Criterios de aceptación:** cada composición aparece correctamente; parejas completas; ningún desbordamiento ni recorte imprevisto.  
**Pruebas:** validador, `node --test`, revisión visual a 360, 390, 768 y 1440 px.

**Registro de cierre:** el renderizador expone `data-composicion` en cada imagen y CSS asigna las seis composiciones desde 768 px; en móvil las imágenes se apilan a ancho completo con proporción intrínseca. El JSON define una apertura de ancho completo, dos parejas completas, una vertical destacada y dos imágenes desplazadas. `node scripts/validar-fotografias.mjs` pasó con nueve imágenes; `node --test` pasó 22/22; `node scripts/comprobar-sitio.mjs` pasó y `git diff --check` quedó limpio. La revisión visual confirmó las parejas lado a lado en 1440 px y apiladas en 390 px, sin desbordamiento ni recortes CSS.

### Paso 9 — Lightbox: apertura y navegación

**Estado:** completado (12/10/2026). **Depende de:** paso 7.
**Objetivo:** ampliar y recorrer todas las fotos.  
**Tareas:** visor oscuro con imagen completa, botones anterior/siguiente/cerrar, Escape y flechas; nombres accesibles en castellano.  
**Archivos:** `index.html`, `js/lightbox.js`, `js/gallery.js`, `css/lightbox.css`, `tests/`.  
**Criterios de aceptación:** cualquiera de las ocho fotos abre; se recorre y cierra; sin recortes ni metadatos visibles.  
**Pruebas:** `node --test` y pruebas funcionales de botones, límites, Escape y flechas; incorporar Playwright como herramienta de desarrollo si se aprueba.

**Registro de cierre:** se agregó un visor basado en `<dialog>` nativo. Cada imagen se abre en el índice correcto, los controles anterior/siguiente se deshabilitan en los límites, y el usuario puede recorrer con botones o flechas, y cerrar con botón o Escape. La imagen usa `object-fit: contain` y no hay metadatos visibles. `node --test` pasó 28/28; validador, comprobación HTTP y `git diff --check` pasaron. La comprobación manual confirmó apertura, siguiente, flecha derecha, Escape e imagen completa a 390 px y escritorio. Playwright no se agregó; no es necesario para este paso y el plan lo condiciona a aprobación.

### Paso 10 — Lightbox: accesibilidad y tacto

**Estado:** completado (12/10/2026). **Depende de:** paso 9.
**Objetivo:** completar uso con teclado y móvil.  
**Tareas:** retener foco en visor, restaurarlo al activador, bloquear scroll de fondo, añadir gestos táctiles y respetar movimiento reducido.  
**Archivos:** `js/lightbox.js`, `css/lightbox.css`, `tests/`.  
**Criterios de aceptación:** Tab permanece en visor; cierre restaura foco; fondo inmóvil; gesto y botón de cierre funcionan.  
**Pruebas:** `node --test`, pruebas funcionales de foco, scroll y eventos pointer; revisión manual con teclado y visor móvil.

**Registro de cierre:** el diálogo lleva el foco a sus controles, contiene Tab/Shift+Tab, restaura el foco al botón activador y bloquea/restaura el desplazamiento de fondo al cerrar o cancelar. Un gesto horizontal de al menos 48 px cambia la foto; desplazamientos verticales o cortos se ignoran. `touch-action: pan-y` preserva el desplazamiento vertical de página. `node --test` pasó 31/31; validador, comprobación HTTP, sintaxis y `git diff --check` pasaron. En navegador se verificaron foco inicial, ciclo de Tab, restauración del foco y cierre en vista móvil. Los gestos se probaron con eventos pointer automatizados; el navegador de revisión no emula una pantalla táctil física.

### Paso 11 — Presentación personal

**Estado:** completado (12/10/2026). **Depende de:** paso 2 y retrato real recibido en `images/Sergio-Gimenez.png`.
**Objetivo:** presentar a Sergio con retrato, nombre, ubicación y texto editable.  
**Tareas:** usar el retrato entregado por Sergio, describirlo con texto alternativo, conservar su proporción original y entregar WebP responsive mediante `<picture>` sin frameworks.
**Archivos:** `index.html`, `css/styles.css`, `images/Sergio-Gimenez.png`, `images/perfil/variantes/`, `tests/estructura.test.mjs`, `tests/estilos.test.mjs`.
**Criterios de aceptación:** nombre, texto, ubicación y retrato presentes; texto independiente de JS; alt accesible; fallback PNG existente; versiones WebP con MIME correcto; sin recorte del retrato y diseño legible en móvil/escritorio.
**Pruebas:** `node --test`, validador, comprobación HTTP de archivo original/variantes y revisión responsive visual.

**Registro de cierre:** se integró el retrato `images/Sergio-Gimenez.png` (PNG de 1024 × 1536) como imagen accesible con dimensiones explícitas, carga diferida y alternativa WebP responsive (600 × 900 y 900 × 1350). CSS conserva la proporción original para no recortar la foto. `node --test` pasó 33/33; `node scripts/validar-fotografias.mjs` pasó con nueve fotos; `git diff --check` pasó. Las pruebas HTTP verificaron el original PNG y las dos variantes WebP con sus MIME. La revisión visual confirmó la presentación completa a 1270 px y el retrato sin recorte a 390 px.

### Paso 12 — Contacto definitivo

**Estado:** completado (13/10/2026). **Alcance actual:** contacto por Instagram; correo excluido por decisión de Sergio.
**Objetivo:** ofrecer un canal de contacto sin formulario.
**Tareas:** sección de contacto con invitación breve, enlace verificado a Instagram y navegación desde cabecera; no mostrar un marcador de correo pendiente.
**Archivos:** `index.html`, `css/styles.css`, `css/responsive.css`, `tests/`.  
**Criterios de aceptación:** enlace de Instagram correcto; `CONTACTO` llega; no hay formulario ni correo inventado; contraste y foco adecuados.
**Pruebas:** `node --test`, comprobación de URL y teclado, revisión de contraste.

**Registro:** se quitó el texto «Correo electrónico pendiente de configurar» por decisión de Sergio. El HTML y las pruebas confirman Instagram como único contacto visible y ausencia de `mailto:`. `node --test tests/estructura.test.mjs` pasó 5/5.

### Paso 13 — Imágenes responsive y rendimiento

**Estado:** completado (12/10/2026). **Depende de:** pasos 6 a 8 y fotos incorporadas.
**Objetivo:** evitar transferencias excesivas y saltos de diseño.  
**Tareas:** generar variantes JPEG/WebP a 480 y 800 px sin ampliar originales; usar `srcset`/`sizes`; priorizar portada, carga diferida del portfolio y dimensiones explícitas. No se agregó AVIF porque no se justificó sumar otro formato.
**Archivos:** `data/fotografias.json`, `images/portada/variantes/`, `images/portfolio/`, `js/portada.js`, `js/gallery.js`, `README.md`, `tests/estructura.test.mjs`, `tests/portada.test.mjs`, `tests/gallery.test.mjs`.
**Criterios de aceptación:** cada variante existe y conserva el formato original; el renderizador produce `srcset` ordenado y `sizes`; la portada conserva prioridad alta y dimensiones; la galería mantiene carga diferida y dimensiones; todos los recursos responden con MIME correcto.
**Pruebas:** `node scripts/validar-fotografias.mjs` pasó con nueve imágenes; `node --test` pasó 32/32; `node scripts/comprobar-sitio.mjs` y `git diff --check` pasaron. Los tests HTTP solicitaron las 16 variantes y verificaron código 200 y MIME. La inspección visual local confirmó la portada y las ocho fotos renderizadas; el cálculo del candidato por viewport queda cubierto por `srcset`/`sizes` y pruebas unitarias, sin una medición Lighthouse ni captura de red emulada.
**Registro de cierre:** se generaron 16 variantes para portada y siete fotos de galería. La foto 08 (480 px original) no se amplió ni recibió una variante. El formato de cada original se conserva; las imágenes mantienen dimensiones intrínsecas, la portada usa `fetchPriority=high` y la galería `loading=lazy`/`decoding=async`. Se corrigió además una frase obsoleta del README que decía que la configuración seguía vacía.

**Actualización de contenido (12/10/2026):** se generaron ocho variantes responsive para las cuatro fotos nuevas. La configuración activa suma ahora 18 variantes entre portada y ocho fotos, manteniendo el formato de origen en cada una.

**Actualización de organización (12/10/2026):** se eliminaron las subcarpetas `nuevas/` y `variantes/` de la galería. Los ocho originales activos y sus 16 variantes responsive ahora están directamente en `images/portfolio/`, con nombres descriptivos. Se añadió una prueba que impide volver a referenciarlos desde subcarpetas.

### Paso 14 — SEO y revisión integral

**Estado:** completado (13/10/2026). **Depende de:** pasos 6 a 13.
**Objetivo:** dejar completo el sitio público.  
**Tareas:** mantener metadatos base, URL canónica, Open Graph, Twitter Cards, sitemap y `robots.txt` consistentes con `https://byser.com.ar/`. Favicon «S» e imagen social tipográfica aprobados y activos. Revisar castellano, accesibilidad, responsive, consola y alcance.
**Archivos:** `index.html`, `robots.txt`, `sitemap.xml`, `scripts/servidor-local.mjs`, `tests/estructura.test.mjs` y propuestas separadas en `docs/propuestas-identidad/`.
**Criterios de aceptación:** título, descripción y marca SER.; URL principal absoluta en canonical, Open Graph, sitemap y robots; Twitter Cards en castellano; favicon e imagen social aprobados y activos; sitio funcional y accesible en móvil y escritorio.
**Pruebas:** `node --test`, validador, comprobación HTTP, flujos de teclado/lightbox, contraste, consola y vista en 360, 390, 768 y 1440 px. Lighthouse no está instalado en el entorno; no se añadió una dependencia de auditoría.

**Registro parcial (12/10/2026):** se añadieron metadatos de tema y Open Graph (tipo, locale, título y descripción) y `robots.txt` con rastreo permitido. `node --test` pasó 32/32; `node scripts/validar-fotografias.mjs` pasó con nueve imágenes; `node scripts/comprobar-sitio.mjs` y `git diff --check` pasaron. La suite verificó etiquetas y ruta/MIME/contenido del archivo. En esa fecha todavía faltaban el dominio para canonical/sitemap, una imagen autorizada para `og:image` y el favicon.

**Actualización de identidad y dominio (13/10/2026):** SER. reemplaza la marca visible anterior en cabecera y portada; Sergio Gimenez permanece como autor en «Sobre mí». `https://byser.com.ar/` es la única URL principal en canonical, `og:url`, sitemap y robots. Se actualizaron título, descripciones, Open Graph y Twitter Cards. Se prepararon tres alternativas de favicon y una imagen social tipográfica de 1200 × 630 en `docs/propuestas-identidad/`; en ese momento no se habían activado los recursos visuales. `node --test` pasó 34/34, el validador confirmó nueve imágenes, la comprobación HTTP y `git diff --check` pasaron. Luego se aprobaron y activaron ambas propuestas, y se completó la revisión integral según el registro siguiente. No se tocó DNS, Nginx ni HTTPS.

**Aprobación del favicon (13/10/2026):** Sergio eligió la alternativa «S». Se copiaron las versiones PNG de 16 × 16 y 32 × 32 a `images/` y se enlazaron desde `index.html`. Las cinco pruebas de estructura y recursos HTTP pasaron. La propuesta de imagen social sigue sin activar y requiere aprobación independiente.

**Aprobación de imagen social (13/10/2026):** Sergio aprobó la propuesta tipográfica. Se incorporó `images/ser-open-graph.png` (1200 × 630, PNG de 8 bits) y se enlazó mediante URL absoluta en `og:image` y `twitter:image`, con dimensiones, tipo y texto alternativo. Las cinco pruebas de estructura y recursos HTTP pasaron. La revisión integral se completó posteriormente, como consta en el registro siguiente.

**Registro de revisión integral (13/10/2026):** se quitó el marcador de correo por decisión de Sergio y se dejó Instagram como único contacto visible. Se corrigió la variable de color inexistente del aviso de error de galería; el texto usa el color principal. `node --test` pasó 35/35; `node scripts/comprobar-sitio.mjs`, `node scripts/validar-fotografias.mjs` (nueve imágenes) y `git diff --check` pasaron. En navegador se comprobaron vistas de 360, 390, 768 y 1440 px sin desbordamiento horizontal, carga de portada y ocho fotos, navegación por teclado a Contacto, apertura/cierre de lightbox y foco restaurado. No hubo errores ni avisos de consola. Contraste medido: 16.05:1 en contenido principal/aviso, 6.73:1 en marcador y 16.34:1 en contacto. Lighthouse no estaba disponible en el entorno y no se agregó ninguna dependencia. El paso queda completado; la publicación en VPS sigue pendiente.

### Paso 15 — Publicación en Debian/Nginx

**Estado:** pendiente. **Depende de:** paso 14 y acceso al VPS.
**Objetivo:** servir el portfolio por HTTPS y documentar actualizaciones repetibles.  
**Tareas:** inspeccionar servicios existentes; preparar configuración Nginx, certificado, rutas y caché; documentar despliegue desde GitHub antes de tocar el servidor.  
**Archivos:** `README.md` y, si corresponde, configuración versionada en `deploy/`; cambios en VPS tras inspección y aprobación concreta.  
**Criterios de aceptación:** sitio disponible por HTTPS, redirección HTTP correcta, actualización reproducible y otros servicios operativos.  
**Pruebas:** `nginx -t`, comprobaciones HTTP/HTTPS, rutas, certificado, caché y flujos esenciales en producción.

## Registro de avance

Al iniciar cada paso se cambia su estado a `en progreso`. Al finalizar se anotan fecha, archivos modificados, comandos, resultados y criterios verificados. Si falta un insumo o falla una prueba, se registra la causa y se usa `bloqueado` cuando no pueda avanzarse. Tras cada paso se revisa el resultado antes de continuar.
