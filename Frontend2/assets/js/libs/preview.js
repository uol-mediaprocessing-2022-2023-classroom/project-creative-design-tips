class Preview {
    constructor(element) {
        this.element = element;
        this.elements = {};
        this.counter = 0;
    }

    addPreviewImage(imageUrl) {
        let entry = document.createElement('div');
        entry.classList.add('output-image');

        let image = document.createElement('img');
        image.classList.add('image-display');
        image.src = imageUrl;
        entry.appendChild(image);

        let button = document.createElement('button');
        button.classList.add('btn');
        button.classList.add('btn-sm');
        button.classList.add('btn-danger');
        button.classList.add('download-btn');
        button.innerText = 'Download';
        entry.appendChild(button);

        this.element.appendChild(entry);
        this.elements[this.counter] = {
            data: imageUrl,
            element: entry
        };

        this.counter = this.counter + 1;
    }

    getElements() {
        return this.elements;
    }

    resetImages() {
        Object.keys(this.elements).forEach(imageId => {
            this.elements[imageId].element.remove();
        });
        this.elements = {};
    }
}

export {Preview};