/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { IonContent, IonButtons, IonButton,  IonFooter, IonTitle, IonToolbar } from '@ionic/react';
import "@ionic/react/css/core.css";
import cookie from "react-cookies";
import { GET_CUSTOMER_DETAILS } from "../../actions";
import { apiUrl, unquieID } from "../Settings/Config";
import { encodeValue, showLoaderLst, hideLoaderLst } from "../Helpers/SettingHelper";

import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

import pay from "../../common/images/payment-stripe.svg";
import voucyellow from "../../common/images/voucher-yellow.svg";
import plus from "../../common/images/plus-sign.svg";
import minus from "../../common/images/minus-sign.svg";

var qs = require("qs");

class Home extends Component {
  constructor(props) {
    super(props);

    var planData = (localStorage.getItem('planData') === null) ? '' : localStorage.getItem('planData');
        planData = (planData !== '') ? JSON.parse(planData) : [];

    this.state = {
      current_page: 'Checkout',
      customerData: [],
      plan_data: planData,
      plan_qty: 1,
      plan_subtotal: 0,
      plan_gst: 7,
      plan_gst_amount: 0,
      plan_grandtotal: 0,
      terms_conditions: 'no',
      promotions_updates: 'no',
      error_msg: '',
    };

    if(cookie.load("UserId") === undefined) {
      props.history.push("/");
    }

    if(Object.keys(planData).length > 0) {
      this.loadPlanData();
    } else {
      props.history.push("/topup");
    }
   
    var customerId = cookie.load("UserId");
    this.props.getCustomerDetails("&customer_id=" + customerId);
  }

