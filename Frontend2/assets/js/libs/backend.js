class Backend {
  async getBlur(selectedUrl, xStart, yStart, xEnd, yEnd, blur, paddingWidth, paddingColor) {
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
    formData.append('paddingWidth', paddingWidth);
    formData.append('paddingColor', paddingColor);
    

    let blurImg = await fetch(url, {
      method: "post",
      body: formData,
    })
      .then((response) => response.blob())
      .then((imageBlob) => {
        return URL.createObjectURL(imageBlob);
      });
    return blurImg;
  }
  async getOutOfImage(selectedUrl, xStart, yStart, xEnd, yEnd, height) {
    let url = "http://127.0.0.1:8000/get-ai-outofimage/";

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
    formData.append('height', height);

    let outOfImg = await fetch(url, {
      method: "post",
      body: formData,
    })
      .then((response) => response.blob())
      .then((imageBlob) => {
        return URL.createObjectURL(imageBlob);
      });
    return outOfImg;
  }
}

export {Backend};