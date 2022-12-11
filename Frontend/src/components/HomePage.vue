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
                <cropper
                  class="selectedImg"
		              :src="selectedImage.url"
		              @change="change"
	              />
              </section>
              <section class="box">
                <h2>Informationen über das Bild</h2>
                <div class="inputField">
                  <input placeholder="Your CEWE cldID" class="idInput" v-model="cldId" />
                  <button class="basicButton" @click="loadImages(cldId)">
                    Load Images
                  </button>

                  <button class="basicButton" @click="getBlur(selectedImage.id)">
                    Effekt anwenden
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
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

window.onclick = function(event) {
    if (event.target == document.getElementById('loginField')) {
      document.getElementById('loginField').style.display = "none";
    }
}

export default {
  name: "HomePage",

  components: {
		Cropper,
  },

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
      is called on every cropping change of an image.
    */
    change({ coordinates, canvas }) {
			console.log(coordinates, canvas);
		},

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
