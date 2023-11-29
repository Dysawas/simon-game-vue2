

export function animate(htmlElement, delay) {
  htmlElement.animate({ opacity: 1 }, delay, function () {
    setTimeout(function () {
      htmlElement.css("opacity", 0.6);
    }, delay);
  });
}

export function playSound(sound) {
    const audioElement = sound
    audioElement.play();
}

export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}