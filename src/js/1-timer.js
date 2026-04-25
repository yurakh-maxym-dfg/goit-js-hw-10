'use strict';

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


let userSelectedDate = null;
let timerId = null;

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
startBtn.disabled = true;
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      const chosen = selectedDates[0];
      if (chosen.getTime() <= Date.now()) {
          iziToast.error({
              message: 'Please choose a date in the future',
              position: 'topRight'
          });
          startBtn.disabled = true;
          userSelectedDate = null;
          return;
      } else {
          userSelectedDate = chosen;
          startBtn.disabled = false;
          return;
      }
  },
};

flatpickr(input, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const onStart = () => {
    if (!userSelectedDate) return;
    startBtn.disabled = true;
    input.disabled = true;

    if (timerId !== null) {
        clearInterval(timerId);
    }
    timerId = setInterval(() => {
        const diff = userSelectedDate.getTime() - Date.now();
        if (diff <= 0) {
            clearInterval(timerId);
            updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            input.disabled = false;
            startBtn.disabled = true;
            userSelectedDate = null;
            return;
        } else {
            const time = convertMs(diff);
            updateTimer(time);
        }
    }, 1000);
}
startBtn.addEventListener('click', onStart);

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function updateTimer({ days, hours, minutes, seconds }) {
    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
} 