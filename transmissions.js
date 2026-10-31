// Configuración reutilizable: añade o modifica transmisiones aquí.
// Cada transmisión puede tener su propia frecuencia y archivo de audio.
window.MYSTERY_CONFIG = {
  title: "Mystery Radio Cache",
  transmissions: [
    { id: "01", title: "Transmission 01", targetFrequency: 96.7, startFrequency: 94.0, audio: "assets/transmission-01.mp3", tolerance: 0.035 },
    { id: "02", title: "Transmission 02", targetFrequency: 101.3, startFrequency: 94.0, audio: "assets/transmission-02.mp3", tolerance: 0.035 },
    { id: "03", title: "Transmission 03", targetFrequency: 104.5, startFrequency: 94.0, audio: "assets/transmission-03.mp3", tolerance: 0.035 }
  ]
};
