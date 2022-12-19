const { Modal } = require("bootstrap");
var Croppr = require('croppr');
import { Gallery } from './../partials/gallery.js';
import { loadImages } from './../partials/cewe-api.js'
import { Cewe } from '../partials/cewe.js';

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
let gallery = new Gallery(document.getElementById('image-gallery'));
let cewe = null;
let cropXStart = null;
let cropYStart = null;
let cropXEnd = null;
let cropYEnd = null;

var croppr = new Croppr('#selectedImage', {
    // alternatively use croppr.getValue() with return value = {x: 21, y: 63: width: 120, height: 120}
    onCropEnd: function(data) {
        cropXStart = data.x;
        cropYStart = data.y;
        cropXEnd = (data.x + data.width);
        cropYEnd = (data.y + data.height);
        console.log(cropXStart, cropYStart, cropXEnd, cropYEnd);
      },
      startSize: [80,80]
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
            apiAccessKey: "84d5fff65156920a682f71f502f63966",
        }, // this apiAccessKey is for testing
        body: JSON.stringify({
            login: email.value,
            password: pw.value,
            deviceName: "Medienverarbeitung CEWE API Demo",
        }),
    };

    const response = await fetch(
        "https://tcmp.photoprintit.com/api/account/session/",
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
    croppr.setImage(highresolution.url);
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
    croppr.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/800px-Image_created_with_a_mobile_phone.png");
}