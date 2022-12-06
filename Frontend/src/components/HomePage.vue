<template>
  <v-container>
    <div class="headerField">
      <div class="flex-container-footer">
        <section>
          <nav style="text-align: left">
            <button class="btn-fwd btn-st btn-dark">Bild im Bild</button>
            <button class="btn-fwd btn-st btn-dark" type="button">Out of Image</button>
            <button class="btn-fwd btn-st btn-dark float-right"
              onclick="document.getElementById('loginField').style.display='block'" id="loginButton" type="button">{{ this.loginButtonText }}</button>
          </nav>
        </section>
      </div>
    </div>
    <div class="selectedImageField">
      <div class="selectedImageContainer">

        <div id="loginField" class="loginField modal">

          <form class="modal-content animate">
            <div class="imgcontainer">
              <span onclick="document.getElementById('loginField').style.display='none'" class="close"
                title="Close Modal">&times;</span>
            </div>

            <div style="display: flex" v-if="isUserNameEmpty">
            <input
              required
              placeholder="Email"
              v-model="loginData.email"
              type="email"
              name="email"
              autocomplete="email"
            />
            <input
              required
              placeholder="Password"
              v-model="loginData.password"
              type="password"
              name="password"
              autocomplete="password"
            />
          </div>
          <h1 v-if="!isUserNameEmpty" style="margin-right: 15px">
            {{ this.userName }}
          </h1>
          <v-btn
            class="clickable loginBtn"
            :disabled="awaitingLoginResponse"
            color="#d6d8e4"
            @click="login"
          >
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
              v-if="awaitingLoginResponse"
            ></v-progress-circular>
            <div style="display: flex" v-else>
              {{ this.loginButtonText }}
            </div>
          </v-btn>
          </form>
        </div>

        <div class="pagebody">
          <article>
            <div class="flex-container">
              <section class="box">
                <h2>Navigation</h2>
                <div class="vertical-menu">
                  <a href="#" class="active">Home</a>
                  <a href="#">Bild auswählen</a>
                  <a href="#">Bildberreich auswählen</a>
                  <a href="#">Ausgabe</a>
                </div>
              </section>
              <section class="box">
                <h2>Ausgewähltes Bild (Input)</h2>
                <img class="selectedImg" v-bind:src="selectedImage.url" />
              </section>
              <section class="box">
                <h2>Informationen über das Bild</h2>
                <div class="inputField">
                  <input placeholder="Your CEWE cldID" class="idInput" v-model="cldId" />
                  <button class="basicButton" @click="loadImages(cldId)">
                    Load Images
                  </button>

                  <button class="basicButton" @click="getBlur(selectedImage.id)">
                    Apply Blur
                  </button>

                  <div>
                    <h3>Image Info:<br /></h3>
                    <p>
                      {{ imageInfo.name }}
                    </p>
                    <p>
                      {{ imageInfo.avgColor }}
                    </p>
                  </div>
                </div>
              </section>
              <section class="wide-box">
                <h2>Output</h2>
                <div class="image-flex-container">
                  <img class="image-display"
                    src="https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459__480.png"
                    alt="Girl in a jacket">
                  <img class="image-display"
                    src="https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459__480.png"
                    alt="Girl in a jacket">
                  <img class="image-display"
                    src="https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459__480.png"
                    alt="Girl in a jacket">
                  <img class="image-display"
                    src="https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459__480.png"
                    alt="Girl in a jacket">
                  <img class="image-display"
                    src="https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459__480.png"
                    alt="Girl in a jacket">
                  <img class="image-display"
                    src="https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459__480.png"
                    alt="Girl in a jacket">
                  <img class="image-display"
                    src="https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459__480.png"
                    alt="Girl in a jacket">
                  <img class="image-display"
                    src="https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459__480.png"
                    alt="Girl in a jacket">
                  <img class="image-display"
                    src="https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459__480.png"
                    alt="Girl in a jacket">
                  <img class="image-display"
                    src="https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459__480.png"
                    alt="Girl in a jacket">
                  <img class="image-display"
                    src="https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459__480.png"
                    alt="Girl in a jacket">
                  <img class="image-display"
                    src="https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459__480.png"
                    alt="Girl in a jacket">
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div class="imageGalleryField">
      <div>
        <v-row>
          <v-col v-for="n in galleryImageNum" :key="n" class="d-flex child-flex" cols="2">
            <v-img :src="currGallery[n - 1].url" aspect-ratio="1" max-height="200" max-width="200"
              class="grey lighten-2" @click="updateSelected(currGallery[n - 1].id)">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>
        </v-row>
      </div>
      <button class="loadMoreBtn" @click="$emit('loadMore')">Load more</button>
    </div>
  </v-container>
</template>

<script>

window.onclick = function(event) {
    if (event.target == document.getElementById('loginField')) {
      document.getElementById('loginField').style.display = "none";
    }
}

