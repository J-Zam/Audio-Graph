import "./style.scss";
import { rocketMan } from "./base64/rocketMan";

let analyser: AnalyserNode;
let audioSource: MediaElementAudioSourceNode;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const file = document.getElementById("fileupload") as HTMLInputElement;
const audioPlayer = document.getElementById("audioPlayer") as HTMLAudioElement;
audioPlayer.src = rocketMan;
const FFTSIZE = 512; // 32, 64, 128, 256, 512, 1024, 2048
const lINEWIDTH = 2;

window.addEventListener("DOMContentLoaded", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

audioPlayer.addEventListener("play", function () {
  const audioContext = new AudioContext();
  audioPlayer.play();
  audioSource = audioContext.createMediaElementSource(audioPlayer);
  analyser = audioContext.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = FFTSIZE;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const lineWidth = lINEWIDTH;
  let barHeigth: number;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualizer(bufferLength, lineWidth, barHeigth, dataArray);
    requestAnimationFrame(animate);
  }
  animate();
});

file.addEventListener("change", function () {
  const files = this.files as FileList;
  audioPlayer.src = URL.createObjectURL(files[0]);
  const audioContext = new AudioContext();
  audioPlayer.load();
  audioPlayer.play();

  audioSource = audioContext.createMediaElementSource(audioPlayer);
  analyser = audioContext.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = FFTSIZE;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const lineWidth = lINEWIDTH;
  let barHeigth: number;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualizer(bufferLength, lineWidth, barHeigth, dataArray);
    requestAnimationFrame(animate);
  }
  animate();
});

function drawVisualizer(
  bufferLength: number,
  lineWidth: number,
  barHeigth: number,
  dataArray: Uint8Array
) {
  let hue = 0;

  for (let i = 0; i < bufferLength; i++) {
    canvas.width > 700
      ? (barHeigth = dataArray[i] * 1.5)
      : (barHeigth = dataArray[i]);
    hue = i * 100;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(i + (Math.PI * 4) / bufferLength);
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, lineWidth, barHeigth);

    ctx.beginPath();
    ctx.arc(0, barHeigth, barHeigth / 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
