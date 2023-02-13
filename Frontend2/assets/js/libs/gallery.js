class Gallery {
    constructor(element) {
        this.element = element;
        this.elements = {};
        this.counter = 0;
    }

    addImage(data) {
        let entry = document.createElement('div');
        entry.classList.add('col-3');

        let image = document.createElement('img');
        image.classList.add('w-100');
        image.classList.add('select-image');
        image.src = data.url;
        image.dataset.id = this.counter;
        entry.appendChild(image);


        this.element.appendChild(entry);
        this.elements[this.counter] = {
            data: data,
            element: entry
        };
        this.counter++;
    }

    getElements() {
        return this.elements;
    }

    getImageData(imageId) {
        return this.elements[imageId];
    }

    resetImages() {
        Object.keys(this.elements).forEach(imageId => {
            this.elements[imageId].element.remove();
        });
        this.elements = {};
    }
}

export {Gallery};