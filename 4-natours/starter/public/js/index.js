/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './account';
import { passwordReset, forgotPassword } from './password';
import { bookTour } from './stripe';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.getElementById('loginForm');
const logoutButton = document.querySelector('.nav__el--logout');
const passwordSaveButton = document.querySelector('.form-user-settings');
// const updateSaveButton = document.getElementById('updateSaveBtn');
const updateSaveButton = document.querySelector('.form-user-data');

const forgotPasswordForm = document.getElementById('forgotPassword__form');
const passwordResetForm = document.getElementById('passwordResetForm');

const bookingButton = document.getElementById('bookNow');

// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

if (updateSaveButton) {
  updateSaveButton.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;

    updateSettings(form, 'data');
  });
}

if (passwordSaveButton) {
  passwordSaveButton.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('passwordSaveBtn').textContent = 'Updating..';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { currentPassword, password, passwordConfirm },
      'password'
    );

    document.getElementById('passwordSaveBtn').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (passwordResetForm) {
  passwordResetForm.addEventListener('submit', async (el) => {
    el.preventDefault();
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm = document.getElementById('passwordConfirm').value;
    await passwordReset(newPassword, newPasswordConfirm);
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', async (el) => {
    el.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    await forgotPassword(email);
  });
}

if (bookingButton) {
  bookingButton.addEventListener('click', async (el) => {
    el.preventDefault();
    el.target.textContent = 'Processing...'
    // const tourId = e.target.dataset.tourId;
    // Same as with the top one, but if both tourId used, we can go simply use this:
    const { tourId } = el.target.dataset;
    await bookTour(tourId);
  });
}
