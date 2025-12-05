javascript
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

window.onload = () => {
  const namaTamu = getQueryParam("to");
  if (namaTamu) {
    document.getElementById("tamu").textContent = decodeURIComponent(namaTamu);
  }

function toggleMusic() {
  const music = document.getElementById("bg-music");
  if (music.paused) {
    music.play();
  } else 
music.pause();
  }
}