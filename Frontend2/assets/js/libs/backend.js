class Backend {
  constructor(toaster) {
    this.toaster = toaster;
  }

  async getBlur(selectedUrl, xStart, yStart, xEnd, yEnd, blur) {
    try {
      let url = "http://127.0.0.1:8000/get-blur/";

      let imageData = await fetch(selectedUrl, {
        method: "get"
      })
        .then((response) => response.blob())
        .then((imageBlob) => {
          return imageBlob;
        });

      let file = new File([imageData], 'image.png', { lastModified: new Date().getTime(), type: imageData.type });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('xStart', xStart);
      formData.append('yStart', yStart);
      formData.append('xEnd', xEnd);
      formData.append('yEnd', yEnd);
      formData.append('blur', blur);
      

      let blurImg = await fetch(url, {
        method: "post",
        body: formData,
      })
        .then((response) => {
          status = response.status;

          if (!(status >= 200 && status <= 299)) {
            // some broad status 'handling'
            if (status == 500 || status == 405) {
              this.toaster.addToast('danger', 'Fehler', 'Leider ist bei der Verarbeitung ein Fehler aufgereteten, das sollte so nicht passieren');
              return;
            }
            this.toaster.addToast('danger', 'Fehler', 'Es ist ein unbekannter Fehler aufgetreten');
            return;
          }
          return response.blob();
        })
        .then((imageBlob) => {
          return URL.createObjectURL(imageBlob);
        });
      return blurImg;
    } catch (error) {
      this.toaster.addToast('danger', 'Fehler', 'Leider ist bei der Verarbeitung ein Fehler aufgereteten, das sollte so nicht passieren');
      return '/build/img/default.webp';
    }
  }
  async getOutOfImage(selectedUrl, xStart, yStart, xEnd, yEnd, height, type) {
    try {
      let url = "http://127.0.0.1:8000/get-ai-outofimage/";

      let imageData = await fetch(selectedUrl, {
        method: "get"
      })
        .then((response) => {
          status = response.status;

          if (!(status >= 200 && status <= 299)) {
            // some broad status 'handling'
            if (status == 500 || status == 405) {
              this.toaster.addToast('danger', 'Fehler', 'Leider ist bei der Verarbeitung ein Fehler aufgereteten, das sollte so nicht passieren');
              return;
            }
            this.toaster.addToast('danger', 'Fehler', 'Es ist ein unbekannter Fehler aufgetreten');
            return;
          }
          return response.blob();
        })
        .then((imageBlob) => {
          return imageBlob;
        });

      let file = new File([imageData], 'image.png', { lastModified: new Date().getTime(), type: imageData.type });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('xStart', xStart);
      formData.append('yStart', yStart);
      formData.append('xEnd', xEnd);
      formData.append('yEnd', yEnd);
      formData.append('height', height);
      formData.append('type', type)

      let outOfImg = await fetch(url, {
        method: "post",
        body: formData,
      })
        .then((response) => {
          status = response.status;

          console.log(status);

          if (!(status >= 200 && status <= 299)) {
            // some broad status 'handling'
            if (status == 500 || status == 405) {
              this.toaster.addToast('danger', 'Fehler', 'Leider ist bei der Verarbeitung ein Fehler aufgereteten, das sollte so nicht passieren');
              return;
            }
            this.toaster.addToast('danger', 'Fehler', 'Es ist ein unbekannter Fehler aufgetreten');
            return;
          }
          return response.blob();
        })
        .then((imageBlob) => {
          return URL.createObjectURL(imageBlob);
        });
      return outOfImg;
    } catch (error) {
      this.toaster.addToast('danger', 'Fehler', 'Leider ist bei der Verarbeitung ein Fehler aufgereteten, das sollte so nicht passieren');
      return '/build/img/default.webp';
    }
  }
}

export {Backend};