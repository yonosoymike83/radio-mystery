# Mystery Radio

Aplicación web estática para una Mystery Cache. Simula una radio FM portátil de los años 70.

## Probarla
Abre `index.html` en un navegador moderno. Para probar el audio en condiciones reales, es recomendable servir la carpeta mediante un servidor local o GitHub Pages.

## Personalización
Edita el objeto `config` al principio de `app.js`:
- `targetFrequency`: frecuencia donde está la emisora.
- `message`: texto de referencia que aparece al encontrarla.
- `tolerance`: precisión necesaria para sintonizar.
- `startFrequency`: frecuencia inicial.

Coloca tu locución grabada en `assets/transmission.mp3`. El archivo se reproduce en bucle mientras el jugador está cerca de la emisora y su volumen aumenta al afinar la frecuencia.

## Publicar en GitHub Pages
Sube `index.html`, `style.css`, `app.js`, `README.md` y la carpeta `assets` a un repositorio. Activa Pages desde la rama principal y la carpeta raíz.

## Nota
Esta versión es un prototipo funcional de interfaz y sintonización. El texto y las coordenadas incluidos son marcadores de posición: sustitúyelos por tu mensaje real antes de publicar el geocaché.
