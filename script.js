/* -- Adding Song when page is loaded -- */
window.onload = function(){
    let url = 'sound.aac';
    window.AudioContext = window.AudioContext||window.webkitAudioContext; //fix up prefixing
    let context = new AudioContext(); //context
    let source = context.createBufferSource(); //source node
    source.connect(context.destination); //connect source to speakers so we can hear it
    let request = new XMLHttpRequest();
    request.open('GET', url, true); 
    request.responseType = 'arraybuffer'; //the  response is an array of bits
    request.onload = function() {
        context.decodeAudioData(request.response, function(response) {
            source.buffer = response;
            source.start(0); //play audio immediately
            source.loop = true;
        }, function () { console.error('The request failed.'); } );
    }
    request.send();
  }
  
  // Array of image URLs
  let images = [
    "img/i1.png",
    "img/i2.png",
    "img/i3.png",
    "img/i4.png",
    "img/i5.png",
    "img/i6.png",
    "img/i7.png",
    "img/i8.png",
    "img/i9.png",
    "img/i10.jpg",
    "img/i11.jpg",
    "img/i12.jpg",
    ];
    const startButton = document.getElementById("start-button");
    const imagesContainer = document.getElementById("correctImages");
    const allImages = document.getElementById("allImages");
    const imgs = document.querySelector("#allImages img");
    const next = document.querySelector("#next");
    const retry = document.getElementById("retry");
    const won = document.getElementById("won-warning");
    const wrong = document.getElementById("wrong-warning");
    const lost = document.getElementById("lost-warning");
    const round = document.querySelector("#rounds");
    const timeWarning = document.querySelector("#time-warning");
    const readyText = document.getElementById("ready");
    const goText = document.getElementById("go");
    const contents = document.getElementById("contents");
    const buttons = document.getElementById("buttons");
    const timerElement = document.querySelector("#timer");
    const title = document.querySelector("#title");