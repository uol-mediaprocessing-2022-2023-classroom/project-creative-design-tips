class Backend {
    async getBlur(selectedUrl, xStart, yStart, xEnd, yEnd) {
        let localUrl = "http://127.0.0.1:8000/get-blur";
        let url = localUrl + "/?url=" + encodeURIComponent(selectedUrl) + '&xStart=' + xStart + '&yStart=' + yStart + '&xEnd=' + xEnd + '&yEnd=' + yEnd;
    
        //url = 'https://syntaxphoenix.com/build/img/maincubes_building_small.jpg';

        let blurImg = await fetch(url, {
          method: "get",
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