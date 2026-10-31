const $ = id => document.getElementById(id);
const config = {
  minFrequency: 88.0,
  maxFrequency: 108.0,
  startFrequency: 94.0,
  targetFrequency: 96.7,
  // Cambia este texto por la locución y las coordenadas de tu Mystery.
  message: "Atención, atención. Has encontrado la frecuencia correcta. Anota las coordenadas: N 00 grados 00.000, E 000 grados 00.000. Repetimos: N 00 grados 00.000, E 000 grados 00.000.",
  tolerance: 0.035,
  voiceFile: "assets/transmission.mp3"
};

let frequency = config.startFrequency;
let powered = false;
let audioContext, noiseSource, noiseGain, filter, voiceGain, voiceSource;
let voiceStarted = false;
let raf = null;
const voice = $("voiceAudio");

function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function distance(){return Math.abs(frequency-config.targetFrequency)}
function quality(){
  // Ventana de recepción suave: la voz aparece gradualmente al acercarse.
  return Math.pow(Math.max(0,1-distance()/0.85),1.65);
}
function setFrequency(value){
  frequency=clamp(value,config.minFrequency,config.maxFrequency);
  const pct=(frequency-config.minFrequency)/(config.maxFrequency-config.minFrequency);
  $("needle").style.left=(pct*100)+"%";
  $("frequencyReadout").innerHTML=frequency.toFixed(1)+" <small>MHz</small>";
  $("frequencyLabel").textContent=frequency.toFixed(1)+" MHz";
  $("knob").style.transform=`rotate(${(pct*270-135)}deg)`;
  $("knob").setAttribute("aria-valuenow",frequency.toFixed(1));
  updateSoundAndUI();
}
function initAudio(){
  if(audioContext)return;
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC){$("feedback").textContent="Este navegador no permite generar el audio de la radio.";return}
  audioContext=new AC();
  const bufferSize=2*audioContext.sampleRate;
  const buffer=audioContext.createBuffer(1,bufferSize,audioContext.sampleRate);
  const data=buffer.getChannelData(0);
  for(let i=0;i<bufferSize;i++)data[i]=Math.random()*2-1;
  noiseSource=audioContext.createBufferSource();noiseSource.buffer=buffer;noiseSource.loop=true;
  filter=audioContext.createBiquadFilter();filter.type="bandpass";filter.frequency.value=1100;filter.Q.value=0.7;
  noiseGain=audioContext.createGain();noiseGain.gain.value=0.0;
  noiseSource.connect(filter).connect(noiseGain).connect(audioContext.destination);
  voiceGain=audioContext.createGain();voiceGain.gain.value=0;
  noiseSource.start();
  // Si existe un MP3, se enruta por Web Audio para mezclar voz y estática.
  try{
    voiceSource=audioContext.createMediaElementSource(voice);
    voiceSource.connect(voiceGain).connect(audioContext.destination);
  }catch(e){console.warn("No se pudo conectar el audio de voz",e)}
}
async function powerOn(){
  initAudio();
  if(!audioContext)return;
  await audioContext.resume();
  powered=true;
  $("powerLed").parentElement.classList.add("on");
  $("powerLed").style.background="#e24e40";
  $("statusText").textContent="ON";
  $("powerButtonText").textContent="APAGAR RADIO";
  noiseSource && (noiseGain.gain.setTargetAtTime(0.16,audioContext.currentTime,.08));
  voiceStarted=false;
  try{voice.currentTime=0;await voice.play();voice.pause();}catch(e){}
  updateSoundAndUI();
  startAnimation();
}
function powerOff(){
  powered=false;
  if(audioContext){noiseGain.gain.setTargetAtTime(0,audioContext.currentTime,.08);voiceGain.gain.setTargetAtTime(0,audioContext.currentTime,.08)}
  voice.pause();voiceStarted=false;
  $("powerLed").parentElement.classList.remove("on");
  $("powerLed").style.background="#51595d";
  $("statusText").textContent="OFF";
  $("powerButtonText").textContent="ENCENDER RADIO";
  $("feedback").textContent="Radio apagada.";
  $("transmission").hidden=true;
  $("signalCaption").textContent="NO SIGNAL";
  $("meterFill").style.width="0%";
  $("stereoLed").style.background="#4c4a3d";
  if(raf)cancelAnimationFrame(raf);
}
function updateSoundAndUI(){
  const q=quality();
  const near=distance();
  const level=Math.round(q*8);
  [...$("signalBars").children].forEach((bar,i)=>{
    bar.style.background=i<level?(q>.92?"#79c98b":"#d9a34d"):"#46504f";
    bar.style.filter=i<level?"drop-shadow(0 0 3px #d9a34d)":"none";
  });
  $("meterFill").style.width=(q*100)+"%";
  $("signalCaption").textContent=q>.92?"LOCKED":q>.15?"WEAK SIGNAL": "NO SIGNAL";
  $("stereoLed").style.background=q>.75?"#79c98b":"#4c4a3d";
  if(!powered){$("feedback").textContent="Enciende la radio para comenzar la búsqueda.";return}
  if(near<config.tolerance){
    $("feedback").textContent="¡Frecuencia encontrada! Mantén la sintonización.";
    $("transmission").hidden=false;
    $("transcript").textContent=config.message;
  }else if(q>.6){
    $("feedback").textContent="Estás muy cerca… afina lentamente la sintonización.";
    $("transmission").hidden=true;
  }else if(q>.12){
    $("feedback").textContent="Señal débil. La voz aparece entre las interferencias.";
    $("transmission").hidden=true;
  }else{
    $("feedback").textContent="Buscando emisora… gira lentamente el dial.";
    $("transmission").hidden=true;
  }
  if(audioContext){
    const t=audioContext.currentTime;
    noiseGain.gain.setTargetAtTime(0.19-q*.12,t,.06);
    filter.frequency.setTargetAtTime(700+q*1700,t,.08);
    filter.Q.setTargetAtTime(.5+q*1.8,t,.08);
    voiceGain.gain.setTargetAtTime(q*.95,t,.08);
  }
  if(q>.02 && !voiceStarted){
    voiceStarted=true;
    voice.currentTime=0;
    voice.play().catch(()=>{});
  }else if(q<=.02 && voiceStarted){
    voice.pause();voiceStarted=false;
  }
}
function startAnimation(){
  const tick=()=>{if(!powered)return;updateSoundAndUI();raf=requestAnimationFrame(tick)};
  if(raf)cancelAnimationFrame(raf);tick();
}

