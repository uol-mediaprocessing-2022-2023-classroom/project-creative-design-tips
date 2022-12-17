let clientId = null;
let isLoggedIn = false;
let userName = "";
let email = document.getElementById('email');
let pw = document.getElementById('password');
let loginButton = document.getElementById('loginButton');
let loginView = document.getElementById('login');
let usernNameField = document.getElementById('userName');

loginButton.addEventListener('click',login);

async function login() {

    let status = 0;

    if (isLoggedIn) {
        alert("works")
        logout();
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

    cldId = response.session.cldId;
    userName = response.user.firstname;
    loginView.style.display = 'none';
    loginButton.innerHTML = "Logout";
    usernNameField.innerHTML = userName;
    userName.style.display = "";
    isLoggedIn = true;
}

function logout() {
    cldId = ""; 
    userName = "";
    loginView.style.display = '';
}