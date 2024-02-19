/* eslint-disable */
import React, { Component, createRef } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { IonFooter } from "@ionic/react";
import "@ionic/react/css/core.css";
import cookie from "react-cookies";
import { GET_CUSTOMER_DETAILS } from "../../actions";
import {
  apiUrl,
  unquieID,
  stripeReference,
  headerconfig,
} from "../Settings/Config";
import { encodeValue } from "../Helpers/SettingHelper";

import Header from "../Layout/Header";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

import pay from "../../common/images/payment-stripe.svg";
import voucyellow from "../../common/images/voucher-yellow.svg";
import plus from "../../common/images/plus-sign.svg";
import minus from "../../common/images/minus-sign.svg";
var stripePromise = "";

var qs = require("qs");

class Home extends Component {
  constructor(props) {
    super(props);

    var planData =
      localStorage.getItem("planData") === null
        ? ""
        : localStorage.getItem("planData");
    planData = planData !== "" ? JSON.parse(planData) : [];

    this.state = {
      current_page: "Checkout",
      customerData: [],
      plan_data: planData,
      plan_qty: 1,
      plan_subtotal: 0,
      plan_gst: 7,
      plan_gst_amount: 0,
      plan_grandtotal: 0,
      terms_conditions: "no",
      promotions_updates: "no",
      error_msg: "",
      stripe_loaded: 0,
      stripe_log: 0,
    };

    if (cookie.load("UserId") === undefined) {
      props.history.push("/");
    }

    if (Object.keys(planData).length > 0) {
    } else {
      props.history.push("/topup");
    }
    this.submitRef = React.createRef();

    if (cookie.load("IsVerifiedUser") !== "Yes") {
      cookie.save("triggerOTP", "Yes");
      cookie.save("triggerFrom", "checkout");
      props.history.push("/");
    }

    var customerId = cookie.load("UserId");
    this.props.getCustomerDetails("&customer_id=" + customerId);
  }

  loadPlanData() {
    let planData = this.state.plan_data;
    let planQty = this.state.plan_qty;
    let planSubtotal = this.state.plan_subtotal;
    //let planGst = this.state.plan_gst;
    let planGst = this.state.tax_percentage;
    let planGstAmount = this.state.plan_gst_amount;
    let planGrandtotal = this.state.plan_grandtotal;
    if (Object.keys(planData).length > 0) {
      if (parseInt(planQty) > 0) {
        planGst = planData.tax_percentage;
        let topupplanCreditsAmount = planData.topupplan_credits_amount;
        topupplanCreditsAmount =
          topupplanCreditsAmount != "" ? parseFloat(topupplanCreditsAmount) : 0;
        if (topupplanCreditsAmount > 0) {
          planSubtotal = topupplanCreditsAmount * parseInt(planQty);
          planGstAmount = (planGst / 100) * planSubtotal;
          planGrandtotal = planSubtotal + planGstAmount;
          this.setState({
            plan_subtotal: planSubtotal,
            tax_percentage: planGst,
            plan_gst_amount: planGstAmount,
            plan_grandtotal: planGrandtotal,
            error_msg: "",
          });
          var customer_id = cookie.load("UserId");

          var postObject = {
            paid_amount: parseFloat(planGrandtotal).toFixed(2),
            app_id: unquieID,
            customer_id: customer_id,
            payment_reference: stripeReference,
          };

          if (this.state.stripe_loaded == 0) {
            this.setState({ stripe_loaded: 1 });
            axios
              .post(
                apiUrl + "topupplan/stripeClientToken",
                qs.stringify(postObject),
                headerconfig
              )
              .then((statusRes) => {
                if (statusRes.data.status === "ok") {
                  this.setState({
                    stripekey: statusRes.data.result_set,
                    clientSecret: statusRes.data.result_set.client_secret,
                    payment_intent: statusRes.data.result_set.payment_intent,
                    stripe_log: statusRes.data.stripe_log,
                  });
                  cookie.save(
                    "clientSecret",
                    statusRes.data.result_set.client_secret
                  );
                  cookie.save(
                    "payment_intent",
                    statusRes.data.result_set.payment_intent
                  );
                } else {
                }
              });
          } else {
            var postObject = {
              paid_amount: parseFloat(planGrandtotal).toFixed(2),
              payment_intent: this.state.payment_intent,
              app_id: unquieID,
              customer_id: customer_id,
              payment_reference: stripeReference,
              stripe_log: this.state.stripe_log,
            };
            axios
              .post(
                apiUrl + "topupplan/stripeClientTokenUpdateAmount",
                qs.stringify(postObject),
                headerconfig
              )
              .then((statusRes) => {});
          }
        } else {
          this.props.history.push("/topup");
        }
      } else {
        localStorage.removeItem("planData");
        this.props.history.push("/topup");
      }
    } else {
      this.props.history.push("/topup");
    }
  }

