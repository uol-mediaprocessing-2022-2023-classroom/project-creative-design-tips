const { Modal } = require("bootstrap");
import Cropper from 'cropperjs';
import { Gallery } from './../libs/gallery.js';
import { Cewe } from '../libs/cewe.js';
import { Backend } from '../libs/backend.js';

let email = document.getElementById('email');
let pw = document.getElementById('password');
let loginForm = document.getElementById('loginForm');
let loginView = document.getElementById('login');
let userNameField = document.getElementById('userName');
let loginModalButton = document.getElementById('loginModalButton');
let loginModal = new Modal(document.getElementById('loginModal'));
let loadImagesButton = document.getElementById('loadImagesbutton');
let addEffectButton = document.getElementById('addEffectButton');
let gallery = new Gallery(document.getElementById('image-gallery'));
let cewe = new Cewe(gallery);
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
let paddingWidth = document.getElementById("paddingWidthInput").value;
let paddingColor = document.getElementById("paddingColorInput").value;

toggleLoginLogout(cewe.isLoggedIn());

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

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    login();
});
loginModalButton.addEventListener('click', () => {
    if (!loginModalButton.hasAttribute('data-bs-toggle')) {
        login();
    }
});

async function login() {
    if (cewe.isLoggedIn()) {
        await cewe.logout();
        toggleLoginLogout(cewe.isLoggedIn());
        logout();
        return;
    }

    await cewe.login(email.value, pw.value);
    toggleLoginLogout(cewe.isLoggedIn());
}

loadImagesButton.addEventListener('click', () => {
    if (cewe.isLoggedIn()) { cewe.loadImages(); }
});

addEffectButton.addEventListener('click', () => {
    document.getElementById('default-output').querySelector('.image-loading').classList.remove('d-none');
    if (effect == 'inside') {
        loadBlur();
    } else {
        loadOutOfImage();
    }
});

async function loadBlur() {
    let paddingWidth = document.getElementById("paddingWidthInput").value;
    let paddingColor = document.getElementById("paddingColorInput").value;
    let newUrl = await backend.getBlur(selectedImage, cropXStart, cropYStart, cropXEnd, cropYEnd, rangesliderValue, paddingWidth, paddingColor);
    document.getElementById('default-output').querySelector('img').src = newUrl;
    document.getElementById('default-output').querySelector('.image-loading').classList.add('d-none');
}

async function loadOutOfImage() {
    let inputValue = document.getElementById('inputHeight').value;
    console.log(inputValue);
    let height = isNaN(inputValue) ? 250 : inputValue;

    let newUrl = await backend.getOutOfImage(selectedImage, cropXStart, cropYStart, cropXEnd, cropYEnd, height);
    document.getElementById('default-output').querySelector('img').src = newUrl;
    document.getElementById('default-output').querySelector('.image-loading').classList.add('d-none');
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
    document.getElementById('paddingColorInput').value = imageData.data.avgColor;

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

function toggleLoginLogout(loggedIn) {
    if (loggedIn) {
        userNameField.classList.remove('d-none');
        loginModalButton.innerText = 'Logout';
        loginModalButton.removeAttribute('data-bs-toggle');
        loginModalButton.removeAttribute('data-bs-target');
        loginModal.hide();
        userNameField.innerHTML = cewe.getUsername();
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
    bildImBildButton.classList.add('active');
    outOfImageButton.classList.remove('active');
})

outOfImageButton.addEventListener('click', () => {
    effect = 'outside';
    croppr.setAspectRatio(1);
    bildImBildButton.classList.remove('active');
    outOfImageButton.classList.add('active');
})

blurDisplay.innerHTML = rangeslider.value;

rangeslider.oninput = function() {
    rangesliderValue = this.value;
    blurDisplay.innerHTML = this.value;
  }
  