// Knob rotation by dragging around its centre; vertical movement also works on narrow screens.
let dragging=false,lastY=0;
const knob=$("knob");
knob.addEventListener("pointerdown",e=>{dragging=true;lastY=e.clientY;knob.setPointerCapture(e.pointerId)});
knob.addEventListener("pointermove",e=>{
  if(!dragging)return;
  const delta=lastY-e.clientY;lastY=e.clientY;
  setFrequency(frequency+delta*.045);
});
knob.addEventListener("pointerup",()=>dragging=false);
knob.addEventListener("pointercancel",()=>dragging=false);
knob.addEventListener("keydown",e=>{
  if(e.key==="ArrowRight"||e.key==="ArrowUp"){e.preventDefault();setFrequency(frequency+.1)}
  if(e.key==="ArrowLeft"||e.key==="ArrowDown"){e.preventDefault();setFrequency(frequency-.1)}
});
$("scale").addEventListener("pointerdown",e=>{
  const rect=$("scale").getBoundingClientRect();
  const pct=clamp((e.clientX-rect.left)/rect.width,0,1);
  setFrequency(config.minFrequency+pct*(config.maxFrequency-config.minFrequency));
});
$("powerButton").addEventListener("click",()=>powered?powerOff():powerOn());
$("resetButton").addEventListener("click",()=>setFrequency(config.startFrequency));
setFrequency(frequency);
