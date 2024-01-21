/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import cookie from "react-cookies";
import { GET_CUSTOMER_DETAILS, GET_PRODUCT_LIST } from "../../actions";
import { apiUrl, unquieID } from "../Settings/Config";
import { stripslashes } from "../Helpers/SettingHelper";

import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { IonContent, IonButtons, IonButton,  IonFooter, IonTitle, IonToolbar } from '@ionic/react';
import "@ionic/react/css/core.css";
import "../../common/css/owl.carousel.css";
import noImage from "../../common/images/no-image.jpg";
import innerbg from "../../common/images/inner-banner.jpg";
import coin from "../../common/images/coin.svg";
var Parser = require('html-react-parser');

class myVoucherDetail extends Component {
  constructor(props) {
    super(props);
    
    var voucherData = (localStorage.getItem('voucherData') === null) ? '' : localStorage.getItem('voucherData');
        voucherData = (voucherData !== '') ? JSON.parse(voucherData) : [];

    this.state = {
      current_page: 'VouchersDetail',
      customerData: [],
      voucherData: voucherData,
    };

    if(cookie.load("UserId") === undefined) {
        props.history.push("/");
    }

    if(unquieID == '') {
          props.history.push("/home");
    }

    if(Object.keys(voucherData).length > 0) {
    } else {
      props.history.push("/vouchers");
    }

    var customerId = cookie.load("UserId");
    this.props.getCustomerDetails("&customer_id=" + customerId);
  }

  componentDidMount() {
      $("body").addClass("hide-overlay");
  }

  componentWillReceiveProps(PropsDt) {
      if(this.state.customerData !== PropsDt.customerdetails) {
          this.setState({ customerData: PropsDt.customerdetails });
      }
  }

  redeemNow(voucherData, event) {
    event.preventDefault();
    let productId = (Object.keys(voucherData.promo_products).length > 0) ? voucherData.promo_products[0].product_primary_id : '';
    console.log('promotion_id', voucherData.promotion_id)
    /*cookie.save("voucherId", voucherData.promotion_id, { path: "/" });
    cookie.save("freeProductId", productId, { path: "/" });
    cookie.save("voucherType", 'voucher', { path: "/" });
    cookie.save("isFreeVoucher", 'yes', { path: "/" });*/
    localStorage.setItem('voucherId', voucherData.promotion_id);
    localStorage.setItem('freeProductId', productId);
    localStorage.setItem('voucherType', 'voucher');
    localStorage.setItem('isFreeVoucher', 'yes');
    let $_this = this;
    setTimeout(function () {
        $_this.props.history.push("/redeem");
    }, 0);
  }
  
  render() {
    let voucherData = this.state.voucherData;
    let customerData = this.state.customerData;
    if(Object.keys(voucherData).length > 0) {
      let proImg = (voucherData.promotion_image != '') ? voucherData.promotion_image : noImage;
      let proName = (voucherData.promotion_created_from == 'Cron') ? voucherData.promotion_desc : voucherData.promo_code;
      let productPrice = (voucherData.promotion_max_amt != '') ? parseInt(voucherData.promotion_max_amt) : 0;
      let productInfo = (voucherData.promo_desc_showtext !== '') ? Parser(stripslashes(voucherData.promo_desc_showtext)) : '';
      let customerAvailablePoints = 0;
      if((Object.keys(customerData).length > 0) && (customerData.customer_available_points != undefined) && (customerData.customer_available_points != '')) {
          customerAvailablePoints = customerData.customer_available_points;
      }
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="mbtm-need rel mrg-top-cls">
          <div className="banner-bar">
            <img src={proImg} />
          </div>
          <div className="container">
            <div className="voucher-detail">
              <div className="voucher-detail-header">
                <h2>{stripslashes(proName)}</h2>
                <div className="point-coin">
                {(voucherData.promotion_created_from != 'Cron') && <strong>
                    {productPrice} <img src={coin} />
                  </strong>}
                  <span>Valid Till {voucherData.promo_valid_till}</span>
                </div>
              </div>
              <div className="voucher-detail-body">
                {productInfo}
                <br />
              </div>
            </div>
          </div>
        </div>

        <IonFooter collapse="fade">
            <div className="sticky-redeem">
                <div className="sticky-redeem-bg myvchr-redeem">
                  <a href="#" className="button " onClick={this.redeemNow.bind(this, voucherData)}>
                    Redeem Now
                  </a>
                </div>
            </div>
        </IonFooter>
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
export default connect(mapStateTopProps, mapDispatchToProps)(withRouter(myVoucherDetail));
