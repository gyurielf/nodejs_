import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_kV9JiR28aXBhRtRXoCx7ECNs00vobxU8iq');

export const bookTour = async (tourId) => {
  console.log(tourId);
  // 1) get the session from the server
  try {
    const result = await axios({
      method: 'GET',
      url: `http://localhost:8000/api/v1/booking/checkout-session/${tourId}`
    });
    // Even simple way
    // const result = await axios(`http://localhost:8000/api/v1/booking/checkout-session/${tourId}`);

    if (result.data.status === 'success') {
      showAlert('success', 'Order test started!');
      // window.setTimeout(() => {
      //   location.reload();
      // }, 1500);      
    }
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: result.data.session.id
    });
    
  } catch (err) {
    console.log('Error...');
    showAlert('error', err.response.data.message);
    // console.log(err.result.data.message);
  }

  // 3)
};
