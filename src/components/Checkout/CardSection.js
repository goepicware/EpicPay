import React from 'react';
import { CardElement} from '@stripe/react-stripe-js';
import './CardSectionStyles.css'
 
const CARD_ELEMENT_OPTIONS = {
    hidePostalCode: true,
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    }, 
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",  
    },
  },
};

function CardSection() {
  return (
    <div>
      <CardElement options={CARD_ELEMENT_OPTIONS} hidePostalCode={true} />
    </div>
  );
};

export default CardSection;
