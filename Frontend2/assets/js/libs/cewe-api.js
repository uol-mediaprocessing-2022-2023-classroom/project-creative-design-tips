import { Gallery } from './../libs/gallery.js';

export async function loginUnused() {

    if (!isLoggedIn) {
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
            login: email,
            password: pw,
            deviceName: "Medienverarbeitung CEWE API Demo",
        }),
    };

    let status = 0;

    const response = await fetch(
        "https://cmp.photoprintit.com/api/account/session/",
        requestOptions
    ).then((response) => {
        status = response.status;

        if (!(status >= 200 && status <= 299)) {
            this.awaitingLoginResponse = false;
            // some broad status 'handling'
            if (status == 500 || status == 405) {
                alert("Internal error occured, try again later.");
                return;
            }
            alert("Entered credinentials are incorrect.");
            return;
        }

        this.awaitingLoginResponse = false;
        return response.json();
    });

    if (response == null) {
        return;
    }

    let cldId = response.session.cldId;
    let userName = response.user.firstname;
    this.loginData = {
        email: "",
        password: "",
    };

    this.loggedIn(cldId, userName);
}
  
// Helper method called by login(), logs out the user.
// Also resets saved website data.
async function logout() {
    if (!this.isLoggedIn) {
        return;
    }

    const requestOptions = {
        method: "DELETE",
        headers: { cldId: this.cldId, clientVersion: "0.0.1-offismosaic" },
    };

    const response = await fetch(
        "https://cmp.photoprintit.com/api/account/session/?invalidateRefreshToken=true",
        requestOptions
    );
    const status = response.status;
    if (!(status >= 200 && status <= 299)) {
        alert("Something went wrong during logout.");
        this.loggedOut();
        return;
    }

    this.loggedOut();
}
  
// Helper method for saving user data in the browsers local storage.
function loggedIn(cldId, userName) {
    this.cldId = cldId;
    this.isLoggedIn = true;
    this.userName = userName;
    localStorage.cldId = cldId;
    localStorage.userName = userName;
    localStorage.isLoggedIn = true;
}
  
// Helper method for clearing user data from the browsers local storage.
function loggedOut() {
    localStorage.cldId = "";
    localStorage.userName = "";
    localStorage.isLoggedIn = false;
    this.resetData();
}
  
// Helper method for resetting saved data.
function resetData() {
    this.cldId = "";
    this.isLoggedIn = false;
    this.userName = "";
    this.loginData = { email: "", password: "" };
    this.imageInfo = { name: "", avgColor: "" };
    this.awaitingLoginResponse = false;
    this.$emit("resetGalery");
}

export async function loadImages(cldId, gallery) {
    // First fetch the ids of all the images on a users account, we need these in order to acquire the actual images in a given resolution
    const allImgData = await fetch(
      "https://cmp.photoprintit.com/api/photos/all?orderDirection=asc&showHidden=false&showShared=false&includeMetadata=false",
      { headers: { cldId: cldId, clientVersion: "0.0.0-uni_webapp_demo" } }
    ).then((idResponse) => idResponse.json());

    let limit = 80;
    let loadedAmount = 0;
    let currGallery = [];

    // Fetch the actual image urls and other image info using image IDs saved in allImgData
    gallery.resetImages();
    for (const photo of allImgData.photos) {
      // Stop once the limit is reached
      if (loadedAmount >= limit) {
        break;
      }
      loadedAmount += 1;

      const data = {};
      data.id = photo.id;
      data.name = photo.name;
      data.avgColor = photo.avgHexColor;
      data.timestamp = photo.timestamp;
      data.type = photo.mimeType;

      const imgResponse = await fetch(
        "https://cmp.photoprintit.com/api/photos/" +
          photo.id +
          ".jpg?size=300&errorImage=false&cldId=" +
          cldId +
          "&clientVersion=0.0.0-uni_webapp_demo"
      );
      data.url = imgResponse.url;
      gallery.addImage(data);
    }
}

  /*
  Update the selected image visible on the HomePage.

  @param slectedId ID of the selected image.
  */
export async function updateSelected(selectedId, cldId) {
    // Fetch the url to the image selected by the user in it's original resolution
    const imgResponse = await fetch(
      "https://cmp.photoprintit.com/api/photos/" +
        selectedId +
        ".org?size=original&errorImage=false&cldId=" +
        cldId +
        "&clientVersion=0.0.0-uni_webapp_demo"
    );
    const image = this.currGallery.filter((obj) => {
      return obj.id === selectedId;
    })[0];
    this.selectedImage = {
      url: imgResponse.url,
      id: selectedId,
      name: image.name,
      avgColor: image.avgColor,
    };
}

  /*
  Display a blurred version of the image.
  The image is processed by the backend and sent to the app.

  @param selectedId ID of the image to be blurred.
  */
export async function getBlur(selectedId, cldId, xStart, yStart, xEnd, yEnd) {
    let localUrl = "http://127.0.0.1:8000/get-blur";
    let url = localUrl + "/" + cldId + "/" + selectedId + '/' + xStart + '/' + yStart + '/' + xEnd + '/' + yEnd;

    let blurImg = await fetch(url, {
      method: "get",
    })
      .then((response) => response.blob())
      .then((imageBlob) => {
        return URL.createObjectURL(imageBlob);
      });
    this.selectedImage.url = blurImg;
}


function resetGallery() {
    this.selectedImage = { url: placeholder, id: "placeholder" };
    this.currGallery = [];
}