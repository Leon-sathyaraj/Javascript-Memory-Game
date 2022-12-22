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
    

  let rounds = 0;
  let roundThreshold = 2;
  let gamePaused = false;
  let selection = [];
  let mapImages = {};
  let timerTicking = false;
  let countdown;

  /* -- Timer Function creates counter -- */
  function timerOn () {
    timerElement.style.display = "flex";
    let timeLeft = rounds > 1 ? 5 : 8;
    countdown = setInterval(() => {
      if(!gamePaused){
        if (timeLeft <= 0) {
          clearInterval(countdown);
          timeWarning.style.display = "block";
          buttons.style.display = "none";
          retry.style.display = "block";
          timerElement.style.display = "none";
          revealAnswers();
        } else {
          timerElement.textContent = timeLeft ;
          timeLeft--;
        }
      }
      // else {
      //   timerElement.textContent = "Paused";
      // }
    }, 1000);
  }

  

  /* -- When is game is reseted some values are turned to their initial values -- */
  function retryGame(){
    rounds = 0;
    // timerTicking=false;
    // clearInterval(countdown);
    startGame();
  }

  /* -- Some values need to be reinitialised to their initial values in the starting of each round -- */
  function defaultValues(){
    readyText.style.display = "none";
    goText.style.display = "none";
    next.style.display = "none";
    retry.style.display = "none";
    won.style.display = "none";
    wrong.style.display = "none";
    timeWarning.style.display = "none";
    buttons.style.display = "flex";
    allImages.style.display = "none";
    lost.style.display = "none";
    imagesContainer.textContent = '';
    timerElement.style.display = "none";
    selection = [];
    gamePaused = false;
    timerTicking=false;
    clearInterval(countdown);
    timerElement.textContent = "";
    generateRandomSelections();
  }

  /* -- Start Function start the game by generating random images -- */
  function startGame() {
    round.textContent = "Round " + ++rounds;
    defaultValues();
    title.remove();
    startButton.remove();
    if(rounds === 1){
      setTimeout(() => {
        readyText.style.display = "block";
        }, 500);
    }
      setTimeout(() => {
      readyText.style.display = "none";
      goText.style.display = "block";
      }, rounds === 1 ? 3000 : 1000);

      setTimeout(() => {
        goText.style.display = "none";
        contents.style.display = "flex";
        revealCorrectImages();
        }, 4500);
        // if(!timerTicking){
        //   timerOn();
        //   timerTicking = true;
        // }
  }

  let bckup = images;
