import { requestNotificationPermission } from "../js/notifications.js";
import push from "../js/push-notifications.js";

let bright = document.querySelector("#bright");
let spanValueBright = document.querySelector(".valueBright");
let saturation = document.querySelector("#saturation");
let spanValueSaturation = document.querySelector(".valueSaturation");
let stackBlur = document.querySelector("#blurStack");
let spanValueBlur = document.querySelector(".valueBlur");
let hue = document.querySelector("#hue");
let spanValueHue = document.querySelector(".valueHue");
let sepia = document.querySelector("#sepia");
let spanValueSepia = document.querySelector(".valueSepia");
let resetButton = document.querySelector(".reset-btn");
let filterReset = document.getElementById("my-form");
let messageContainer = document.querySelector(".no-photo");
let downloadImage = document.querySelector("#save");
let downloadButton = document.querySelector(".save-btn");
let oldValueBright = 0;
let oldValueSaturation = 0;
let oldValueBlur = 0;
let oldValueHue = 0;
let oldValueSepia = 0;
let newImg = "";
let stream = {};

/////////////////// Check network status ///////////////////////////
window.addEventListener("offline", checkOnlineStatus);
window.addEventListener("online", checkOnlineStatus);

function checkOnlineStatus() {
  if (!navigator.onLine) {
    downloadButton.disabled = true;
    downloadButton.classList.add("disable");
    messageContainer.innerHTML = "";
    let noSavePhotoMessage = document.createElement("p");
    noSavePhotoMessage.innerHTML = " Oops OFFLINE !! Check your connection ";
    messageContainer.appendChild(noSavePhotoMessage);
  } else if (navigator.onLine) {
    downloadButton.disabled = false;
    downloadButton.classList.remove("disable");
    messageContainer.innerHTML = "";
    saveImage();
  }
}

/////////////////// Video streaming ///////////////////////////
async function getMedia() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true }); /// this will prompt the user for permission to use a media input
    const videoElem = document.querySelector("#me");
    videoElem.srcObject = stream;
    videoElem.addEventListener("loadedmetadata", () => {
      videoElem.play();
    });
    console.log(stream);
  } catch (error) {
    console.log(error);
  }
}

getMedia();

document.querySelector("#addImage").addEventListener("click", (event) => {
  document.querySelector("#me").classList.add("flash");
  if (document.querySelector(".not-available") !== null) {
    document.querySelector(".not-available").classList.add("hide");
  }
  captureImage(stream);
});

/////////////////// Photo taking ///////////////////////////
async function captureImage(stream) {
  const mediaTrack = stream.getVideoTracks()[0];
  console.log(mediaTrack);
  const captureImg = new ImageCapture(mediaTrack);
  const photo = await captureImg.takePhoto();
  console.log(photo);
  const imgUrl = URL.createObjectURL(photo);
  document.querySelector("#photo").src = imgUrl;
  if (document.querySelector("canvas") !== null) {
    document.querySelector("#photo").removeAttribute("data-caman-id");
    const changeImage = imgUrl;
    newImg = changeImage;
    console.log(newImg);
    resetFilter();
    filter();
  } else {
    newImg = imgUrl;
    console.log(newImg);
    filter();
  }
}

/////////////////// Filters ///////////////////////////

/////////////////// Filter tracking ///////////////////////////
Caman.Event.listen("processStart", function (job) {
  console.log("Start:", job.name);
});

Caman.Event.listen("processComplete", function (job) {
  console.log("Finished:", job.name);
});

//////////////////// Slider adjustment filters ////////////////////////////////////

////////// Brightness /////////////////////////
function adjustBrightness(value) {
  Caman("#photo", newImg, function () {
    if (-10 < value < 10) {
      this.revert();
    }
    console.log(oldValueBright);
    let newValue = value - oldValueBright;

    this.brightness(newValue);
    console.log("new value: " + newValue);

    oldValueBright = value;
    console.log("old value: " + oldValueBright);
    this.render();
  });
}

////////// Saturation /////////////////////////
function adjustSaturation(value) {
  Caman("#photo", newImg, function () {
    if (value == 0) {
      this.revert();
    }
    console.log(oldValueSaturation);
    let newValue = value - oldValueSaturation;

    this.saturation(newValue);
    console.log("new value: " + newValue);

    oldValueSaturation = value;
    console.log("old value: " + oldValueSaturation);
    this.render();
  });
}

