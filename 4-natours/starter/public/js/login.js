/* eslint-disable */
// WORKS - fentch insted axios
/* const login = async (email, password) => {
  const url = 'http://localhost:8000/api/v1/users/login';
  const rawResponse = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  const content = await rawResponse.json();

  console.log(content);
}; */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    if (result.data.status === 'success') {
      const queryString = window.location.search;
      const reqQueryParams = new URLSearchParams(queryString);
      const requestedURL = reqQueryParams.get('requestedUrl');
      if (requestedURL) {
        showAlert('success', 'Logged in successfully!');
        window.setTimeout(() => {
          location.assign(`${requestedURL}`);
        }, 1500);
      } else {
        showAlert('success', 'Logged in successfully!');
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
    }
  } catch (err) {
    console.log('Error...');
    showAlert('error', err.response.data.message);
    // console.log(err.result.data.message);
  }
};

export const logout = async () => {
  try {
    /* const result = await axios({
      method: 'GET',
      url: 'http://localhost:8000/api/v1/users/logout'
    });

    if (result.data.status === 'success') {
      // location.reload(true);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } */
    const url = 'http://localhost:8000/api/v1/users/logout';
    const rawResponse = await fetch(url);
    const response = await rawResponse.json();
    if (response.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Error logging out!');
    console.log(err.result.data.message);
  }
};
