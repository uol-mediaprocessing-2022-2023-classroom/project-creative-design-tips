class Cewe {
    constructor(clientId, gallery) {
        this.clientId = clientId;
        this.gallery = gallery;
    }

    async loadImages() {
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
}

export {Cewe};