////////// stackBlur /////////////////////////
function adjustStackBlur(value) {
  Caman("#photo", newImg, function () {
    if (value === 0) {
      this.revert();
    }
    console.log(oldValueBlur);
    let newValue = value - oldValueBlur;

    this.stackBlur(newValue);
    console.log("new value: " + newValue);

    oldValueBlur = value;
    console.log("old value: " + oldValueBlur);

    this.render();
  });
}

////////// Hue /////////////////////////
function adjustHue(value) {
  Caman("#photo", newImg, function () {
    if (value === 0) {
      this.revert();
    }
    console.log(oldValueHue);
    let newValue = value - oldValueHue;

    this.hue(newValue);
    console.log("new value: " + newValue);

    oldValueHue = value;
    console.log("old value: " + oldValueHue);
    this.render();
  });
}

////////// Sepia /////////////////////////
function adjustSepia(value) {
  Caman("#photo", newImg, function () {
    if (value === 0) {
      this.revert();
    }
    console.log(oldValueSepia);
    let newValue = value - oldValueSepia;

    this.sepia(newValue);
    console.log("new value: " + newValue);

    oldValueSepia = value;
    console.log("old value: " + oldValueSepia);
    this.render();
  });
}

/////////////////// Event listener for sliders adjustment ///////////////////////////

function filter() {
  Caman("#photo", newImg, function () {
    bright.addEventListener("change", (e) => {
      e.preventDefault();
      let value = parseInt(bright.value);
      spanValueBright.innerHTML = value;
      console.log(spanValueBright.innerHTML);
      adjustBrightness(value);
    });

    saturation.addEventListener("change", (e) => {
      e.preventDefault();
      let value = parseInt(saturation.value);
      spanValueSaturation.innerHTML = value;
      console.log(spanValueSaturation.innerHTML);
      adjustSaturation(value);
    });

    stackBlur.addEventListener("change", (e) => {
      e.preventDefault();
      let value = parseInt(stackBlur.value);
      spanValueBlur.innerHTML = value;
      console.log(spanValueBlur.innerHTML);
      adjustStackBlur(value);
    });

    hue.addEventListener("change", (e) => {
      e.preventDefault();
      let value = parseInt(hue.value);
      spanValueHue.innerHTML = value;
      console.log(spanValueHue.innerHTML);
      adjustHue(value);
    });

    sepia.addEventListener("change", (e) => {
      e.preventDefault();
      let value = parseInt(sepia.value);
      spanValueSepia.innerHTML = value;
      console.log(spanValueSepia.innerHTML);
      adjustSepia(value);
    });
  });
}

/////////////////// Filter value reset button ///////////////////////////

resetButton.addEventListener("click", resetFilter);

function resetFilter() {
  filterReset.reset(); // reset the slider via <form>
  spanValueBright.innerHTML = 0;
  oldValueBright = 0;
  spanValueSaturation.innerHTML = 0;
  oldValueSaturation = 0;
  spanValueBlur.innerHTML = 0;
  oldValueBlur = 0;
  spanValueHue.innerHTML = 0;
  oldValueHue = 0;
  spanValueSepia.innerHTML = 0;
  oldValueSepia = 0;
  Caman("#photo", newImg, function () {
    this.reload;
    this.revert();
  });
  console.log("Filter reset");
}

/////////////////// Download image ///////////////////////////

downloadButton.addEventListener("click", () => {
  if (newImg == "") {
    messageContainer.innerHTML = "";
    downloadImage.href = "#save";
    let noPhotoMessage = document.createElement("p");
    noPhotoMessage.setAttribute("class", "not-available");
    noPhotoMessage.innerHTML = "No photo available for download";
    messageContainer.appendChild(noPhotoMessage);
  } else {
    saveImage();
  }
});

function saveImage() {
  downloadImage.href = document
    .querySelector("#photo")
    .toDataURL("image/jpeg")
    .replace("image/jpeg", "image/octet-stream");
  downloadImage.download = "image-instablam.jpeg";
}

/////////////////// Registration of service worker ///////////////////////////

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("../sw.js")
      .then((registration) => {
        console.log("Registered service worker");
        push();
      })
      .catch((error) => console.log("Error with register service worker"));
  }
}

registerServiceWorker();
requestNotificationPermission();
