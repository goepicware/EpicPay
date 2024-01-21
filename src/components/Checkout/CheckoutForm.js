/* eslint-disable */
import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {useStripe, useElements,LinkAuthenticationElement, PaymentElement,CardElement} from '@stripe/react-stripe-js';
import CardSection from './CardSection';
import {  baseUrl, stripeReference } from "../Settings/Config";
import $ from 'jquery'; 
import Axios from 'axios';
import { ReactSession }  from 'react-client-session';
import { showLoaderLst, hideLoaderLst } from "../Helpers/SettingHelper";

var qs = require('qs');

const CheckoutForm = forwardRef(({ submitRef }, ref) => {
  
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }
  }, [stripe]);

  const handleSubmit = async (event) => {

    event.preventDefault();
    showLoaderLst('place-order-link','class');

    if (!stripe || !elements) {
      return;
    }

    const response = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: baseUrl+"placeorder",
      },
    });

    if (response.error) {
      hideLoaderLst('place-order-link','class');
      setMessage(response.error.message);
    }else{
      setMessage("");
    }
 
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && <div id="payment-message">{message}</div>}
      <LinkAuthenticationElement/>
      <h3></h3>
      <PaymentElement id="payment-element" />
      <button ref={submitRef} disabled={isLoading || !stripe || !elements} className="hidden" id="stipe_submit">
      </button>
    </form>
  );
} );

export default CheckoutForm;
