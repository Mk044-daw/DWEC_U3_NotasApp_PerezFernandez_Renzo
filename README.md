# NotasApp — DWEC U3 (SPA sin frameworks)

Mini-aplicación para crear y gestionar notas/recordatorios con filtros por **Hoy / Semana / Todas**, **persistencia en navegador**, y **Panel Diario** en ventana separada con comunicación segura mediante `postMessage`.

---

## Estructura del proyecto
- `index.html` — Estructura de la SPA, botones de filtros, pantalla completa y acceso al Panel Diario.
- `styles.css` — Estilos base, marca visual por **prioridad** y **estado**, y resaltado del filtro activo.
- `app.js` — Lógica de negocio y de interfaz (DOM, filtros por `location.hash`, persistencia, comunicación con el panel).
- `panel.html` — Panel Diario: recibe *snapshot* autosuficiente y muestra notas relevantes.
- `README.md` — Este documento.
- `guia_usuario.md` — Guía breve para personas usuarias.

---

## Objetivos de aprendizaje (RA/CE)
**RA del módulo**: “Escribe código, identificando y aplicando las funcionalidades aportadas por los objetos predefinidos del lenguaje.”

**CE (síntesis)**: objetos predefinidos; ventana/documento; generación de HTML; modificación de aspecto; interacción; cookies/almacenamiento; depuración y documentación.

### Matriz RA–CE
| Área | Implementación | Archivo(s) |
|-----|-----------------|------------|
| **Objetos nativos** (Date/Math/String/Number) | Normalización y comparación de fechas, clamp de prioridad, limpieza de cadenas, ordenación | `app.js` |
| **Interacción con navegador** | `navigator.language`, `location.hash`, Fullscreen API | `app.js`, `index.html` |
| **Generación de HTML** | Render dinámico de tarjetas con DOM API | `app.js` |
| **Apariencia/viewport** | Scroll a lista tras añadir, fullscreen; marcas por prioridad/estado | `app.js`, `styles.css` |
| **Ventanas y comunicación** | `window.open`, `postMessage` con **validación de origen** y **contrato de datos** | `app.js`, `panel.html` |
| **Persistencia en navegador** | `localStorage` (notas) y `sessionStorage` (filtro activo) | `app.js` |
| **Depuración y documentación** | `console.warn` y comentarios críticos; este README y guía de usuario | `app.js`, docs |

---

## Requisitos funcionales (RF)

> En el código se han añadido comentarios de línea con etiquetas (RFx) que referencian estas secciones.

- **RF1. Objetos nativos (`Date`, `Math`, `String`, `Number`)**  
  - Fechas: `inicioDeDia`, `finDeDia`, `hoyYMD`, `ymdToDate`, `enRangoIncl`, `formatDate`.  
  - Prioridad y números: `sanitizeNota` (clamp 1..3) y `ordenarNotas`.  
  - Cadenas: `sanitizeNota` y `escapeHtml`.
- **RF2. Idioma del navegador**  
  - `lang = navigator.language` y `Intl.DateTimeFormat(lang, {dateStyle:'medium'})`; además se muestra el idioma en el pie.
- **RF3. Filtros con `location.hash`**  
  - Estados `#hoy`, `#semana`, `#todas`; `hashchange` → `aplicarFiltroHash()`; resaltado `.activo` / `aria-current`.
- **RF4. Generación dinámica de HTML**  
  - `render()` crea/actualiza tarjetas; sin plantillas preexistentes; entradas escapadas con `escapeHtml`.
- **RF5. Prioridades y validaciones**  
  - Orden: no completadas → prioridad **DESC** → fecha ASC → texto ASC; validaciones de texto/fecha y confirmación al borrar.
- **RF6. Viewport/scroll/pantalla completa**  
  - `scrollIntoView` tras crear; botón **⛶** con Fullscreen API y fallback vía `alert`.
- **RF7. Ventana auxiliar (Panel Diario) y comunicación**  
  - `window.open('panel.html')`; `postMessage` **con origen validado** y **tipo de mensaje** (contrato).
- **RF8. Interacción con el usuario**  
  - `alert`/`confirm`; feedback accesible con `aria-live` en altas/errores/acciones.
- **RF9. Persistencia local (elección justificada)**  
  - `localStorage` → **notas**; `sessionStorage` → **filtro activo**. Manejo de corrupción con `try/catch` y saneo defensivo.
- **RF10. Snapshot al Panel**  
  - Envío `{ tipo:'SNAPSHOT', ts, filtro, notas }` y recepción con validación estricta; el Panel es autosuficiente.
- **RF11. Guía de usuario**  
  - Incluida como `guia_usuario.md` (1–2 páginas).
- **RF12. Depuración y documentación técnica**  
  - Comentarios críticos + `console.warn` en persistencia/comunicación; esta documentación.
- **RF13. Gestión del proyecto en Trello y GitHub**  
  - Añadir tablero y repo (ver sección “Entrega”).

---

## Persistencia: **Web Storage** vs **Cookies**

- **Elegido**: **Web Storage**  
  - `localStorage` para **notas** → mayor tamaño (~5–10 MB aprox.), **no se envían** a servidor, API simple.  
  - `sessionStorage` para **filtro activo** → estado efímero por pestaña/sesión (alineado con “Mejora B”).
