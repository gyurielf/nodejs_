import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(`${process.env.STRIPE_PUBLIC_KEY}`);

export const bookTour = async (tourId) => {
  console.log(tourId);
  // 1) get the session from the server
  try {
    const result = await axios({
      method: 'GET',
      url: `http://localhost:8000/api/v1/booking/checkout-session/${tourId}`
    });
    if (result.data.status === 'success') {
        showAlert('success', 'Order test started!');
        console.log(result.data.session.id);
        // window.setTimeout(() => {
        //   location.reload();
        // }, 1500);
      }
  } catch (err) {
    console.log('Error...');
    showAlert('error', err.response.data.message);
    // console.log(err.result.data.message);
  }

  // 2)

  // 3)

};