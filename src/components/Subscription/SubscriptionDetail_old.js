/* eslint-disable */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import cookie from "react-cookies";
import { GET_CUSTOMER_DETAILS, GET_PRODUCT_LIST } from "../../actions";
import { unquieID } from "../Settings/Config";
import { stripslashes } from "../Helpers/SettingHelper";

import Header from "../Layout/Header";
import { IonFooter } from "@ionic/react";
import "@ionic/react/css/core.css";
import "../../common/css/owl.carousel.css";
import noImage from "../../common/images/no-image.jpg";
import coin from "../../common/images/coin.svg";
var Parser = require("html-react-parser");

class voucherDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "VouchersDetail",
      customerData: [],
      productList: [],
    };

    if (cookie.load("UserId") === undefined) {
      props.history.push("/");
    }

    if (unquieID == "") {
      props.history.push("/home");
    }

    var customerId = cookie.load("UserId");
    this.props.getCustomerDetails("&customer_id=" + customerId);
    let slugValue =
      typeof props.match.params.slugValue !== "undefined"
        ? props.match.params.slugValue
        : "";
    console.log("slugValue", slugValue);
    if (slugValue != "" && slugValue != undefined) {
      this.props.getProductList("product_type=6&product_slug=" + slugValue);
    } else {
      props.history.push("/");
    }
  }

  componentDidMount() {
    $("body").addClass("hide-overlay");
  }

  componentWillReceiveProps(PropsDt) {
    if (this.state.customerData !== PropsDt.customerdetails) {
      this.setState({ customerData: PropsDt.customerdetails });
    }
    if (this.state.productList !== PropsDt.productlist) {
      this.setState({ productList: PropsDt.productlist });
    }
  }

  redeemNow(voucherId, currentUniqueID, event) {
    event.preventDefault();
    console.log(voucherId, currentUniqueID, "currentUniqueID");
    /*cookie.save("voucherId", voucherId);
    cookie.save("voucherType", 'voucher');*/
    localStorage.setItem("voucherId", voucherId);
    localStorage.setItem("freeProductId", "");
    localStorage.setItem("voucherType", "voucher");
    localStorage.setItem("isFreeVoucher", "no");
    let $_this = this;
    var packagedetails = {
      currentUniqueID: currentUniqueID,
    };
    setTimeout(function () {
      $_this.props.history.push({
        pathname: "/redeem",
        state: packagedetails,
      });
    }, 0);
  }

  render() {
    let productList = this.state.productList;
    let customerData = this.state.customerData;
    if (Object.keys(productList).length > 0) {
      let proImg =
        productList[0].product_thumbnail != ""
          ? productList[0].product_thumbnail
          : noImage;
      let proName =
        productList[0].product_alias != ""
          ? productList[0].product_alias
          : productList[0].product_name;
      let productPrice =
        productList[0].product_price != ""
          ? parseFloat(productList[0].product_price)
          : 0;
      let productInfo =
        productList[0].product_long_description !== ""
          ? Parser(stripslashes(productList[0].product_long_description))
          : "";
      let customerAvailablePoints = 0;
      if (
        Object.keys(customerData).length > 0 &&
        customerData.customer_available_points != undefined &&
        customerData.customer_available_points != ""
      ) {
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
                    <strong>
                      {productPrice} <img src={coin} />
                    </strong>
                    <span>
                      Valid Till {productList[0].product_voucher_expiry_datetxt}
                    </span>
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
              <div className="sticky-redeem-bg">
                <span>
                  <img src={coin} /> Balance :{" "}
                  <strong>{customerAvailablePoints}</strong>
                </span>
                {parseFloat(customerAvailablePoints) < productPrice ? (
                  <a
                    href="javascrip:void(0)"
                    className="button low-balance-cls"
                  >
                    Low Balance
                  </a>
                ) : (
                  <a
                    href={void 0}
                    className="button "
                    onClick={this.redeemNow.bind(
                      this,
                      productList[0].product_primary_id,
                      productList[0].product_company_unique_id
                    )}
                  >
                    Redeem Now
                  </a>
                )}
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
  var productlistArr = Array();
  if (Object.keys(state.productlist).length > 0) {
    if (state.productlist[0].status === "ok") {
      productlistArr = state.productlist[0].result_set;
    }
  }
  return {
    customerdetails: customerdetailsArr,
    productlist: productlistArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomerDetails: (params) => {
      dispatch({ type: GET_CUSTOMER_DETAILS, params });
    },
    getProductList: (params) => {
      dispatch({ type: GET_PRODUCT_LIST, params });
    },
  };
};
export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(withRouter(voucherDetail));
