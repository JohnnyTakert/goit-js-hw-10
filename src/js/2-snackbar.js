import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', event => {
  event.preventDefault();

  try {
    const delay = Number(form.elements.delay.value);
    const state = form.elements.state.value;

    if (isNaN(delay) || delay <= 0) {
      throw new Error('Invalid delay value');
    }

    createPromise(delay, state)
      .then(message => {
        iziToast.success({ title: 'Success', message });
      })
      .catch(message => {
        iziToast.error({ title: 'Error', message });
      });
  } catch (error) {
    console.error('Form submission error:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to create notification. Please try again.',
    });
  }
});

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(`✅ Fulfilled promise in ${delay}ms`);
      } else {
        reject(`❌ Rejected promise in ${delay}ms`);
      }
    }, delay);
  }).catch(error => {
    console.error('Promise error:', error);
    throw error;
  });
}
