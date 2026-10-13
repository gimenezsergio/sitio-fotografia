# Especificación técnica — Portfolio SER.

**Versión:** 1.1
**Estado:** Listo para implementación  
**Alcance:** MVP del sitio público

## 1. Objetivo

Desarrollar el sitio público de SER., marca personal de Sergio Gimenez, fotógrafo especializado en moda y editorial en Buenos Aires, Argentina. El dominio oficial es `https://byser.com.ar/`.

SER es su diminutivo y alude al verbo «ser»: identidad, presencia y expresión. La marca visible se escribe siempre `SER.`. El nombre completo identifica al autor en «Sobre mí».

El sitio debe transmitir una identidad profesional, artística y confiable, especialmente a modelos que llegan desde convocatorias o publicidades de Instagram.

Debe funcionar como una revista de moda digital: las fotografías son protagonistas y la interfaz es minimalista.

No se busca un portfolio comercial tradicional ni una plataforma de fotografía generalista.

## 2. Alcance del MVP

Una única página pública con cuatro partes:

1. Portada editorial a pantalla completa.
2. Portfolio fotográfico de narrativa continua.
3. Presentación personal con retrato del fotógrafo.
4. Contacto mediante Instagram. El correo es opcional y se incorpora solo cuando Sergio lo proporcione.

Las fotografías podrán ampliarse mediante un lightbox.

El sitio será completamente responsive, priorizando dispositivos móviles.

### Fuera del alcance

- Panel de administración.
- Autenticación de usuarios.
- Formularios de contacto.
- Blog.
- Comercio electrónico.
- Base de datos.
- Gestor privado de sesiones.
- Galerías privadas y descarga de fotografías.

El gestor de sesiones será una aplicación independiente, desarrollada posteriormente y alojada bajo el mismo dominio mediante un subdominio.

## 3. Tecnologías

- HTML5 semántico.
- CSS3 Vanilla.
- JavaScript Vanilla con módulos ES.
- JSON para configurar las fotografías.
- Git y GitHub para control de versiones.
- Nginx sobre VPS Debian para producción.
- HTTPS.
- Sin frameworks frontend.
- Sin generadores estáticos.
- Sin backend para el portfolio.
- Sin servicios externos obligatorios para ejecutar la web.

No incorporar dependencias sin una justificación concreta.

## 4. Identidad visual

### Estética

Revista de moda de autor, elegante, sobria y minimalista.

Referencias conceptuales: publicaciones editoriales de moda, fotografía de autor y diseño de revistas impresas.

### Paleta

| Uso | Color |
|---|---|
| Fondo principal | `#F5F2EC` |
| Texto principal | `#171717` |
| Texto secundario | `#827C74` |
| Fondo del lightbox | `#151515` |

### Tipografía

- Cormorant Garamond para títulos editoriales.
- Inter para navegación, textos informativos y controles.
- Utilizar archivos de fuentes locales o alternativas de sistema.
- No depender de una conexión externa para mostrar la tipografía.

### Diseño

- Mobile first.
- Amplio protagonismo de las fotografías.
- Composición editorial asimétrica.
- Espacios negativos cuidadosamente utilizados.
- Sin bordes decorativos innecesarios.
- Sin sombras pronunciadas.
- Sin carruseles automáticos.
- Sin efectos parallax.
- Animaciones discretas y respetuosas de `prefers-reduced-motion`.

Todo el contenido visible debe estar en castellano.

## 5. Estructura de la página

### 5.1 Cabecera

Contiene exclusivamente:

- Marca: SER.
- Enlace: CONTACTO.

El enlace CONTACTO lleva a la sección final de la misma página.

La cabecera debe ser discreta y no ocultar contenido al desplazarse.

### 5.2 Portada

- Fotografía protagonista.
- Altura equivalente al área visible de la pantalla.
- Adaptación a formatos verticales y horizontales.
- Marca SER. y especialidad.
- Texto: «Fotografía de moda y editorial».
- Ubicación: «Buenos Aires, Argentina».

