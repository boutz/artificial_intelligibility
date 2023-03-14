// function to display an element in the UI
function showElement(elementid) {
  var element = document.getElementById(elementid);
  if (element.style.display === "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}

// function to show a title
function showTitle(text) {
  var title = document.getElementById("title");
  title.innerHTML = text;
}

// function to display an element and hide others in the UI
function showElementHideOthers(elementid, toHide = []) {
  var element = document.getElementById(elementid);
  if (element.style.display === "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
  toHide.forEach(hide);
  function hide(hideElementid) {
    var hideElement = document.getElementById(hideElementid);
    if (hideElement.style.display === "block") {
      hideElement.style.display = "none";
    }
  }
}

// function displaying multiple elements, hiding multiple
function showElementsHideOthers(toShow = [], toHide = []) {
  toShow.forEach(show);
  function show(showElementid) {
    var showElement = document.getElementById(showElementid);
    if (showElement.style.display === "none") {
      showElement.style.display = "block";
    }
  }
  toHide.forEach(hide);
  function hide(hideElementid) {
    var hideElement = document.getElementById(hideElementid);
    if (hideElement.style.display === "block") {
      hideElement.style.display = "none";
    }
  }
}

// function to display an element and hide others in the UI without toggle
function showElementHideOthers1(elementid, toHide = []) {
  var element = document.getElementById(elementid);
  element.style.display = "block";
  toHide.forEach(hide);
  function hide(hideElementid) {
    var hideElement = document.getElementById(hideElementid);
    if (hideElement.style.display === "block") {
      hideElement.style.display = "none";
    }
  }
}

// function to show sound area with correct info for the sound selected
function populateSound(sound) {
  document.getElementById("moreSound").style.display = "block";
  var title = document.getElementById("soundTitle");
  title.innerHTML = `<strong>${sound["title"]}</strong>`;
  var howToTitle = document.getElementById("howToTitle");
  howToTitle.innerHTML = `How to pronounce <strong>${sound["title"]}</strong>`;
  var listenTitle = document.getElementById("listenTitle");
  listenTitle.innerHTML = `Listen to <strong>${sound["title"]}</strong>`;
  var otherWordsTitle = document.getElementById("otherWordsTitle");
  otherWordsTitle.innerHTML = `Listen to other words containing <strong>${sound["title"]}</strong>`;
  var textArea = document.getElementById("text-area");
  var imageArea = document.getElementById("image-area");
  var soundArea = document.getElementById("sound-audio");
  var text = sound["text"];
  textArea.innerHTML = text;
  var imgSrc = sound["imgLocation"];
  imageArea.innerHTML = `<img class="ui centered small image" src="${imgSrc}">`;
  var soundAudio = sound["audio"];
  soundArea.innerHTML = `<audio controls><source src="${soundAudio}" type="">Your browser does not support the audio element.</audio>`;
  var audioSrc = sound["audioFiles"];
  audioSrc.forEach(add);

  function add(src, index) {
    var id = `audio-area${index}`;
    var area = document.getElementById(id);
    area.innerHTML = `<audio controls><source src="${src}" type="">Your browser does not support the audio element.</audio>`;
  }
  var audioLabels = sound["audioText"];
  audioLabels.forEach(label);
  function label(lbl, index) {
    var id = `label-area${index}`;
    var area = document.getElementById(id);
    area.innerHTML = lbl;
  }
}

// function to get value from dropdown menu
function getSelectValue(id, buttonId) {
  var selectedValue = document.getElementById(id).value;
  window.selectedValue = selectedValue;

  var step2 = document.getElementById("step2");
  step2.style.display = "block";

  return selectedValue;
}

function showText(text, id) {
  document.getElementById(id).innerHTML = text;
}

// function to show buttons for the phonemes of a word
function showButtons() {
  if (
    selectedValue === "sit" ||
    selectedValue === "seat" ||
    selectedValue === "sheet"
  ) {
    showElement("soundButtons");
    array = dict[selectedValue];
    array.forEach(show);

    function show(sound, index) {
      newButton = document.getElementById(`b${index}`);
      if (sound === "i:") {
        soundText = "i";
        console.log(soundText);
        newButton.innerHTML = `<div id="centredButton"><button class="ui yellow large button" onclick=populateSound(${soundText})>/${sound}/</button></div>`;
      } else {
        newButton.innerHTML = `<div id="centredButton"><button class="ui yellow large button" onclick=populateSound(${sound})>/${sound}/</button></div>`;
      }
    }
  } else {
    console.log("no buttons");
  }
}

// function to clear buttons
function clearButtons() {
  if (typeof selectedValue != "undefined" && typeof selectedValue != null) {
    array = dict[selectedValue];
    array.forEach(show);
    function show(sound, index) {
      newButton = document.getElementById(`b${index}`);
      newButton.innerHTML = "";
    }
  }
}

// function for displaying the model pronunciation and the user pronunciation
function showModel() {
  src = modelPron[selectedValue];
  audio = document.getElementById("model");
  audio.src = `${src}`;

  image = modelImages[selectedValue];
  document.getElementById(
    "model-image"
  ).innerHTML = `<img class="ui centered image" src="${image}">`;
}

var permission = false;

// function for capturing user audio
function voiceRecord() {
  // ensures function only runs once
  if (permission == false) {
    var constraints = { audio: true };
    //  get permission from user
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (mediaStreamObj) {
        // change permission to true
        window.permission = true;
        // get buttons and user audio objects
        var start = document.getElementById("startButton");
        var stop = document.getElementById("stopButton");
        var audioSave = document.getElementById("userAudio");
        var feedbackAudio = document.getElementById("userAudioFeedback");
        // declare mediaRecorder
        var mediaRecorder = new MediaRecorder(mediaStreamObj);
        window.mediaRecorder = mediaRecorder;
        var chunks = [];
        // start recording on click of start, with a 10s limit
        start.addEventListener("click", (ev) => {
          document.getElementById("timeout").innerHTML = "";
          mediaRecorder.start();
          console.log(mediaRecorder.state);
          start.innerHTML =
            "<i class='circular spinner loading icon'></i>Now recording";
          stop.className = "ui labeled icon big button";
          setTimeout(() => {
            console.log("test");
            // timesUp function to show user warning message and stop recording
            timesUp();
          }, 10000);
        });
        stop.addEventListener("click", (ev) => {
          var buttonClicked = "true";
          window.buttonClicked = buttonClicked;
          mediaRecorder.stop();
          console.log(mediaRecorder.state);
          start.innerHTML = "<i class='microphone icon'></i>Start recording";
        });
        //push audio data to chunks
        mediaRecorder.addEventListener("dataavailable", (ev) => {
          chunks.push(ev.data);
        });
        mediaRecorder.addEventListener("stop", (ev) => {
          var step3 = document.getElementById("step3");
          step3.style.display = "block";

          var blob = new Blob(chunks, { type: "audio" });
          window.currentAudioFile = blob;
          chunks = [];

          var audioURL = window.URL.createObjectURL(blob);
          audioSave.src = audioURL;
          feedbackAudio.src = audioURL;
          document
            .getElementById("upload")
            .addEventListener("click", uploadAudio);
        });
      })
      .catch(function (err) {
        console.log(err.name, err.message);
        window.permission = false;
        if (err.name === "NotAllowedError") {
          alert("Please give permission to access microphone.");
        } else {
          alert("The system has encountered a problem. Please try again");
          showElementHideOthers1("practise", [
            "loader",
            "learn",
            "about",
            "home",
            "feedback",
            "comparisonArea",
            "voiceRecordArea",
            "moreSound",
            "soundsOfEnglish",
            "segmentalErrors",
            "prosodicErrors",
            "howItWorks",
            "vocalTract",
            "aboutFeedback",
            "goback",
            "soundButtons",
          ]);
        }
      });
  }
}
// function to activate app engine (so that processing is handled more quickly)
function activate() {
  // url for running locally
  var url = "http://localhost:5000/activate_ae";
  // var url = "https://artificial-intelligibility.nw.r.appspot.com/activate_ae";
  var request = new Request(url, {
    method: "POST",
    mode: "no-cors",
  });
  fetch(request)
    .then(function (res) {
      return res.json();
    })
    .catch((err) => {
      console.log("ERROR:", err.message);
    });
}

// function to upload audio, get response
function uploadAudio() {
  // make page opaque and show loader
  document.getElementById("practise").style.opacity = "0.5";
  $(":button").prop("disabled", true);
  showElement("loader");
  // add audio and selected value from dropdown
  var data = new FormData();
  data.append("file", window.currentAudioFile);
  data.append("selectedValue", window.selectedValue);
  // url for running locally
  var url = "http://localhost:5000/uploader";
  // var url = "https://artificial-intelligibility.nw.r.appspot.com/uploader";
  var request = new Request(url, {
    method: "POST",
    body: data,
  });
  fetch(request)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      var intonation = ["is_it_raining", "she_speaks", "where_do_you_live"];
      var individual = ["sit", "seat", "sheet"];
      var analysis = document.getElementById("analysis");
      var stressText = document.getElementById("stressText");
      if (intonation.includes(selectedValue)) {
        var src = "data:image/png;base64, " + data.pitch_image;
        analysis.innerHTML = `<img class="ui large centered image" src="${src}" ></img>`;
        stressText.innerHTML = "";
      }
      if (individual.includes(selectedValue)) {
        analysis.innerHTML = "";
        stressText.innerHTML = "";
      }
      if (data.img_id != "0") {
        console.log(data.img_id);
        var imgsrc = modelImages[data.img_id];
        analysis.innerHTML = `<img class="ui centered image" src="${imgsrc}" ></img>`;
        var correct_stress = selectedValue.charAt(selectedValue.length - 1);
        if (correct_stress === "1") {
          stressText.innerHTML = "The stress falls on the first syllable";
        }
        if (correct_stress === "2") {
          stressText.innerHTML = "The stress falls on the second syllable.";
        }
      }

      var response = document.getElementById("response");
      response.innerHTML = data.response;
    })
    .then(function () {
      showElementsHideOthers(
        ["feedback", "goback", "comparisonArea"],
        ["learn", "about", "home", "practise", "step2", "step3"]
      );
      resetDropdowns();
      showButtons();
      showModel();
      document.getElementById("practise").style.opacity = "1";
      $(":button").prop("disabled", false);
      document.getElementById("loader").style.display = "none";
    })
    .catch((err) => {
      console.log("ERROR:", err.message);
      alert("The system has encountered a problem. Please try again");
      document.getElementById("practise").style.opacity = "1";
      $(":button").prop("disabled", false);
      document.getElementById("loader").style.display = "none";
      showElementHideOthers1("practise", [
        "loader",
        "learn",
        "about",
        "home",
        "feedback",
        "comparisonArea",
        "voiceRecordArea",
        "moreSound",
        "soundsOfEnglish",
        "segmentalErrors",
        "prosodicErrors",
        "howItWorks",
        "vocalTract",
        "aboutFeedback",
        "goback",
        "soundButtons",
      ]);
    });
}

// functions to reset dropdowns
function resetDropdowns() {
  var dropDownWord = document.getElementById("word-select");
  dropDownWord.selectedIndex = 0;

  var dropDownStress = document.getElementById("wordStress-select");
  dropDownStress.selectedIndex = 0;

  var dropDownIntonation = document.getElementById("intonation-select");
  dropDownIntonation.selectedIndex = 0;
}

// show warning message when the recording has reached the maximum length
function timesUp() {
  var start = document.getElementById("startButton");
  if (window.buttonClicked != "true") {
    mediaRecorder.stop();
    console.log(window.buttonClicked);
    start.innerHTML = "<i class='microphone icon'></i>Start recording";
    document.getElementById("timeout").innerHTML =
      "<strong>Recording has reached the maximum permitted length.</strong>";
  }
}
