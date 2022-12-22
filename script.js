/* -- Adding Song when page is loaded -- */
window.onload = function(){
  var url = 'sound.aac';
  window.AudioContext = window.AudioContext||window.webkitAudioContext; //fix up prefixing
  var context = new AudioContext(); //context
  var source = context.createBufferSource(); //source node
  source.connect(context.destination); //connect source to speakers so we can hear it
  var request = new XMLHttpRequest();
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
    document.getElementById('bgMusic').play();
    round.textContent = "Round " + ++rounds;
    document.getElementById('timer').style.animationPlayState = 'running';
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
  let selectionBckup = [];

  /* -- Generate random unique selections -- */
  const generateRandomSelections = function () {
    selectionBckup = []
    bckup=images.slice(0, (rounds>=roundThreshold ? 13 : 8))
    while(selection.length < 4){
      var r = Math.floor(Math.random() * bckup.length);
      if(selection.indexOf(bckup[r]) === -1) selection.push(bckup[r]);
    }
    selectionBckup = [...selection];
 }

  /* -- Reveal correct images on screen by using DOM manipulation method -- */
  const revealCorrectImages = function () {
    for (let i = 0; i <= 3; i++) {
      const img = document.createElement("img");
      img.src = selection[i];
      selection.forEach((image) => imagesContainer.appendChild(img));
    }
    setTimeout(() => {
      imagesContainer.textContent = '';
      allImages.style.display = "block";
      setTimeout(() => {
        ShowAllImages();
        }, 2000);
      }, 5000);
  };

  /* -- Show all the options for user to select -- */
  const ShowAllImages = function () {
    allImages.style.display = "none";
    timerOn();
    for (let i = 0; i <= (rounds>=roundThreshold ? 11 : 7); i++) {
      const img = document.createElement("img");
      img.src=bckup[i];
      imagesContainer.appendChild(img);
      img.addEventListener("click", (e) => validate(e));
      }   
  }
 
  /* -- To check the selected option is correct or not -- */
  const validate = function (e) {
    if(gamePaused) return;
    let urlArray = e.target.src.split('/');
    let src = "img/" + urlArray[urlArray.length - 1];
    if(
      selectionBckup.find(i => {
        return i === src;
      })
    ){
      e.target.classList.add('correct');
      selectionBckup[selectionBckup.indexOf(src)] = "";
      selectionBckup = selectionBckup.filter(a => a !== "");
      if(selectionBckup.length === 0) {
        won.style.display = "block";
        document.getElementById('timer').style.animationPlayState = 'paused';
        next.style.display = "block";
        
        gamePaused=true;
      }
    }else{
      gamePaused=true;
      e.target.classList.add('incorrect');
      rounds=0;
      timerElement.textContent = "";
      wrong.style.display = "block";
      document.getElementById('timer').style.animationPlayState = 'paused';
      setTimeout(() => {
        retry.style.display = "block";
        lost.style.display = "block";
        revealAnswers();
        }, 2000);
    }
  }

  /* -- Reveal answers in the end of the round -- */
  const revealAnswers = function () {
    imagesContainer.textContent= '';
    for (let i = 0; i <= 3; i++) {
      const img = document.createElement("img");
      img.src = selection[i];
      selection.forEach((image) => imagesContainer.appendChild(img));
    }
  }


startButton.addEventListener("click", startGame);

//function to show round
function rvlround() {
  document.getElementById('roundsContainer').style.display = "flex";
}
startButton.addEventListener("click", rvlround);
 