- **Por qué no Cookies**:  
  - Límite de ~4 KB por cookie, se **envían en cada petición** HTTP, complejidad de caducidades y política SameSite.  
  - Riesgos de exposición si no hay HTTPS; aquí no hay necesidad de ser leídas por servidor.
- **Implicaciones**:  
  - Borrar datos del navegador o usar navegación privada elimina el estado.  
  - En equipos públicos, cerrar sesión/ventana limpia el `sessionStorage` (solo filtro).

---

## Seguridad y Compatibilidad

- **`postMessage`**: solo a `location.origin` y se **valida `ev.origin`** al recibir. Ignora mensajes ajenos al **contrato** (tipo, estructura).  
- **Escape de HTML**: el texto de las notas se inyecta **escapado** con `escapeHtml`.  
- **Fullscreen**: algunos navegadores requieren **gesto del usuario**; en iOS/Safari puede estar limitado.  
- **Pop-ups**: si están bloqueados, la app informa para permitir el Panel.

### Navegadores Objetivo
- Chrome/Edge/Firefox recientes. Safari moderno soporta la mayor parte pero con limitaciones en Fullscreen.

---

## Pruebas / Evidencias de Depuración
Capturas de resultado final:  
  - Visualización de página principal.  
  - Ventana emergente de **Panel Diario**.  
  - Funcionalidades de los estados `#hoy`, `#semana`, `#todas`.  
  - Ventana emergente de confimación al borrar.  
  - Fullscreen activo/inactivo.

Ubicadas en carpeta: `/evidencia`

---

## Cómo ejecutar
1. Abrir `index.html` con un servidor estático (recomendado “Live Server” de VS Code).  
2. Permitir pop-ups para que el **Panel Diario** funcione correctamente.  
3. Probar filtros (`Hoy/Semana/Todas`) y abrir el Panel.  

---

## Entrega
- **GitHub**: sube el repo con `index.html`, `styles.css`, `app.js`, `panel.html`, `README.md`, `guia_usuario.md`.
- **Trello**: tablero con listas `Backlog`, `En curso`, `En revisión`, `Hecho` (+ `Bloqueos/Riesgos` opcional).  
  - Tarjetas = historias de usuario (del enunciado) con criterios de aceptación y **checklists** (Desarrollo, Pruebas/Depuración, Documentación).  
  - **Definition of Done**: cumple criterios, incluye evidencias de depuración y documentación.  
  - Añade al profesor como miembro: `juan.ramirez46@educa.madrid.org`.
- Incluye **enlaces** a Trello y GitHub en la plataforma/entrega final.

---

## Asistencia y Referencias

Durante el desarrollo del proyecto se utilizó **inteligencia artificial (IA)** como herramienta de apoyo **exclusivamente en tareas de documentación, organización del código y mejora estructural**, sin delegar en ella la totalidad de la implementación.

En concreto:
- Se empleó IA para **comentar el código** y **documentar la relación entre requisitos funcionales (RF1–RF13)** y sus respectivas secciones dentro del proyecto.  
- Se empleó IA como apoyo en la definición y mejora de funciones específicas, como `sanitizeNota()` y `escapeHtml()`, cuyo propósito es sanear y validar los datos introducidos por el usuario, evitando inyecciones de código o errores de formato.
- Se empleó IA en la **Mejora B (avanzada)** relativa al uso de `sessionStorage` para mantener el filtro activo durante la sesión y el envío del **snapshot JSON** al Panel Diario mediante `postMessage` con validación de origen— fue generada inicialmente con ayuda de IA, y posteriormente **verificada y adaptada manualmente** para ajustarse a la estructura simplificada del código base.  
- Se empleó IA para diseñar el **esquema de comunicación segura entre ventanas** (contrato `{ tipo, ts, filtro, notas }`), asegurando que el **Panel Diario** fuera autosuficiente y cumpliese las políticas de origen y seguridad requeridas.  
- Se empleó IA para los **comentarios explicativos por cada requisito (RF)**, la redacción del **README**, la **Guía de usuario** y la **verificación del cumplimiento de los criterios técnicos mínimos (CT1–CT7)**.


El código, las pruebas y las decisiones finales de diseño fueron **revisadas, depuradas y adaptadas manualmente** por los autores para garantizar coherencia con la base original entregada.

### Fuentes de documentación complementarias
Durante el desarrollo se consultaron recursos didácticos y de referencia reconocidos, entre ellos:

- [MDN Web Docs (Mozilla Developer Network)](https://developer.mozilla.org/) — documentación oficial de APIs web, objetos predefinidos y métodos DOM.
- [W3Schools JavaScript Reference](https://www.w3schools.com/js/) — consultas básicas sobre sintaxis, métodos y ejemplos de `localStorage`, `postMessage`, y `Date`.
- **Consola del navegador / DevTools** — para verificación de persistencia, comunicación entre ventanas y pruebas de Fullscreen API.

Estas fuentes se utilizaron como **guía conceptual y de referencia técnica**, no como plantillas de código.

---

## Autoría
- Pérez Fernandez, Miguel Ángel
- Robles Zegarra, Renzo Jesús