Evitar superponer texto sobre rostros.

Permitir configurar el encuadre de la fotografía para escritorio y celular.

### 5.3 Portfolio editorial

Mostrar inicialmente ocho fotografías, además de la portada.

La galería debe construirse mediante JavaScript a partir de `fotografias.json`.

Las fotografías aparecerán como una narrativa visual continua, sin categorías ni divisiones por sesión.

Composiciones admitidas:

- Imagen de ancho completo.
- Imagen vertical destacada.
- Pareja de fotografías.
- Composición asimétrica con desplazamiento vertical.

No mostrar títulos, fechas, números, ubicaciones ni pies de foto.

Las descripciones estarán disponibles únicamente para accesibilidad.

No aplicar recortes arbitrarios a las imágenes del portfolio. Preservar su proporción, salvo los encuadres editoriales configurados explícitamente.

### 5.4 Lightbox

Al seleccionar una fotografía:

- Abrir visor sobre fondo oscuro.
- Mostrar imagen completa sin recorte.
- Permitir avanzar y retroceder.
- Permitir cerrar con Escape.
- Permitir navegación con flechas del teclado.
- Incorporar gestos táctiles en dispositivos móviles.
- Cerrar mediante botón visible.
- Restaurar el foco al elemento original.
- Mantener el foco dentro del visor mientras esté abierto.
- Bloquear el desplazamiento de fondo.
- Respetar preferencias de movimiento reducido.

Los controles deben tener nombres accesibles en castellano.

No mostrar descripciones ni metadatos visibles.

### 5.5 Presentación personal

Mostrar:

- Retrato real del fotógrafo.
- Nombre.
- Presentación breve.
- Ubicación.

Texto provisional:

«Soy Sergio Gimenez, fotógrafo de moda y editorial en Buenos Aires. Me interesa construir imágenes donde el vestuario, la luz y los espacios dialoguen con la personalidad de cada modelo.»

El contenido debe poder modificarse fácilmente sin alterar la estructura del sitio.

### 5.6 Contacto

Fondo negro tinta.

Incluir:

- Invitación breve al contacto.
- Enlace a Instagram: `https://www.instagram.com/sergiogimenezph/`
- No mostrar correo ni un marcador de correo mientras no se proporcione una dirección.

No incorporar formularios.

## 6. Estructura de archivos

```text
portfolio-fotografia/
├── index.html
├── css/
│   ├── styles.css
│   ├── responsive.css
│   └── lightbox.css
├── js/
│   ├── main.js
│   ├── gallery.js
│   └── lightbox.js
├── data/
│   └── fotografias.json
├── images/
│   ├── portada/
│   ├── portfolio/
│   └── perfil/
├── fonts/
├── scripts/
│   └── validar-fotografias.mjs
├── tests/
├── README.md
└── .gitignore
```

Se pueden ajustar los nombres de archivos si existe una justificación técnica.

## 7. Configuración fotográfica

Utilizar JSON como fuente de datos.

Ejemplo:

```json
{
  "fotografias": [
    {
      "id": "portada",
      "archivo": "/images/portada/portada.webp",
      "alt": "Modelo en una producción editorial urbana",
      "composicion": "portada",
      "posicionMovil": "50% 30%",
      "posicionEscritorio": "50% 50%"
    },
    {
      "id": "editorial-01",
      "archivo": "/images/portfolio/01.webp",
      "alt": "Retrato de moda con iluminación natural",
      "composicion": "ancho-completo"
    },
    {
      "id": "editorial-02",
      "archivo": "/images/portfolio/02.webp",
      "alt": "Fotografía editorial en exteriores",
      "composicion": "pareja-izquierda"
    },
    {
      "id": "editorial-03",
      "archivo": "/images/portfolio/03.webp",
      "alt": "Retrato editorial con arquitectura urbana",
      "composicion": "pareja-derecha"
    }
  ]
}
```

