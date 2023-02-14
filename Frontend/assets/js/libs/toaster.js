const { Toast } = require("bootstrap");

class Toaster {
    constructor(element) {
        this.element = element;
        this.counter = 0;
    }

    addToast(type, title, text) {
        this.counter = this.counter + 1;

        let toast = document.createElement('div');
        toast.classList.add('toast');
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        toast.id = 'toast_' + this.counter;

        let headerElement = document.createElement('div');
        headerElement.classList.add('toast-header');

        toast.appendChild(headerElement);

        let imageElement = document.createElement('img');
        imageElement.classList.add('rounded');
        imageElement.classList.add('me-2');
        imageElement.classList.add('toaster-image');
        imageElement.src = '/build/img/' + type + '.png';

        headerElement.appendChild(imageElement);

        let titleElement = document.createElement('strong');
        titleElement.classList.add('me-auto');
        titleElement.innerText = title;

        headerElement.appendChild(titleElement);

        let timeElement = document.createElement('small');
        timeElement.classList.add('ms-auto');
        timeElement.innerHTML = 'just now';

        headerElement.appendChild(timeElement);

        let buttonElement = document.createElement('button');
        buttonElement.classList.add('btn');
        buttonElement.classList.add('btn-danger');
        buttonElement.classList.add('btn-sm');
        buttonElement.classList.add('ms-1');
        buttonElement.setAttribute('type', 'button');
        buttonElement.setAttribute('data-bs-dismiss', 'toast');
        buttonElement.setAttribute('aria-label', 'Close');

        let iconElement = document.createElement('i');
        iconElement.classList.add('fa-solid');
        iconElement.classList.add('fa-xmark');

        buttonElement.appendChild(iconElement);

        headerElement.appendChild(buttonElement);

        let bodyElement = document.createElement('div');
        bodyElement.classList.add('toast-body');
        bodyElement.innerText = text;

        toast.appendChild(bodyElement);

        this.element.appendChild(toast);

        const toastElement = document.getElementById('toast_' + this.counter);
        const bsToast = new Toast(toastElement);

        bsToast.show();
    }
}

export {Toaster};