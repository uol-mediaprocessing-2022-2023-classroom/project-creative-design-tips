class Backend {
    async getBlur(selectedUrl, xStart, yStart, xEnd, yEnd) {
        let url = "http://127.0.0.1:8000/get-blur/";

        let imageData = await fetch(selectedUrl, {
          method: "get"
        })
          .then((response) => response.blob())
          .then((imageBlob) => {
            return imageBlob;
          });

        console.log(imageData);
        let file = new File([imageData], 'image.png', { lastModified: new Date().getTime(), type: imageData.type });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('xStart', xStart);
        formData.append('yStart', yStart);
        formData.append('xEnd', xEnd);
        formData.append('yEnd', yEnd);

        let blurImg = await fetch(url, {
          method: "post",
          body: formData,
        })
          .then((response) => response.blob())
          .then((imageBlob) => {
            console.log(imageBlob);
            return URL.createObjectURL(imageBlob);
          });
        console.log(blurImg);
        return blurImg;
    }
}

export {Backend};