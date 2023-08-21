
const players = [];
let currentPlaying = null;

const timeCalculator = function (value) {
  let second = Math.floor(value % 60);
  let minute = Math.floor((value / 60) % 60);

  if (second < 10) {
    second = "0" + second;
  }

  return minute + ":" + second;
};

// Function to handle play/pause
function togglePlayPause(wavesurfer) {
  if (currentPlaying && currentPlaying !== wavesurfer) {
    currentPlaying.pause();
  }

  if (currentPlaying === wavesurfer && wavesurfer.isPlaying()) {
    wavesurfer.pause();
  } else {
    wavesurfer.play();
    currentPlaying = wavesurfer;
  }
}

document.querySelectorAll('.player').forEach((playerElement, index) => {
  const duration = playerElement.querySelector(`#duration${index + 1}`);
  const current = playerElement.querySelector(`#current${index + 1}`);
  const playPause = playerElement.querySelector('.fa-solid');
  const volumeIcon = playerElement.querySelector(`#volumeIcon`);
  const volumeSlider = playerElement.querySelector(`.custom-volume-slider`);
  const wave = playerElement.querySelector(`#wave${index + 1}`);
  
  const wavesurfer = WaveSurfer.create({
    container: wave,
    waveColor: "#8d8d8d",
    progressColor: "#8800ff",
    height: 48,
    scrollParent: false
  });
  
  const audioURLs = [
    "https://static.wixstatic.com/mp3/9a7264_18a6faebaafc4d3bbd94665f37559740.mp3",
    "https://static.wixstatic.com/mp3/9a7264_abfded1eb31844ac876ab2c58fe5defd.mp3",
    "https://static.wixstatic.com/mp3/9a7264_92650f8aec274302a4b55a4941c8af0c.mp3"
  ];

  wavesurfer.load(audioURLs[index]);

  playPause.addEventListener("click", function () {
    togglePlayPause(wavesurfer);
  });

  wave.addEventListener("click", function () {
    if (!wavesurfer.isPlaying()) {
      togglePlayPause(wavesurfer);
    }
  });

  // Rest of the code (volume control, time updates, etc.)

  volumeIcon.addEventListener("click", function () {
    if (wavesurfer.getVolume() > 0) {
      wavesurfer.setVolume(0);
      volumeIcon.classList.remove("fa-volume-up");
      volumeIcon.classList.add("fa-volume-mute");
    } else {
      wavesurfer.setVolume(1);
      volumeIcon.classList.add("fa-volume-up");
      volumeIcon.classList.remove("fa-volume-mute");
    }
  });

  volumeSlider.addEventListener("input", function () {
    const newVolume = parseFloat(volumeSlider.value);
    wavesurfer.setVolume(newVolume);

    if (newVolume > 0) {
      volumeIcon.classList.add("fa-volume-up");
      volumeIcon.classList.remove("fa-volume-mute");
    } else {
      volumeIcon.classList.remove("fa-volume-up");
      volumeIcon.classList.add("fa-volume-mute");
    }
  });

  wavesurfer.on("ready", function () {
    duration.textContent = timeCalculator(wavesurfer.getDuration());
  });

  wavesurfer.on("audioprocess", function () {
    current.textContent = timeCalculator(wavesurfer.getCurrentTime());
  });

  wavesurfer.on("play", function () {
    playPause.classList.remove("fa-play");
    playPause.classList.add("fa-pause");
  });

  wavesurfer.on("pause", function () {
    playPause.classList.add("fa-play");
    playPause.classList.remove("fa-pause");
  });

  wavesurfer.on("seek", function () {
    current.textContent = timeCalculator(wavesurfer.getCurrentTime());
  });
    


  players.push(wavesurfer);
});
