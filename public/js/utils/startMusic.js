export function startMusic(filePath) {
  const bgm = new Audio(filePath);
  bgm.loop = true;
  bgm.volume = 0.15;

  const playAudio = () => {
    bgm.play()
      .then(() => {
        window.removeEventListener('click', playAudio);
        window.removeEventListener('touchstart', playAudio);
      })
        .catch(() => {});
  };

  window.addEventListener('click', playAudio);
  window.addEventListener('touchstart', playAudio); 
}