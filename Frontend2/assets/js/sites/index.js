const { Modal } = require("bootstrap");
import Cropper from 'cropperjs';
import { Gallery } from './../partials/gallery.js';
import { loadImages } from './../partials/cewe-api.js'
import { Cewe } from '../partials/cewe.js';
import { Backend } from '../partials/backend.js';

let clientId = null;
let isLoggedIn = false;
let userName = "";
let email = document.getElementById('email');
let pw = document.getElementById('password');
let loginButton = document.getElementById('loginButton');
let loginView = document.getElementById('login');
let userNameField = document.getElementById('userName');
let loginModalButton = document.getElementById('loginModalButton');
let loginModal = new Modal(document.getElementById('loginModal'));
let loadImagesButton = document.getElementById('loadImagesbutton');
let addEffectButton = document.getElementById('addEffectButton');
let gallery = new Gallery(document.getElementById('image-gallery'));
let cewe = null;
let cropXStart = null;
let cropYStart = null;
let cropXEnd = null;
let cropYEnd = null;
let backend = new Backend();
let selectedImage = "https://cdn.syntaxphoenix.com/images/spigoticons/loginplus-logo.png";
let bildImBildButton = document.getElementById("bib-btn");
let outOfImageButton = document.getElementById("ooi-btn");
let bildImBildBox = document.getElementById("box1");
let outOfImageBox = document.getElementById("box2");
let effect = 'inside';
let rangeslider = document.getElementById("sliderRange");
let rangesliderValue = 50;
let blurDisplay = document.getElementById("blurDisplay");

var croppr = new Cropper(document.getElementById('selectedImage'), {
    // alternatively use croppr.getValue() with return value = {x: 21, y: 63: width: 120, height: 120}
    crop(event) {
        cropXStart = Math.round(event.detail.x);
        cropYStart = Math.round(event.detail.y);
        cropXEnd = Math.round(cropXStart + event.detail.width);
        cropYEnd = Math.round(cropYStart + event.detail.height);
        //console.log(cropXStart, cropYStart, cropXEnd, cropYEnd);
    },
    zoomable: false
});

loginButton.addEventListener('click', login);
loginModalButton.addEventListener('click', () => {
    if (!loginModalButton.hasAttribute('data-bs-toggle')) {
        login();
    }
});

async function login() {

    let status = 0;

    if (isLoggedIn) {
        logout();
        toggleLoginLogout();
        return;
    }

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            clientVersion: "0.0.1-medienVerDemo",
            apiAccessKey: "6003d11a080ae5edf4b4f45481b89ce7",
        }, // this apiAccessKey is for testing
        body: JSON.stringify({
            login: email.value,
            password: pw.value,
            deviceName: "Medienverarbeitung CEWE API Demo",
        }),
    };

    const response = await fetch(
        "https://cmp.photoprintit.com/api/account/session/",
        requestOptions
    ).then((response) => {
        status = response.status;

        if (!(status >= 200 && status <= 299)) {
            // some broad status 'handling'
            if (status == 500 || status == 405) {
                alert("Internal error occured, try again later.");
                return;
            }
            alert("Entered credinentials are incorrect.");
            return;
        }

        return response.json();
    });

    if (response == null) {
        return;
    }

    clientId = response.session.cldId;
    cewe = new Cewe(clientId, gallery);
    userName = response.user.firstname;
    userNameField.innerHTML = userName;
    toggleLoginLogout();
    isLoggedIn = true;
}

loadImagesButton.addEventListener('click', () => {
    if (clientId != null) { cewe.loadImages(); }
});

addEffectButton.addEventListener('click', () => {
    if (effect == 'inside') {
        loadBlur();
    } else {
        loadOutOfImage();
    }
});

async function loadBlur() {
    let newUrl = await backend.getBlur(selectedImage, cropXStart, cropYStart, cropXEnd, cropYEnd, rangesliderValue);
    document.getElementById('default-output').querySelector('img').src = newUrl;
}

async function loadOutOfImage() {
    let inputValue = document.getElementById('inputHeight').value;
    console.log(inputValue);
    let height = isNaN(inputValue) ? 250 : inputValue;

    let newUrl = await backend.getOutOfImage(selectedImage, cropXStart, cropYStart, cropXEnd, cropYEnd, height);
    document.getElementById('default-output').querySelector('img').src = newUrl;
}

document.body.addEventListener('click', event => {
    if (event.target.classList.contains('download-btn')) {
        let url = event.target.parentElement.querySelector('img').src;
        downloadImage(url, 'image');
    }
});

document.body.addEventListener('click', event => {
    if (event.target.classList.contains('select-image')) {
        handleSelectCeweImage(event.target);
    }
});

async function handleSelectCeweImage(element) {
    let imageData = gallery.getImageData(element.dataset.id);
    // croppr.setImage(imageData.data.url);
    document.getElementById('selectedImage-name').innerText = imageData.data.name;
    document.getElementById('selectedImage-avgColor').innerText = imageData.data.avgColor;

    // Load High-Resolution
    let highresolution = await cewe.fetchHighResolution(imageData.data.id);

    croppr.replace(highresolution.url);

    selectedImage = highresolution.url;
}

async function downloadImage(selectedUrl, fileName) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    let imageData = await fetch(selectedUrl, {
      method: "get"
    })
      .then((response) => response.blob())
      .then((imageBlob) => {
        return imageBlob;
    });

    let fileType = imageData.type;
    let fileEnding = null;

    if (fileType == 'image/png') {
        fileEnding = 'png';
    } else if (fileType == 'image/jpeg') {
        fileEnding = 'jpeg';
    }

    if (fileEnding == null) {
        return;
    }

    let url = window.URL.createObjectURL(imageData);
    a.href = url;
    a.download = fileName + fileEnding;
    a.click();
    window.URL.revokeObjectURL(url);
}

function logout() {
    clientId = ""; 
    userName = "";
    loginView.style.display = '';
    resetData();
}

function toggleLoginLogout() {
    if (userNameField.classList.contains('d-none')) {
        userNameField.classList.remove('d-none');
        loginModalButton.innerText = 'Logout';
        loginModalButton.removeAttribute('data-bs-toggle');
        loginModalButton.removeAttribute('data-bs-target');
        loginModal.hide();
    } else {
        userNameField.classList.add('d-none');
        loginModalButton.innerText = 'Login';
        loginModalButton.setAttribute('data-bs-toggle', 'modal')
        loginModalButton.setAttribute('data-bs-target', '#loginModal');
    }
}

function resetData() {
    gallery.resetImages()
    croppr.replace("https://cdn.syntaxphoenix.com/images/spigoticons/loginplus-logo.png");
}

bildImBildButton.addEventListener('click', () => {
    effect = 'inside';
    croppr.setAspectRatio(NaN);
})

outOfImageButton.addEventListener('click', () => {
    effect = 'outside';
    croppr.setAspectRatio(1);
})

blurDisplay.innerHTML = rangeslider.value;

rangeslider.oninput = function() {
    rangesliderValue = this.value;
    blurDisplay.innerHTML = this.value;
  }
  