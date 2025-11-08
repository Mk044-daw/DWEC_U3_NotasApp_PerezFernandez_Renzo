# Guía de usuario — NotasApp

**Propósito**: Aplicación sencilla para crear y gestionar recordatorios, filtrarlos por **Hoy / Semana / Todas** y visualizar el **Panel Diario** en una ventana separada.

---

## Requisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari actual).  
- **Permitir pop-ups** para abrir el Panel Diario.  
- Conexión local (por ejemplo, abrir con VS Code “Live Server”).

---

## Tareas Esenciales

### 1) Añadir una nota
1. En “Nueva nota” escribe el **texto** de la nota.
2. Elige una **fecha** (por defecto, hoy).
3. Selecciona **prioridad** (Alta/Media/Baja).
4. Pulsa **Añadir**.  
   - Si falta texto o la fecha no es válida, verás un **mensaje** y no se añadirá.
   - Al añadir, la app hace **scroll** a la lista y verás la nueva tarjeta.

### 2) Aplicar filtros (Hoy / Semana / Todas)
- Usa los botones del encabezado: **Hoy**, **Semana** o **Todas**.  
- La vista cambia **sin recargar** y el botón activo se **resalta**.  
- El filtro actual también aparece en el pie (“Filtro: …”).

### 3) Completar / Deshacer
- En cada tarjeta, pulsa **Completar** para marcarla como hecha.  
- Si está completada, el botón pasa a **Deshacer**.  
- Las completadas aparecen con menor opacidad y tachadas.

### 4) Borrar una nota
- Pulsa **Borrar** en la tarjeta.  
- Confirma en el cuadro de diálogo.  
- Si confirmas, desaparece de la lista.

### 5) Abrir el Panel Diario (ventana separada)
- Pulsa **Abrir Panel Diario**.  
- Si el navegador bloquea pop-ups, **permite** las ventanas emergentes.  
- En el panel verás las notas **relevantes** según el filtro activo (Hoy/Semana/Todas).  
- Desde el panel puedes **solicitar borrado** de una nota (se refleja en la ventana principal).

### 6) Pantalla completa (opcional)
- Pulsa el botón **⛶** para entrar/salir de pantalla completa.  
- Si no se puede (por política del navegador), la app lo indicará.

---

## Preferencias y Persistencia
- La app **recuerda** tus **notas** usando `localStorage`.  
- El **filtro activo** se recuerda durante la **sesión** en `sessionStorage`.  
- Si borras datos del navegador o usas incógnito, podrás perder el estado.

---

## Resolución de Problemas
- **“No se abre el Panel”**:  
  - Habilita **pop-ups** para el sitio.  
  - Comprueba que no haya bloqueadores que impidan `window.open`.
- **“No entra en pantalla completa”**:  
  - Algunos navegadores requieren un **gesto** del usuario o no lo permiten en ventanas específicas.  
  - En móvil/iOS, Fullscreen puede estar limitado.
- **“No se guardan mis notas”**:  
  - Verifica que el navegador permita **localStorage**.  
  - Si el almacenamiento está lleno o bloqueado, aparecerá un aviso en la **consola** (DevTools).
- **“Formato de fecha distinto”**:  
  - Depende del **idioma** del navegador. Se usa `navigator.language` para formatear.

---

## Accesibilidad Básica
- Mensajes de estado en elemento con `aria-live` para lectores de pantalla.  
- Botón de filtro activo con `aria-current="page"`.  
- Texto de usuario impreso como **texto escapado** (sin HTML ejecutable).

---

## Notas Técnicas (resumen para curiosos)
- SPA sin frameworks.  
- Filtros de vista mediante `location.hash` y `hashchange`.  
- Panel separado con `postMessage`, contrato de datos `{ tipo, ts, filtro, notas }` y validación de origen.  
- Persistencia mediante **Web Storage**.
