import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const datetimePicker = document.querySelector('#datetime-picker');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

let countdownInterval = null;
let userSelectedDate = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    try {
      if (selectedDate < new Date()) {
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
        });
        startBtn.disabled = true;
      } else {
        userSelectedDate = selectedDate;
        startBtn.disabled = false;
      }
    } catch (error) {
      console.error('Error in onClose handler:', error);
      iziToast.error({
        title: 'Error',
        message: 'An error occurred. Please try again.',
      });
      startBtn.disabled = true;
    }
  },
};

try {
  flatpickr(datetimePicker, options);
} catch (error) {
  console.error('Error initializing flatpickr:', error);
  iziToast.error({
    title: 'Error',
    message: 'Failed to initialize date picker. Please refresh the page.',
  });
}

startBtn.addEventListener('click', startCountdown);

function startCountdown() {
  try {
    if (countdownInterval) clearInterval(countdownInterval);

    startBtn.disabled = true;
    datetimePicker.disabled = true;

    countdownInterval = setInterval(() => {
      const now = new Date();
      const timeRemaining = userSelectedDate - now;

      if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        updateTimer(0, 0, 0, 0);
        datetimePicker.disabled = false;
        return;
      }

      const { days, hours, minutes, seconds } = convertMs(timeRemaining);
      updateTimer(days, hours, minutes, seconds);
    }, 1000);
  } catch (error) {
    console.error('Error in startCountdown:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to start countdown. Please try again.',
    });
    startBtn.disabled = false;
    datetimePicker.disabled = false;
  }
}

function updateTimer(days, hours, minutes, seconds) {
  try {
    daysSpan.textContent = addLeadingZero(days);
    hoursSpan.textContent = addLeadingZero(hours);
    minutesSpan.textContent = addLeadingZero(minutes);
    secondsSpan.textContent = addLeadingZero(seconds);
  } catch (error) {
    console.error('Error updating timer:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to update timer display.',
    });
  }
}

function addLeadingZero(value) {
  try {
    return String(value).padStart(2, '0');
  } catch (error) {
    console.error('Error in addLeadingZero:', error);
    return value;
  }
}

function convertMs(ms) {
  try {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  } catch (error) {
    console.error('Error in convertMs:', error);
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
}