  componentDidMount() {
    $("body").addClass("hide-overlay");
    this.loadPlanData();
  }

  componentWillReceiveProps(PropsDt) {
    if (this.state.customerData !== PropsDt.customerdetails) {
      this.setState({ customerData: PropsDt.customerdetails });
    }
  }

  plnQtyAction(actionFlg) {
    let planQty = this.state.plan_qty;
    planQty = parseInt(planQty);
    if (actionFlg === "decr") {
      planQty = planQty > 0 ? planQty - 1 : planQty;
    } else {
      planQty = planQty + 1;
    }
    this.setState({ plan_qty: planQty, error_msg: "" }, function () {
      this.loadPlanData();
    });
  }

  rvmQtyAction(event) {
    event.preventDefault();
    let planQty = 0;
    this.setState({ plan_qty: planQty, error_msg: "" }, function () {
      this.loadPlanData();
    });
  }

  checkboxInfoFld(fieldNm, event) {
    let terms_conditions = this.state.terms_conditions;
    let promotions_updates = this.state.promotions_updates;
    if (fieldNm === "terms") {
      terms_conditions = terms_conditions == "yes" ? "no" : "yes";
      this.setState({ terms_conditions: terms_conditions, error_msg: "" });
    }
    if (fieldNm === "promotions") {
      promotions_updates = promotions_updates == "yes" ? "no" : "yes";
      this.setState({ promotions_updates: promotions_updates, error_msg: "" });
    }
  }

  trigerPlaceOrderValidation(event) {
    event.preventDefault();
    this.placeOrderValidation();
  }

  placeOrderValidation() {
    let plan_data = this.state.plan_data;
    let customer_id = cookie.load("UserId");
    let plan_id = encodeValue(plan_data.topupplan_id);
    let plan_qty = this.state.plan_qty;
    let subtotal_amount = this.state.plan_subtotal;
    let total_amount = this.state.plan_grandtotal;
    let tax_percentage = this.state.tax_percentage;
    let terms_conditions = this.state.terms_conditions;
    let promotions_updates = this.state.promotions_updates;

    let isErrorMsg = "";
    if (customer_id == "") {
      isErrorMsg = "Customer Id was empty";
    } else if (plan_id == "") {
      isErrorMsg = "Plan Id was empty";
    } else if (plan_qty == 0 || plan_qty == "") {
      isErrorMsg = "Plan Quantity was empty";
    } else if (subtotal_amount == 0 || subtotal_amount == "") {
      isErrorMsg = "Subtotal amount was empty";
    } else if (total_amount == 0 || total_amount == "") {
      isErrorMsg = "Total amount was empty";
    } else if (terms_conditions == "no") {
      isErrorMsg = "Please accept terms & conditions";
    }

    if (isErrorMsg == "") {
      this.setState({ error_msg: "" });
      var postObject = {
        app_id: unquieID,
        customer_id: customer_id,
        plan_id: plan_id,
        plan_qty: plan_qty,
        subtotal_amount: subtotal_amount,
        total_amount: total_amount,
        tax_percentage: tax_percentage,
        terms_conditions: terms_conditions,
        promotions_updates: promotions_updates,
      };
      window.sessionStorage.setItem("postObject", qs.stringify(postObject));
      this.submitRef.current.click();
    } else {
      this.setState({ error_msg: isErrorMsg });
    }
  }

