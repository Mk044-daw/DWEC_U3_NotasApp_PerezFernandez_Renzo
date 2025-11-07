# DWEC_U3_NotasApp_PerezFernandez_Renzo
Reto ABP: Tablon de notas inteligente (Unidad 3 DWEC)

## Estructura del proyecto

	├─ src/

		│  ├─ index.html

		│  ├─ styles.css

		│  ├─ app.js

		│  └─ panel-diario.html

	├─ guia_usuario.md

	├─ README.md

		└─ evidencias/

  	├─ commits.txt
	 
 	├─ tests.txt
	 
	├─ screenshot_localstorage.png
	 
	   └─ screenshot_console.png
## Objetivo
> Aplicación web que permite **crear, gestionar y filtrar notas o recordatorios personales**, aplicacando el uso de objetos predefinidos como **Date, Math, String** , almacenamiento local y comunicacion entre ventanas.

---

## Funcionalidades principales

> Uso de objetos nativos: `Date`, `Math`, `String`, `Number`.

> Filtros con `location.hash` (`#todas`, `#hoy`, `#semana`).

> Generación de HTML por código (crear, actualizar, borrar).

> Panel Diario (ventana secundaria + `postMessage` seguro).

> Persistencia con **localStorage**.

> Control básico de viewport, scroll y fullscreen.

> Confirmaciones y mensajes de usuario.

> Detección de idioma del navegador (`navigator.language`).

---

## Justificacion del uso de Web Storage

Se eligio **localStorage** frente a cookies debido a que:
>Permite almacenar hasta 5MB de datos frente a solo 4KB.

>No viaja con cada peticion HTTP -> mejora el rendimiento.

>Es mas sencillo de usar con JSON.

>Persistente incluso al cerrar el navegador.

---

## Matriz RA-CE
	| Resultado de Aprendizaje (RA) | Criterio de Evaluación (CE) | Evidencia en el Proyecto |
	
	
	
	| RA1 : Escribe código aplicando la sintaxis del lenguaje. | CE1.1 Usa objetos predefinidos del lenguaje con propósito claro. | Uso de `Date`, `Math`, `String`, `Number` en app.js para fechas, IDs y formato. |
	| RA2: Genera interfaces dinámicas en cliente. | CE2.1 Manipula el DOM de forma segura (crear/actualizar/eliminar nodos). | Funciones de renderizado dinámico y actualización en tiempo real. |
	| RA3: Implementa gestión de estado y almacenamiento. | CE3.1 Elige y justifica cookies o Web Storage. |Justificación del uso de `localStorage` (persistencia local, sin tráfico HTTP). |
	| RA4 : Implementa control de eventos y navegación. | E4.1 Usa `location.hash` y escucha `hashchange`. | Filtros de notas por `#hoy`, `#favoritas`, `#tag/...`. |
	| RA5 : Asegura comunicación entre ventanas. | CE5.1 Abre ventana (Panel Diario) y valida origen. | Comunicación mediante `postMessage` validado. |
	| RA6: Usa control de viewport y responsive. | CE6.1 Ajusta la interfaz según `window.innerWidth`. | Adaptación a móvil, scroll automático y fullscreen. |
	| RA7: Documenta y presenta el trabajo. | CE7.1 Entrega guía de usuario, evidencias y repositorio. | Archivos `README.md`, `guia_usuario.md`, `evidencias/`. |

---

## Evidencias depuracion
-Capturas en carpeta `Evidencias`.

-Consola: mensajes de carga, errores y guardado.

-Validacion de datos y postMessage.

---

## Enlaces
-Trello: https://trello.com/b/uw06MPRm/dwec-u-notasappperezfernandezrenzo

-GitHub: https://github.com/Mk044-daw/DWEC_U3_NotasApp_PerezFernandez_Renzo

---


## IA 
> Se utilizo para generar plantillas de codigo y documentacion.

> Todos los fragmentos fueron revisados y adaptados manualmente por los autores. 

---

## Autores
> Jesus Renzo

> Miguel Angel Perez

---


