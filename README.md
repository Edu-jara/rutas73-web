Nombre del Proyecto: Rutas73Viajes-City Bell
Descripción:
Este proyecto es una página web básica desarrollada para que los usuarios puedan reservar  pasajes al recital que mas les guste.tambien van a poder ver fotos de viajes anteriores,ver nuestra trayectoria a lo largo de estos 26 años de Ruta73.
El objetivo es que las personas puedan navegar por la pagina y ver futuros recitales, buscarse en la seccion fotos y compar su boleto al proximo concierto.


# Proyecto Rutas 73 - Gestión de Viajes

## Configuración de Contacto (Formspree)
Para que el formulario de contacto sea funcional, utilicé **Formspree**.

### ¿Cómo lo configuré?
1. Creé una cuenta en Formspree.io.
2. Generé un "New Form" vinculado a mi correo electrónico profesional.
3. Integré la URL de la API en el atributo `action` de la etiqueta `<form>` en mi HTML.
4. Aseguré que cada campo (`input` y `textarea`) tuviera un atributo `name` único para que los datos se procesen correctamente.

### ¿Por qué es útil?
Es fundamental porque el HTML por sí solo no tiene la capacidad de enviar correos. Formspree actúa como un **puente (Backend)** que recibe los datos del formulario, los procesa y los envía a mi bandeja de entrada sin necesidad de programar un servidor propio.