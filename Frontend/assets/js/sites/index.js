const { Modal } = require("bootstrap");
import Cropper from 'cropperjs';
import { Gallery } from './../libs/gallery.js';
import { Cewe } from '../libs/cewe.js';
import { Backend } from '../libs/backend.js';
import { Toaster } from '../libs/toaster.js';
import { Preview } from '../libs/preview.js';

const ofi_options = {
    'ai_1': { title: 'KI-gestützt (KI 1)', aspectRatio: 1 },
    'ai_2': { title: 'KI-gestützt (KI 2)', aspectRatio: 1 },
    'ai_3': { title: 'KI-gestützt (KI 3)', aspectRatio: 1 },
    'ai_4': { title: 'KI-gestützt (KI 4)', aspectRatio: 1 },
    'ai_5': { title: 'KI-gestützt (KI 5)', aspectRatio: 1 },
    'ai_6': { title: 'KI-gestützt (KI 6)', aspectRatio: 1 },
    'ai_7': { title: 'KI-gestützt (KI 7)', aspectRatio: 1 },
    'hough_logic': { title: 'Hough-Transformation', aspectRatio: NaN },
}

let email = document.getElementById('email');
let pw = document.getElementById('password');
let loginForm = document.getElementById('loginForm');
let loginView = document.getElementById('login');
let userNameField = document.getElementById('userName');
let loginModalButton = document.getElementById('loginModalButton');
let loginModal = new Modal(document.getElementById('loginModal'));
let imagesOpenButton = document.getElementById('openImagesButton');
let imageModal = new Modal(document.getElementById('imageModal'));
let loadImagesButton = document.getElementById('loadImagesbutton');
let addEffectButton = document.getElementById('addEffectButton');
let gallery = new Gallery(document.getElementById('image-gallery'));
let toaster = new Toaster(document.getElementById('toaster'));
let cewe = new Cewe(gallery, toaster);
let preview = new Preview(document.getElementById('preview-elements'));
let cropXStart = null;
let cropYStart = null;
let cropXEnd = null;
let cropYEnd = null;
let backend = new Backend(toaster);
let selectedImage = "/build/img/default.webp";
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
let renderingMethodSelect = document.getElementById('ofi_rendering_method');
let previewSelect = document.getElementById('preview_active');

for (const [key, value] of Object.entries(ofi_options)) {
    let option = document.createElement('option');
    option.value = key;
    option.innerText = value.title;

    renderingMethodSelect.appendChild(option);
}

toggleLoginLogout(cewe.isLoggedIn());

var croppr = new Cropper(document.getElementById('selectedImage'), {
    crop(event) {
        cropXStart = Math.round(event.detail.x);
        cropYStart = Math.round(event.detail.y);
        cropXEnd = Math.round(cropXStart + event.detail.width);
        cropYEnd = Math.round(cropYStart + event.detail.height);
    },
    zoomable: false
});

renderingMethodSelect.addEventListener('change', (event) => {
    event.preventDefault();
    croppr.setAspectRatio(ofi_options[renderingMethodSelect.value].aspectRatio);
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
imagesOpenButton.addEventListener('click', () => {
    imageModal.show();
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
    preview.resetImages();
    let inputValue = document.getElementById('inputHeight').value;
    let height = isNaN(inputValue) ? 250 : inputValue;

    let newUrl = await backend.getOutOfImage(selectedImage, cropXStart, cropYStart, cropXEnd, cropYEnd, height, renderingMethodSelect.value);
    document.getElementById('default-output').querySelector('img').src = newUrl;
    document.getElementById('default-output').querySelector('.image-loading').classList.add('d-none');

    if (previewSelect.checked) {
        for (const [key, value] of Object.entries(ofi_options)) {
            if (renderingMethodSelect.value !== key) {
                let newUrl = await backend.getOutOfImage(selectedImage, cropXStart, cropYStart, cropXEnd, cropYEnd, height, key, true);
                preview.addPreviewImage(newUrl);
            }
        }
    }
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
    document.getElementById('selectedImage-name').innerText = imageData.data.name;
    document.getElementById('selectedImage-avgColor').innerText = imageData.data.avgColor;
    document.getElementById('paddingColorInput').value = imageData.data.avgColor;

    // Load High-Resolution
    let highresolution = await cewe.fetchHighResolution(imageData.data.id);

    croppr.replace(highresolution.url);

    selectedImage = highresolution.url;
    imageModal.hide();
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
    a.download = fileName + '.' + fileEnding;
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
    croppr.replace("/build/img/default.webp");
}

bildImBildButton.addEventListener('click', () => {
    effect = 'inside';
    croppr.setAspectRatio(NaN);
    bildImBildButton.classList.add('active');
    outOfImageButton.classList.remove('active');
    document.getElementById('settings_imi').classList.remove('d-none');
    document.getElementById('settings_ofi').classList.add('d-none');
})

outOfImageButton.addEventListener('click', () => {
    effect = 'outside';
    croppr.setAspectRatio(1);
    bildImBildButton.classList.remove('active');
    outOfImageButton.classList.add('active');
    document.getElementById('settings_imi').classList.add('d-none');
    document.getElementById('settings_ofi').classList.remove('d-none');
})

blurDisplay.innerHTML = rangeslider.value;

rangeslider.oninput = function() {
    rangesliderValue = this.value;
    blurDisplay.innerHTML = this.value;
}
  