  render() {
    stripePromise = loadStripe(this.state.customerData.stripe_public_key);
    var clientSecret = this.state.clientSecret;
    const loader = "auto";
    const appearance = {
      theme: "stripe",
    };
    const options = {
      clientSecret,
      appearance,
      loader,
    };

    let planData = this.state.plan_data;
    let planGrandtotal = this.state.plan_grandtotal;
    let planGstAmount = this.state.plan_gst_amount;
    let planSubtotal = this.state.plan_subtotal;
    if (Object.keys(planData).length > 0) {
      return (
        <div className="main-div">
          <Header mainpagestate={this.state} prntPagePrps={this.props} />

          <div className="mbtm-need rel">
            <div className="container">
              <div className="cart-detail">
                <div className="cart-detail-header">
                  <h3>Your cart details</h3>
                  <a href="#" onClick={this.rvmQtyAction.bind(this)}>
                    Clear cart
                  </a>
                </div>
                <div className="cart-detail-body">
                  <div className="cart-detail-voucher">
                    <div className="cart-detail-voucher-img">
                      <figure>
                        <img src={voucyellow} />
                      </figure>{" "}
                      <span>{planData.topupplan_display_name}</span>
                    </div>
                    <div className="cart-detail-voucher-desc">
                      <div className="qty-bx">
                        <span
                          className="qty-minus"
                          onClick={this.plnQtyAction.bind(this, "decr")}
                        >
                          <img src={minus} />
                        </span>
                        <div className="input-quantity">
                          {this.state.plan_qty}
                        </div>
                        <span
                          className="qty-plus"
                          onClick={this.plnQtyAction.bind(this, "incr")}
                        >
                          <img src={plus} />
                        </span>
                      </div>
                      <div className="cart-price">
                        ${planSubtotal.toFixed(2)}
                      </div>
                      <div
                        className="cart-action"
                        onClick={this.rvmQtyAction.bind(this)}
                      >
                        <i class="fa fa-trash" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>
                  <ul>
                    <li>
                      <span>Sub Total</span>
                      <strong>
                        <sup>$</sup>
                        {planSubtotal.toFixed(2)}
                      </strong>
                    </li>
                    {parseFloat(planGstAmount) > 0 && (
                      <li>
                        <span>GST</span>
                        <strong>
                          <sup>$</sup>
                          {planGstAmount.toFixed(2)}
                        </strong>
                      </li>
                    )}
                    <li className="ts-total">
                      <span>Total</span>
                      <strong>
                        <sup>$</sup>
                        {planGrandtotal.toFixed(2)}
                      </strong>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-detail">
                <div className="cart-detail-header">
                  <h3>Your payment details</h3>
                </div>
                <div className="card-detail-body">
                  {typeof this.state.clientSecret != "undefined" &&
                    this.state.clientSecret != "" && (
                      <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm submitRef={this.submitRef} />
                      </Elements>
                    )}
                </div>
              </div>
              <div className="card-chkinfo">
                <ul>
                  <li>
                    <input
                      type="checkbox"
                      onClick={this.checkboxInfoFld.bind(this, "terms")}
                    />
                    <p>
                      I confirm I have read and accept the{" "}
                      <a href="#">Terms & Conditions</a>,{" "}
                      <a href="#">Privacy Policy</a> and the{" "}
                      <a href="#">PDPA consent</a>.
                    </p>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      onClick={this.checkboxInfoFld.bind(this, "promotions")}
                    />
                    <p>
                      I'd like to receive news, updates and promotions from
                      Buzzr via email and sms
                    </p>
                  </li>
                </ul>
              </div>
              <div className="stripe-info">
                <img src={pay} />
              </div>
            </div>
          </div>

          <IonFooter collapse="fade">
            <div className="sticky-single-btn">
              <a
                href="#"
                className="button green-btn place-order-link"
                onClick={this.trigerPlaceOrderValidation.bind(this)}
              >
                Place Order
              </a>
              <div>
                <span className="error">{this.state.error_msg}</span>
              </div>
            </div>
          </IonFooter>
        </div>
      );
    } else {
    }
  }
}

const mapStateTopProps = (state) => {
  var customerdetailsArr = Array();
  if (Object.keys(state.customerdetails).length > 0) {
    if (state.customerdetails[0].status === "ok") {
      customerdetailsArr = state.customerdetails[0].result_set;
    }
  }
  return {
    customerdetails: customerdetailsArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomerDetails: (params) => {
      dispatch({ type: GET_CUSTOMER_DETAILS, params });
    },
  };
};
export default connect(mapStateTopProps, mapDispatchToProps)(withRouter(Home));
