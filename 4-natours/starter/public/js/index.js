/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './account';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.getElementById('loginForm');
const logoutButton = document.querySelector('.nav__el--logout');
const passwordSaveButton = document.querySelector('.form-user-settings');
// const updateSaveButton = document.getElementById('updateSaveBtn');
const updateSaveButton = document.querySelector('.form-user-data');

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
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings({ name, email }, 'data');
  });
}

if (passwordSaveButton) {
  passwordSaveButton.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('passwordSaveBtn').textContent = 'Updating..';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({ currentPassword, password, passwordConfirm }, 'password');

    document.getElementById('passwordSaveBtn').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