  loadPlanData() {
    let planData = this.state.plan_data;
    let planQty = this.state.plan_qty;
    let planSubtotal = this.state.plan_subtotal;
    let planGst = this.state.plan_gst;
    let planGstAmount = this.state.plan_gst_amount;
    let planGrandtotal = this.state.plan_grandtotal;
    if(Object.keys(planData).length > 0) {
      if(parseInt(planQty) > 0) {
        let topupplanCreditsAmount = planData.topupplan_credits_amount;
            topupplanCreditsAmount = (topupplanCreditsAmount != '') ? parseFloat(topupplanCreditsAmount) : 0;
        if(topupplanCreditsAmount > 0) {
            planSubtotal = topupplanCreditsAmount * parseInt(planQty);
            planGstAmount = (planGst / 100) * planSubtotal;
            planGrandtotal = planSubtotal + planGstAmount;
            this.setState({plan_subtotal: planSubtotal, plan_gst_amount: planGstAmount, plan_grandtotal: planGrandtotal, error_msg: ''});
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
    if(this.state.customerData !== PropsDt.customerdetails) {
        this.setState({ customerData: PropsDt.customerdetails });
    }
  }

  plnQtyAction(actionFlg) {
    let planQty = this.state.plan_qty;
        planQty = parseInt(planQty);
    if(actionFlg === "decr") {
        planQty = planQty > 0 ? planQty - 1 : planQty;
    } else {
        planQty = planQty + 1;
    }
    this.setState({ plan_qty: planQty, error_msg: '' },
      function () {
        this.loadPlanData();
      }
    );
  }

  rvmQtyAction(event) {
    event.preventDefault();
    let planQty = 0;
    this.setState({ plan_qty: planQty, error_msg: '' },
      function () {
        this.loadPlanData();
      }
    );
  }

  checkboxInfoFld(fieldNm, event) {
      let terms_conditions = this.state.terms_conditions;
      let promotions_updates = this.state.promotions_updates;
      if(fieldNm === 'terms') {
        terms_conditions = (terms_conditions == 'yes') ? 'no' : 'yes';
        this.setState({terms_conditions: terms_conditions, error_msg: ''});
      }
      if(fieldNm === 'promotions') {
        promotions_updates = (promotions_updates == 'yes') ? 'no' : 'yes';
        this.setState({promotions_updates: promotions_updates, error_msg: ''});
      }
  }

  trigerPlaceOrder(event) {
    event.preventDefault();
    this.placeOrder();
  }

  placeOrder() {
    let plan_data = this.state.plan_data;
    let customer_id = cookie.load("UserId");
    let plan_id = encodeValue(plan_data.topupplan_id);
    let plan_qty = this.state.plan_qty;
    let subtotal_amount = this.state.plan_subtotal;
    let total_amount = this.state.plan_grandtotal;
    let terms_conditions = this.state.terms_conditions;
    let promotions_updates = this.state.promotions_updates;
    
    let isErrorMsg = '';
    if(customer_id == '') {
      isErrorMsg = 'Customer Id was empty';
    } else if(plan_id == '') {
      isErrorMsg = 'Plan Id was empty';
    } else if(plan_qty == 0 || plan_qty == '') {
      isErrorMsg = 'Plan Quantity was empty'; 
    } else if(subtotal_amount == 0 || subtotal_amount == '') {
      isErrorMsg = 'Subtotal amount was empty';    
    } else if(total_amount == 0 || total_amount == '') {
      isErrorMsg = 'Total amount was empty'; 
    } else if(terms_conditions == 'no') {
      isErrorMsg = 'Please accept terms & conditions';        
    }

    if(isErrorMsg == '') {
      this.setState({error_msg: ''});
      var postObject = {
        app_id: unquieID,
        customer_id: customer_id,
        plan_id: plan_id,
        plan_qty: plan_qty,
        subtotal_amount: subtotal_amount,
        total_amount: total_amount,
        terms_conditions: terms_conditions,
        promotions_updates: promotions_updates
      };
      showLoaderLst('place-order-link','class');
      axios.post(apiUrl + "wallettopup/topup", qs.stringify(postObject))
      .then((res) => {
        hideLoaderLst('place-order-link','class');
        if(res.data.status === "ok") {
          localStorage.removeItem("planData");
          this.props.history.push("/myaccount");
        } else {
          this.setState({ error_msg: res.data.message });
        }
      });
    } else {
      this.setState({error_msg: isErrorMsg});
    }

    
  }

  render() {
    let planData = this.state.plan_data;
    let planGrandtotal = this.state.plan_grandtotal;
    let planGstAmount = this.state.plan_gst_amount;
    let planSubtotal = this.state.plan_subtotal;
    if(Object.keys(planData).length > 0) {
      return (
        <div className="main-div">
          <Header mainpagestate={this.state} prntPagePrps={this.props} />
  
          <div className="mbtm-need rel">
            <div className="container">
              <div className="cart-detail">
                <div className="cart-detail-header">
                  <h3>Your cart details</h3>
                  <a href="#" onClick={this.rvmQtyAction.bind(this)}>Clear cart</a>
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
                        <span className="qty-minus" onClick={this.plnQtyAction.bind(this,"decr")}>
                          <img src={minus} />
                        </span>
                        <div className="input-quantity">{this.state.plan_qty}</div>
                        <span className="qty-plus" onClick={this.plnQtyAction.bind(this,"incr")}>
                          <img src={plus} />
                        </span>
                      </div>
                      <div className="cart-price">${planSubtotal.toFixed(2)}</div>
                      <div className="cart-action" onClick={this.rvmQtyAction.bind(this)}>
                        <i class="fa fa-trash" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>
                  <ul>
                    <li>
                      <span>Sub Total</span>
                      <strong>
                        <sup>$</sup>{planSubtotal.toFixed(2)}
                      </strong>
                    </li>
                    <li>
                      <span>GST</span>
                      <strong>
                        <sup>$</sup>{planGstAmount.toFixed(2)}
                      </strong>
                    </li>
                    <li className="ts-total">
                      <span>Total</span>
                      <strong>
                        <sup>$</sup>{planGrandtotal.toFixed(2)}
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
                  <input
                    className="full-txt"
                    type="text"
                    placeholder="Card Number"
                  />
  
                  <div className="card-detail-body-btm">
                    <input type="text" placeholder="MM/YYYY" />
                    <input type="text" placeholder="CVC" />
                  </div>
                </div>
              </div>
              <div className="card-chkinfo">
                <ul>
                  <li>
                    <input type="checkbox" onClick={this.checkboxInfoFld.bind(this,'terms')}/>
                    <p>
                      I confirm I have read and accept the{" "}
                      <a href="#">Terms & Conditions</a>,{" "}
                      <a href="#">Privacy Policy</a> and the{" "}
                      <a href="#">PDPA consent</a>.
                    </p>
                  </li>
                  <li>
                    <input type="checkbox" onClick={this.checkboxInfoFld.bind(this,'promotions')}/>
                    <p>
                      I'd like to receive news, updates and promotions from Buzzr
                      via email and sms
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
              <a href="#" className="button green-btn place-order-link"  onClick={this.trigerPlaceOrder.bind(this)}>
                Place Order
              </a>
              <div><span className="error">{this.state.error_msg}</span></div>
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