export default {
  name: "HomePage",

  data() {
    return {
      cldId: "",
      userName: "",
      loginData: { email: "", password: "" },
      imageInfo: { name: "", avgColor: "" },
      awaitingLoginResponse: false,
      loginButtonText: "LOGIN",
      isLoggedIn: false,
    };
  },

  props: {
    selectedImage: Object,
    currGallery: Array,
  },

  methods: {
    /*
      Emit a loadImages event.
    */
    loadImages() {
      this.$emit("loadImages", this.cldId);
    },

    /*
      Emit a updateSelected event with the ID of the selected image.
      This method is called when the user clicks/selects an image in the gallery of loaded images.

      @param selectedId The ID of the selected image.
    */
    updateSelected(selectedId) {
      this.$emit("updateSelected", selectedId, this.cldId);
    },

    /*
      Emit a getBlur event with the ID of the selected image.
        
      @param selectedId The ID of the selected image.
    */
    getBlur(selectedId) {
      this.$emit("getBlur", selectedId, this.cldId, 500, 500, 1500, 1500);
    },

    /*
      Send a login request to the CEWE API test server.
      If the user is already logged in, send a logout request instead.
    */
    async login() {
      if (this.isLoggedIn) {
        this.logout();
        return;
      }

      if (this.awaitingLoginResponse) {
        return;
      }
      this.awaitingLoginResponse = true;

      let loginData = this.loginData;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          clientVersion: "0.0.1-medienVerDemo",
          apiAccessKey: "84d5fff65156920a682f71f502f63966",
        }, // this apiAccessKey is for testing
        body: JSON.stringify({
          login: loginData.email,
          password: loginData.password,
          deviceName: "Medienverarbeitung CEWE API Demo",
        }),
      };

      let status = 0;
      const response = await fetch(
        "https://tcmp.photoprintit.com/api/account/session/",
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
    },

    // Helper method called by login(), logs out the user.
    // Also resets saved website data.
    async logout() {
      if (!this.isLoggedIn) {
        return;
      }

      const requestOptions = {
        method: "DELETE",
        headers: { cldId: this.cldId, clientVersion: "0.0.1-offismosaic" },
      };

      const response = await fetch(
        "https://tcmp.photoprintit.com/api/account/session/?invalidateRefreshToken=true",
        requestOptions
      );
      const status = response.status;
      if (!(status >= 200 && status <= 299)) {
        alert("Something went wrong during logout.");
        this.loggedOut();
        return;
      }

      this.loggedOut();
    },

    // Helper method for saving user data in the browsers local storage.
    loggedIn(cldId, userName) {
      this.cldId = cldId;
      this.isLoggedIn = true;
      this.userName = userName;
      localStorage.cldId = cldId;
      localStorage.userName = userName;
      localStorage.isLoggedIn = true;
    },

    // Helper method for clearing user data from the browsers local storage.
    loggedOut() {
      localStorage.cldId = "";
      localStorage.userName = "";
      localStorage.isLoggedIn = false;
      this.resetData();
    },

    // Helper method for resetting saved data.
    resetData() {
      this.cldId = "";
      this.isLoggedIn = false;
      this.userName = "";
      this.loginData = { email: "", password: "" };
      this.imageInfo = { name: "", avgColor: "" };
      this.awaitingLoginResponse = false;
      this.$emit("resetGalery");
    },
  },

  computed: {
    /*
        The numer of images within currGallery can dynamically change after the DOM is loaded, since the size of the image gallery depends on it
        it's important for it to be updated within the DOM aswell. By using computed values this is not a problem since Vue handles any updates to such
        values and updates them in the DOM.
        */
    galleryImageNum() {
      return this.currGallery.length;
    },

    isUserNameEmpty: function () {
      return this.userName == "";
    },
  },

  watch: {
    /*
      Watcher function for updating the displayed image information.
    */
    selectedImage: function () {
      this.imageInfo = {
        name: "Name: " + this.selectedImage.name,
        avgColor: "Average color: " + this.selectedImage.avgColor,
      };
    },

    /*
      Watcher function for updating login button text.
    */
    isLoggedIn(isLoggedIn) {
      if (isLoggedIn) {
        this.loginButtonText = "LOGOUT";
      } else {
        this.loginButtonText = "LOGIN";
      }
    },
  },

  mounted() {
    // Load from local storage
    if (localStorage.isLoggedIn === "true") {
      this.cldId = localStorage.cldId;
      this.userName = localStorage.userName;
      this.isLoggedIn = true;
    }
    this.$el.addEventListener('click', this.onClick)
  },
};
</script>

<style scoped>
.selectedImageField {
  display: flex;
  flex-direction: row;

  background-color: rgb(249, 251, 255);
  border-radius: 10px;
  box-shadow: 0 10px 10px 10px rgba(0, 0, 0, 0.1);
  color: black;

  padding: 1%;
}