### Validaciones

- Cada fotografía tiene un identificador único.
- El archivo existe.
- La composición es válida.
- Existe descripción alternativa.
- La configuración incluye exactamente una portada.
- Las parejas fotográficas están completas.
- El orden del JSON determina el orden visual.

Si falla la carga del JSON, mostrar un mensaje discreto en castellano.

## 8. Rendimiento y accesibilidad

- Usar imágenes WebP y, cuando convenga, AVIF.
- Generar variantes de resolución para dispositivos diferentes.
- Implementar `srcset` y `sizes` cuando corresponda.
- Evitar descargar imágenes grandes innecesariamente.
- Priorizar la carga de la portada.
- Aplicar lazy loading al resto de las fotografías.
- Definir dimensiones para evitar saltos de diseño.
- Evitar dependencias JavaScript innecesarias.
- Mantener HTML semántico.
- Garantizar navegación por teclado.
- Utilizar contraste suficiente.
- Respetar `prefers-reduced-motion`.

El HTML inicial debe contener el contenido textual principal, aunque la galería se genere desde JavaScript.

## 9. SEO y metadatos

Implementar:

- Título descriptivo.
- Meta description.
- Idioma `es-AR`.
- Open Graph.
- Imagen tipográfica para compartir enlaces, aprobada y activa en 1200 × 630 píxeles.
- Favicon «S» aprobado, activo en 16 × 16 y 32 × 32 píxeles.
- URL canónica `https://byser.com.ar/`.
- Sitemap con la URL principal absoluta.
- `robots.txt`.

Open Graph y Twitter Cards usan SER. y la misma URL principal. `og:image` y `twitter:image` apuntan a `https://byser.com.ar/images/ser-open-graph.png`; la imagen no usa fotografías externas. Las propuestas originales están en `docs/propuestas-identidad/` y no forman parte de la página publicada.

No utilizar fotografías de terceros como si fueran trabajos del fotógrafo.

Las imágenes provisionales deben identificarse claramente durante el desarrollo.

## 10. Plan de implementación — Baby steps

Cada paso debe completarse y probarse antes de avanzar al siguiente.

### Paso 1 — Inicialización

**Implementar:** estructura de carpetas, Git, HTML básico y README.

**Aceptar cuando:** el sitio abre localmente mediante un servidor HTTP y no presenta errores de consola.

**Pruebas:** verificar archivos, rutas y respuesta HTTP.

### Paso 2 — Sistema visual

**Implementar:** variables CSS, fuentes, estilos globales y reglas responsive iniciales.

**Aceptar cuando:** colores y tipografías se aplican correctamente en celular y escritorio.

**Pruebas:** comprobar contraste, legibilidad y ausencia de desplazamiento horizontal.

### Paso 3 — Cabecera

**Implementar:** nombre y enlace CONTACTO.

**Aceptar cuando:** el enlace desplaza correctamente a la sección de contacto.

**Pruebas:** navegación por teclado, foco y visualización móvil.

### Paso 4 — Portada

**Implementar:** fotografía a pantalla completa, nombre, especialidad y ubicación.

**Aceptar cuando:** la portada se adapta a diferentes proporciones sin ocultar información importante.

**Pruebas:** 360, 390, 768 y 1440 píxeles de ancho.

### Paso 5 — Configuración JSON

**Implementar:** lectura de `fotografias.json`, validación y tratamiento de errores.

**Aceptar cuando:** JavaScript interpreta correctamente la configuración.

**Pruebas:** JSON válido, JSON inválido, identificadores repetidos y archivos inexistentes.

### Paso 6 — Galería editorial

**Implementar:** renderizado dinámico de fotografías y composiciones.

**Aceptar cuando:** modificar el orden del JSON modifica el orden de las fotografías sin editar HTML.

**Pruebas:** orden, proporciones, composiciones y responsive.

### Paso 7 — Lightbox básico

