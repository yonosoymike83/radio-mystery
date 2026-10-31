# Mystery Radio Cache

Web estática responsive para GitHub Pages. La portada replica la estructura visual de Chess Mystery Cache: logo centrado, nombre y botones grandes para seleccionar transmisión. No incluye selector de idiomas.

## Archivos principales
- `index.html`: portada y selector de transmisiones.
- `radio.html`: interfaz de la radio retro.
- `transmissions.js`: nombre del caché, listado, frecuencias y archivos de audio.
- `app.js` y `style.css`: motor de sintonización y diseño de la radio.
- `assets/mystery-radio-logo.png`: logo.

## Añadir transmisiones
Edita `transmissions.js` y añade un objeto al array `transmissions`, con `id`, `title`, `targetFrequency`, `startFrequency`, `audio` y `tolerance`. Después añade el MP3 correspondiente dentro de `assets/`.

Las coordenadas deben estar únicamente en la locución. La interfaz no muestra una transcripción ni imprime las coordenadas en pantalla.

## Publicar en GitHub Pages
Sube el contenido de esta carpeta a la raíz del repositorio y activa GitHub Pages desde Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
