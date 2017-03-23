  function getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 22)];}
      return color;}
  var ColorBereich = document.getElementById( 'colorchange' );
  (function ColorLoop (i) {
      setTimeout(function () {
          var colormix = getRandomColor();
          ColorLoop(i);
          canvasCtx.fillStyle = colormix;
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      }, 100);
  })(1);



///// audio Visualizer /////
  var AudioContext = window.AudioContext || window.webkitAudioContext;

  let audio = new Audio(),
      canvas = document.getElementById('c'),
      canvasCtx = canvas.getContext('2d'),
      audioCtx = new AudioContext(),
      analyser = audioCtx.createAnalyser(),
      fftSize = analyser.fftSize,
      fbc = new Uint8Array(fftSize),
      source;

  const HEIGHT = canvas.height = window.innerHeight,
        WIDTH = canvas.width = window.innerWidth,
        RADIUS = 80,
        POINTS = 180,
        CENTER = {
          x: WIDTH/2,
          y: HEIGHT/2
        };

  audio.src = "http://audios-api.herokuapp.com/KDrew%20-%20Bullseye.mp3";
  audio.type = "audio/mpeg";
  audio.crossOrigin = "anonymous";
  audio.preload = "preload";
  audio.autoplay = "autoplay";
  audio.volume = 0.4;

  source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(fbc);

    for(let i = 0; i < POINTS; i++) {
      let rel = ~~(i * (POINTS/fftSize)),
          x = CENTER.x + RADIUS * Math.sin( (i * 2 * Math.PI) / POINTS ),
          y = CENTER.y + RADIUS * -Math.sin( (i * 2 * Math.PI) / POINTS ),
          x_2 = CENTER.x + (fbc[rel]) * Math.sin( (i * 2 * Math.PI) / POINTS ),
          y_2 = CENTER.y + (fbc[rel]) * -Math.cos( (i * 2 * Math.PI) / POINTS );

      canvasCtx.beginPath();
      canvasCtx.moveTo(x, y);
      canvasCtx.lineTo(x_2, y_2);
      canvasCtx.lineWidth = 4;
      canvasCtx.strokeStyle = "hsl(" + i + ", 100%, 100%)";
      canvasCtx.arc(x,y,10,0,2*Math.PI);
      canvasCtx.stroke();
    }
  }
  /*
  Array.from(document.querySelectorAll('button')).map(btn => {
    btn.addEventListener('click', e => {
      let id = btn.id
      if(id === "stop") {
        audio.pause();
        audio.currentTime = 0
      } else {
        audio[id]()
      }
    })
  })
  */

  function pause(){
    audio.pause();
    $('#pause').css('display','none');
    $('#play').css('display','block');
  }

  function play(){
    audio.play();
    $('#play').css('display','none');
    $('#pause').css('display','block');
  }


  draw();
