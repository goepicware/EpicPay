/* eslint-disable */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { IonFooter } from "@ionic/react";
import "@ionic/react/css/core.css";
import cookie from "react-cookies";
import {
  GET_CUSTOMER_DETAILS,
  GET_PRODUCT_LIST,
  GET_SETTINGS,
} from "../../actions";
import {
  apiUrl,
  unquieID,
  stripeReference,
  headerconfig,
} from "../Settings/Config";
import { encodeValue, showPriceValue } from "../Helpers/SettingHelper";

import Header from "../Layout/Header";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

import pay from "../../common/images/payment-stripe.svg";
import voucyellow from "../../common/images/voucher-yellow.svg";
var stripePromise = "";

var qs = require("qs");

class SubscriptionCheckout extends Component {
  constructor(props) {
    super(props);
    console.log(this.props, "this.propsthis.props");

    var productID = this.props?.location?.state.productID
      ? this.props.location.state.productID
      : "";
    var subscription_cycle = this.props?.location?.state.subscription_cycle
      ? this.props.location.state.subscription_cycle
      : "";
    var subscribeType = this.props?.location?.state?.subscribeType
      ? this.props.location.state.subscribeType
      : "";

    var path = this.props.match.path;
    this.state = {
      path: path,
      productID: productID,
      productDetails: "",
      settings: "",
      subscription_cycle: subscription_cycle,
      subscribeType: subscribeType,
      current_page: "Checkout",
      customerData: [],
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
      subtotal: 0,
      grandTotal: 0,
      loading: true,
    };

    if (cookie.load("UserId") === undefined) {
      this.props.history.push("/");
    }

    if (subscribeType === "") {
      // this.props.history.push("/subscription/product");
    }
  }

  componentDidMount() {
    $("body").addClass("hide-overlay");

    this.submitRef = React.createRef();
    console.log(cookie.load("IsVerifiedUser"), 'cookie.load("IsVerifiedUser")');
    if (cookie.load("IsVerifiedUser") !== "Yes") {
      cookie.save("triggerOTP", "Yes");
      cookie.save("triggerFrom", "subscription/checkout");
      console.log(this.state, "this.state");
      var details = {
        productID: this.state.productID,
        subscription_cycle: this.state.subscription_cycle,
        subscribeType: this.state.subscribeType,
        triggerFrom: "subscription/checkout",
      };
      this.props.history.push({
        pathname: "/",
        state: details,
      });
    } else {
      var customerId = cookie.load("UserId");
      console.log(customerId, "customerIdcustomerIdcustomerId");
      this.props.getCustomerDetails(
        "&customer_id=" + customerId,
        this.state.productDetails.product_company_unique_id
      );
    }
  }

  componentWillReceiveProps(PropsDt) {
    if (this.state.customerData !== PropsDt.customerdetails) {
      this.setState({ customerData: PropsDt.customerdetails }, function () {
        this.props.getSettings();
        if (this.state.subscribeType === "product") {
          this.props.getProductList(
            "product_type=6&productID=" + this.state.productID
          );
        }
      });
    }
    if (this.state.productDetails !== PropsDt.productDetails) {
      console.log(
        this.state.productDetails,
        PropsDt.productDetails,
        "aaassdasdadas"
      );
      this.setState({ productDetails: PropsDt.productDetails }, function () {
        this.calculatePrice();
      });
    }
    if (this.state.settings !== PropsDt.settings) {
      this.setState({ settings: PropsDt.settings }, function () {
        if (this.state.subscribeType === "store") {
          this.calculatePrice();
        }
      });
    }
  }

