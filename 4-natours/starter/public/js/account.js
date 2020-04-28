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
            location.reload(true);
          }, 1500);
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
        console.log(err.result.data.message);
      }
}

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
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err.result.data.message);
  }
};
