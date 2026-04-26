'use strict';

import iziToast from "izitoast";

import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');

const onSubmit = (event) => {
    event.preventDefault();
    const currForm = event.currentTarget;

    const delay = Number(currForm.elements.delay.value);
    const state = currForm.elements.state.value;

    createPromise(delay, state)
        .then((delayValue) => {
            iziToast.success({
                message: `✅ Fulfilled promise in ${delayValue}ms`,
                position: "topRight",
                icon: ''
            });
        })
        .catch((delayValue) => {
            iziToast.error({
                message: `❌ Rejected promise in ${delayValue}ms`,
                position: "topRight",
                icon: ''
            });
        });
    currForm.reset();
};

form.addEventListener('submit', onSubmit);

const createPromise = (delay, state) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    })
}