import axios from 'axios';
import { showAlert } from './alerts';

export const currentUserUpdate = async (name, email) => {
  try {
    const result = await axios({
      method: 'PATCH',
      url: 'http://localhost:8000/api/v1/users/updateMe',
      data: {
        name,
        email
      }
    });
    if (result.data.status === 'success') {
      showAlert('success', 'User data change was successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err.result.data.message);
  }
};
/**
 *
 * @param currentPassword adasdasd
 * @param password
 * @param passwordConfirm
 * @returns {Promise<void>}
 */
export const currentUserPasswordChange = async (
  currentPassword,
  password,
  passwordConfirm
) => {
  try {
    const result = await axios({
      method: 'PATCH',
      url: 'http://localhost:8000/api/v1/users/updateMyPassword',
      data: {
        currentPassword,
        password,
        passwordConfirm
      }
    });
    if (result.data.status === 'success') {
      showAlert('success', 'Password change was successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err.result.data.message);
  }
};

/**
* * Using for update user data or password.
* @param {Object} data The password or data that you want to update.
* @param {String} type Type is either 'password' or 'data'
**/
export const updateSettings = async (data, type) => {
  const url = type === 'password' ? 'http://localhost:8000/api/v1/users/updateMyPassword' : 'http://localhost:8000/api/v1/users/updateMe'
  try {
    const result = await axios({
      method: 'PATCH',
      url,
      data
    });
    if (result.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} change was successfully!`);
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err.result.data.message);
  }
}