  loadPlanData() {
    if (parseFloat(this.state.grandTotal) > 0) {
      var customer_id = cookie.load("UserId");
      var postObject = {
        paid_amount: parseFloat(this.state.grandTotal).toFixed(2),
        app_id: unquieID,
        customer_id: customer_id,
        payment_reference: stripeReference,
      };
      if (this.state.stripe_loaded == 0) {
        this.setState({ stripe_loaded: 1 }, function () {
          axios
            .post(
              apiUrl + "topupplan/stripeClientToken",
              qs.stringify(postObject),
              headerconfig
            )
            .then((statusRes) => {
              this.setState({ loading: false });
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
        });
      } else {
        var postObject = {
          paid_amount: parseFloat(this.state.grandTotal).toFixed(2),
          payment_intent: this.state.payment_intent,
          app_id: unquieID,
          customer_id: customer_id,
          payment_reference: stripeReference,
          stripe_log: this.state.stripe_log,
        };
        axios.post(
          apiUrl + "topupplan/stripeClientTokenUpdateAmount",
          qs.stringify(postObject),
          headerconfig
        );
      }
    }
  }

  calculatePrice() {
    var subtotal = 0;
    var grandTotal = 0;
    if (this.state.subscribeType === "product") {
      if (Object.keys(this.state.productDetails).length > 0) {
        var subscriptionDetail =
          this.state.productDetails.product_subscription !== "" &&
          this.state.productDetails.product_subscription !== null
            ? JSON.parse(this.state.productDetails.product_subscription)
            : [];
      }
    } else if (this.state.subscribeType === "store") {
      var subscriptionDetail =
        this.state.settings.store_subscription !== "" &&
        this.state.settings.store_subscription !== null
          ? JSON.parse(this.state.settings.store_subscription)
          : [];
    }

    var subscribeCycle = this.state.subscription_cycle;
    var allowSubscribe =
      subscriptionDetail[subscribeCycle.toLowerCase()] !== "" &&
      typeof subscriptionDetail[subscribeCycle.toLowerCase()] !== undefined &&
      typeof subscriptionDetail[subscribeCycle.toLowerCase()] !== "undefined"
        ? subscriptionDetail[subscribeCycle.toLowerCase()]
        : "";
    subtotal = allowSubscribe?.amount ? parseFloat(allowSubscribe.amount) : 0.0;
    grandTotal = allowSubscribe?.amount
      ? parseFloat(allowSubscribe.amount)
      : 0.0;
    this.setState({ subtotal: subtotal, grandTotal: grandTotal }, function () {
      this.loadPlanData();
    });
  }

  rvmQtyAction(event) {
    event.preventDefault();
    this.props.history.push("/subscription");
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
    let customer_id = cookie.load("UserId");

    let subtotal_amount = this.state.subtotal;
    let total_amount = this.state.grandTotal;
    let terms_conditions = this.state.terms_conditions;

    let isErrorMsg = "";
    if (customer_id == "") {
      isErrorMsg = "Customer Id was empty";
    } else if (product_primary_id == "") {
      isErrorMsg = "Product ID was empty";
    } else if (subtotal_amount == 0 || subtotal_amount == "") {
      isErrorMsg = "Subtotal amount was empty";
    } else if (total_amount == 0 || total_amount == "") {
      isErrorMsg = "Total amount was empty";
    } else if (terms_conditions == "no") {
      isErrorMsg = "Please accept terms & conditions";
    }

    if (isErrorMsg == "") {
      this.setState({ error_msg: "" });
      var item_sku,
        item_image,
        product_primary_id,
        item_name,
        item_id,
        unique_id,
        item_image = "";
      if (this.state.subscribeType === "product") {
        if (Object.keys(this.state.productDetails).length > 0) {
          var subscriptionDetail =
            this.state.productDetails.product_subscription !== "" &&
            this.state.productDetails.product_subscription !== null
              ? JSON.parse(this.state.productDetails.product_subscription)
              : [];
          let productDetails = this.state.productDetails;
          product_primary_id = productDetails.product_primary_id;
          item_id = productDetails.product_id;
          item_sku = this.state.productDetails.product_sku;
          item_name =
            productDetails.product_alias !== "" &&
            productDetails.product_alias !== null
              ? productDetails.product_alias
              : productDetails.product_name;
          unique_id = productDetails.product_company_unique_id;
          item_image = productDetails.product_thumbnai;
        }
      } else if (this.state.subscribeType === "store") {
        var subscriptionDetail =
          this.state.settings.store_subscription !== "" &&
          this.state.settings.store_subscription !== null
            ? JSON.parse(this.state.settings.store_subscription)
            : [];
        item_name = this.state.settings.company_name + " - Store Subscription";
        unique_id = this.state.settings.company_unquie_id;
      }

      var postObject = {
        UniqueID: unique_id,
        subscribe_type: this.state.subscribeType,
        item_id: item_id,
        item_name: item_name,
        product_primary_id: product_primary_id,
        item_price: this.state.subtotal,
        item_sku: item_sku,
        item_image: item_image,
        item_qty: 1,
        payment_reference: stripeReference,
        subscription_cycle: this.state.subscription_cycle,
        customer_id: customer_id,
        subTotal: this.state.subtotal,
        grandTotal: this.state.grandTotal,
        terms_conditions: terms_conditions,
      };
      cookie.save("payType", "Subscription");
      window.sessionStorage.setItem("postObject", qs.stringify(postObject));
      this.submitRef.current.click();
    } else {
      this.setState({ error_msg: isErrorMsg });
    }
  }

  render() {
    let productDetails = this.state.productDetails;
    if (this.state.loading === false) {
      console.log(
        this.state.customerData.stripe_public_key,
        "this.state.customerData.stripe_public_key"
      );
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

      let planGrandtotal = 0;
      let planGstAmount = 0;
      let planSubtotal = 10;
      return (
        <div className="main-div">
          <Header mainpagestate={this.state} prntPagePrps={this.props} />

          <div className="mbtm-need rel">
            <div className="container">
              <div className="cart-detail">
                <div className="cart-detail-header">
                  <h3>Your cart details</h3>
                  {this.state.subscribeType === "product" && (
                    <a href="#" onClick={this.rvmQtyAction.bind(this)}>
                      Clear cart
                    </a>
                  )}
                </div>
                <div className="cart-detail-body">
                  <div className="cart-detail-voucher">
                    <div className="cart-detail-voucher-img">
                      <figure>
                        <img src={voucyellow} />
                      </figure>{" "}
                      <span>
                        {this.state.subscribeType === "store"
                          ? "Store Subscription"
                          : productDetails.product_alias !== "" &&
                            productDetails.product_alias !== null
                          ? productDetails.product_alias
                          : productDetails.product_name}
                        <br />({this.state.subscription_cycle})
                      </span>
                    </div>
                    <div className="cart-detail-voucher-desc">
                      <div className="cart-price">
                        {this.state.subscribeType === "product"
                          ? showPriceValue(this.state.subtotal)
                          : ""}
                      </div>
                      {this.state.subscribeType === "store" ? (
                        <div className="cart-price">
                          {showPriceValue(this.state.subtotal)}
                        </div>
                      ) : (
                        <div
                          className="cart-action"
                          onClick={this.rvmQtyAction.bind(this)}
                        >
                          <i class="fa fa-trash" aria-hidden="true"></i>
                        </div>
                      )}
                    </div>
                  </div>
                  <ul>
                    <li>
                      <span>Sub Total</span>
                      <strong>
                        <sup>$</sup>
                        {this.state.subtotal.toFixed(2)}
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
                        {this.state.grandTotal.toFixed(2)}
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
      return (
        <div className="container">
          <div id="loading-indicator">
            <div class="lds-hourglass"></div>
          </div>
        </div>
      );
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
  var productDetailsArr = "";
  if (Object.keys(state.productlist).length > 0) {
    if (state.productlist[0].status === "ok") {
      productDetailsArr = state.productlist[0].result_set[0];
    }
  }
  var settingsArr = Array();
  var settingStatus = "";
  if (Object.keys(state.settings).length > 0) {
    settingStatus = state.settings[0].status;
    if (state.settings[0].status === "ok") {
      settingsArr = state.settings[0].result;
    }
  }
  return {
    customerdetails: customerdetailsArr,
    productDetails: productDetailsArr,
    settings: settingsArr,
    settingStatus: settingStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomerDetails: (params, Unquie_ID) => {
      dispatch({ type: GET_CUSTOMER_DETAILS, params, Unquie_ID });
    },
    getProductList: (params) => {
      dispatch({ type: GET_PRODUCT_LIST, params });
    },
    getSettings: () => {
      dispatch({ type: GET_SETTINGS });
    },
  };
};
export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(withRouter(SubscriptionCheckout));
