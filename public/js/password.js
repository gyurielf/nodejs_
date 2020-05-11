import axios from 'axios';
import { showAlert } from './alerts';

export const forgotPassword = async (email) => {
    // console.log(email);
  try {
    const result = await axios({
      method: 'POST',
      url: `/api/v1/users/forgotPassword`,
      data: {
        email
      }
    });
    if (result.data.status === 'success') {
      showAlert('success', 'We sent the reset link if the email address exist.');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    // console.log('Error...');
    showAlert('error', err.response.data.message);
    console.log(err.response.data.message);
  }
};

export const passwordReset = async (password, passwordConfirm) => {
  try {
    const pageURL = window.location.href;
    const tokeID = pageURL.substr(pageURL.lastIndexOf('/') + 1);
    // console.log(tokeID);
    const result = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${tokeID}`,
      data: {
        password,
        passwordConfirm
      }
    });
    if (result.data.status === 'success') {
      showAlert('success', 'Password reset successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log('Error...');
    showAlert('error', err.response.data.message);
    // console.log(err.result.data.message);
  }
};