**Implementar:** apertura, cierre y navegación entre fotografías.

**Aceptar cuando:** todas las imágenes del portfolio pueden ampliarse y recorrerse.

**Pruebas:** botones, Escape y flechas.

### Paso 8 — Lightbox accesible y móvil

**Implementar:** gestión del foco, bloqueo del scroll, gestos táctiles y comportamiento responsive.

**Aceptar cuando:** funciona correctamente con teclado, mouse y pantalla táctil.

**Pruebas:** navegación accesible, cierre, restauración del foco y ausencia de scroll de fondo.

### Paso 9 — Presentación personal

**Implementar:** retrato y texto.

**Aceptar cuando:** la sección se visualiza correctamente en celular y escritorio.

**Pruebas:** responsive y accesibilidad.

### Paso 10 — Contacto

**Implementar:** Instagram y navegación desde la cabecera. El correo es opcional y requiere una dirección confirmada.

**Aceptar cuando:** los enlaces funcionan y no existe formulario.

**Pruebas:** enlace externo y navegación interna; si se incorpora correo, verificar su `mailto:`.

### Paso 11 — Optimización

**Implementar:** imágenes responsive, carga diferida, metadatos y mejoras de rendimiento.

**Aceptar cuando:** la página mantiene buena velocidad y estabilidad visual.

**Pruebas:** Lighthouse, accesibilidad, carga móvil simulada y errores de consola.

### Paso 12 — Publicación en VPS

**Implementar:** configuración de Nginx, HTTPS y despliegue desde GitHub.

**Aceptar cuando:** el sitio está disponible mediante HTTPS y una actualización puede publicarse de forma reproducible.

**Pruebas:** carga del sitio, rutas, caché, certificados y despliegue.

No modificar servicios existentes del VPS sin inspeccionarlos previamente.

## 11. Estrategia de pruebas

Utilizar pruebas automatizadas donde aporten valor.

**Pruebas de datos:** script Node para validar JSON, identificadores, composiciones y archivos.

**Pruebas funcionales:** Playwright para navegación, galería, lightbox y contacto.

**Pruebas visuales:** comprobar resoluciones móviles, tablet y escritorio.

**Pruebas de rendimiento:** Lighthouse en una compilación representativa, sin fijar objetivos arbitrarios antes de medir.

**Pruebas de accesibilidad:** teclado, foco, textos alternativos, contraste y movimiento reducido.

## 12. Reglas para el agente de programación

1. Trabajar exclusivamente en el portfolio público.
2. No implementar todavía el gestor privado de sesiones.
3. No incorporar frameworks.
4. No utilizar Netlify.
5. No utilizar Eleventy.
6. No agregar textos en inglés a la interfaz.
7. No inventar fotografías definitivas ni atribuir imágenes ajenas al fotógrafo.
8. Mantener el diseño mobile first.
9. No agregar funcionalidades fuera del alcance.
10. Trabajar en pasos pequeños.
11. Ejecutar las pruebas correspondientes a cada paso.
12. Informar qué archivos se modificaron y qué pruebas se ejecutaron.
13. No avanzar automáticamente a funcionalidades nuevas sin revisar el resultado de la etapa anterior.
14. Mantener la configuración de las fotografías separada de la presentación visual.

## 13. Criterio de finalización del MVP

El MVP estará terminado cuando:

- La página pública funcione correctamente en dispositivos móviles y escritorio.
- La portada y el portfolio se rendericen desde la configuración.
- Las fotografías mantengan una composición editorial coherente.
- El lightbox funcione de manera accesible.
- La presentación personal y los enlaces de contacto estén disponibles.
- No existan errores importantes de consola.
- Las pruebas automatizadas principales pasen.
- El sitio pueda publicarse y actualizarse en el VPS Debian.

## 14. Pendientes

- Texto definitivo de presentación.
- Configuración específica de despliegue según los servicios existentes en el VPS.

Estos pendientes no deben impedir construir y probar el MVP localmente.