.imageGalleryField {
  display: flex;
  flex-direction: column;

  background-color: rgb(249, 251, 255);
  border-radius: 10px;
  box-shadow: 0 10px 10px 10px rgba(0, 0, 0, 0.1);
  color: black;

  padding: 1%;
  margin-top: 1%;
  max-height: 400px;
  overflow-y: auto;
}

.headerField {
  display: flex;
  flex-direction: row;

  background-color: rgb(249, 251, 255);
  border-radius: 10px;
  box-shadow: 0 10px 10px 10px rgba(0, 0, 0, 0.1);
  color: black;
  margin-bottom: 5px;

  padding: 0%;
}

.selectedImg {
  max-width: 100%;
  max-height: 100%;
}

.selectedImageInfo {
  margin-left: 10px;
}

.basicButton {
  background-color: rgb(226, 215, 215);
  padding: 0px 4px 0px 4px;
  margin-right: 5px;
  border-radius: 3px;
  width: 150px;
}

.idInput {
  margin-right: 8px;
  border: 1px solid #000;
  border-radius: 3px;
}

.loginField {
  display: flex;
  margin-left: auto;
  margin-bottom: 12px;
}

.loginField * {
  margin: 0px 5px 0px 5px;
}

.loginField * input {
  border: 1px solid #000;
  border-radius: 3px;
}

.inputField {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  width: 400px;
}

.inputField * {
  margin: 5px 0px 5px 0px;
}

.loadMoreBtn {
  background-color: #a7a7a7;
  border-radius: 6px;
  padding-left: 5px;
  padding-right: 5px;
  width: 100px;
  align-self: center;
  margin-top: 10px;
}

.flex-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.pagebody {
  flex: 1 0 auto;
  margin: 0;
  font-family: Garamond;
  display: flex;
  flex-direction: column;
  word-break: break-word;
}

.header,
.pagebody {
  padding: 5%;
  padding-top: 10px;
  padding-bottom: 20px;
}

.image-flex-container {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  max-height: 400px;
  overflow-y: auto;
}

.image-display {
  padding: 1%;
  object-fit: cover;
  width: 25%;
  height: 25%;
}

.box,
.wide-box {
  border-radius: 20px;
  border: none;
  padding: 20px;
  margin: 40px;
  margin-top: 40px;
  margin-bottom: 20px;
}

.box {
  max-width: 40%;
}

.wide-box {
  max-width: 100%;
}

.btn-st {
  font-family: 'ABeeZee', Helvetica;
  display: inline-block;
  border-radius: 4px;
  border: none;
  text-align: center;
  transition: all 0.5s;
  cursor: pointer;
  text-decoration: none;
}

.btn-fwd span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

.btn-fwd span::after {
  content: '\00bb';
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}

.btn-fwd:hover span {
  padding-right: 25px;
}

.btn-st:hover span::after {
  opacity: 1;
  right: 0;
}

.btn-dark {
  color: rgb(0, 0, 0) !important;
  background-color: rgba(255, 255, 255, 0.2);
  font-size: 20px;
  padding: 15px;
  width: 200px;
  margin: 5px;
}

.btn-dark:hover {
  background-color: rgba(255, 255, 255, 0.3)
}

.flex-container-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
}

.flex-container-footer>section {
  max-width: 100%;
  min-width: 220px;
  width: 100%;
  margin: 5px;
  text-align: center;
}

.float-right {
  float: right;
}

.vertical-menu {
  width: 100px;
  /* Set a width if you like */
}

.vertical-menu a {
  background-color: #eee;
  color: black;
  display: block;
  padding: 12px;
  text-decoration: none;
}

.vertical-menu a:hover {
  background-color: #ccc;
}

.vertical-menu a.active {
  background-color: #04AA6D;
  color: white;
}

/* Full-width input fields */
input[type=email],
input[type=password] {
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

button:hover {
  opacity: 0.8;
}

.imgcontainer {
  text-align: center;
  margin: 24px 0 12px 0;
  position: relative;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  padding-top: 60px;
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto 15% auto;
  border: 1px solid #888;
  width: 40%;
  padding: 20px;
}

.close {
  position: absolute;
  right: 25px;
  top: 0;
  color: #000;
  font-size: 35px;
  font-weight: bold;
}

.close:hover,.close:focus {
  color: red;
  cursor: pointer;
}

.animate {
  -webkit-animation: animatezoom 0.6s;
  animation: animatezoom 0.6s
}

@-webkit-keyframes animatezoom {
  from {
    -webkit-transform: scale(0)
  }

  to {
    -webkit-transform: scale(1)
  }
}

@keyframes animatezoom {
  from {
    transform: scale(0)
  }

  to {
    transform: scale(1)
  }
}
</style>