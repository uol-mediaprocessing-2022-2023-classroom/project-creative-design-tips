class Cewe {
  constructor(gallery) {
    this.clientId = null;
    this.username = null;
    this.gallery = gallery;
    this.loadStorage();
  }

  async login(email, password) {
    if (this.loggedIn) {
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        clientVersion: "0.0.1-medienVerDemo",
        apiAccessKey: "6003d11a080ae5edf4b4f45481b89ce7",
      },
      body: JSON.stringify({
        login: email,
        password: password,
        deviceName: "Medienverarbeitung Creative Design Tips",
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
          alert("Es ist ein Fehler bei der Verbindung zu den CEWE-Servern aufgetreten, bitte versuche es später erneut");
          return;
        }
        alert("Die eingegegeben Zugangsdaten sind nit korrekt.");
        return;
      }
      return response.json();
    });

    if (response == null) {
        return;
    }

    this.clientId = response.session.cldId;
    this.username = response.user.firstname;
    window.localStorage.setItem('clientId', this.clientId);
    window.localStorage.setItem('username', this.username);

    this.loadImages();

    return this.username;
  }

  async logout() {
    if (!this.isLoggedIn()) {
        return;
    }

    const requestOptions = {
        method: "DELETE",
        headers: { cldId: this.clientId, clientVersion: "0.0.1-offismosaic" },
    };

    const response = await fetch(
        "https://cmp.photoprintit.com/api/account/session/?invalidateRefreshToken=true",
        requestOptions
    );
    const status = response.status;
    if (!(status >= 200 && status <= 299)) {
        alert("Es ist ein Fehler im Logout-Prozess aufgetreten.");
        window.localStorage.removeItem('clientId');
        window.localStorage.removeItem('username');
        this.clientId = null;
        this.username = null;
        return;
    }

    window.localStorage.removeItem('clientId');
    window.localStorage.removeItem('username');
    this.clientId = null;
    this.username = null;
  }

  isLoggedIn() {
    return this.clientId !== null;
  }

  getUsername() {
    return this.username;
  }

  async loadImages() {
    if (!this.isLoggedIn()) {
      alert('Bitte logge dich ein um diese Funktion nutzen zu können');
    }

    // First fetch the ids of all the images on a users account, we need these in order to acquire the actual images in a given resolution
    const allImgData = await fetch(
      "https://cmp.photoprintit.com/api/photos/all?orderDirection=asc&showHidden=false&showShared=false&includeMetadata=false",
      { headers: { cldId: this.clientId, clientVersion: "0.0.0-uni_webapp_demo" } }
    ).then((idResponse) => idResponse.json());
  
    let limit = 80;
    let loadedAmount = 0;
  
    // Fetch the actual image urls and other image info using image IDs saved in allImgData
    this.gallery.resetImages();
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
          this.clientId +
          "&clientVersion=0.0.0-uni_webapp_demo"
      );
      data.url = imgResponse.url;
      this.gallery.addImage(data);
    }
  }

  async fetchHighResolution(selectedId) {
    if (!this.isLoggedIn()) {
      alert('Bitte logge dich ein um diese Funktion nutzen zu können');
    }
      // Fetch the url to the image selected by the user in it's original resolution
    const imgResponse = await fetch(
      "https://cmp.photoprintit.com/api/photos/" +
        selectedId +
        ".org?size=original&errorImage=false&cldId=" +
        this.clientId +
        "&clientVersion=0.0.0-uni_webapp_demo"
    );
    const image = Object.entries(this.gallery.getElements()).filter((obj) => {
      return obj[1].data.id === selectedId;
    })[0][1];
    let selectedImage = {
      url: imgResponse.url,
      id: selectedId,
      name: image.data.name,
      avgColor: image.data.avgColor,
    };
    return selectedImage;
  }

  async loadStorage() {
    if (window.localStorage.getItem('username') != null && window.localStorage.getItem('clientId') != null) {
      this.clientId = window.localStorage.getItem('clientId');
      this.username = window.localStorage.getItem('username');
      this.loadImages();
    }
  }
}

export {Cewe};