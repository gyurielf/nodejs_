/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { currentUserPasswordChange, currentUserUpdate } from './account';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.getElementById('loginForm');
const logoutButton = document.querySelector('.nav__el--logout');
const passwordSaveButton = document.getElementById('passwordSaveBtn');
const updateSaveButton = document.getElementById('updateSaveBtn');

// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    e.preventDefault();
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
  updateSaveButton.addEventListener('click', (e) => {
    const userName = document.getElementById('name').value;
    const userEmail = document.getElementById('email').value;
    e.preventDefault();
    currentUserUpdate(userName, userEmail);
  });
}

if (passwordSaveButton) {
  passwordSaveButton.addEventListener('click', (e) => {
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    e.preventDefault();
    currentUserPasswordChange(currentPassword, password, passwordConfirm);
  });
}
