/* eslint-disable */
import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { apiUrl, headerconfig, stripeReference } from "../Settings/Config";
import { hideLoaderLst, showAlert } from "../Helpers/SettingHelper";
import cookie from "react-cookies";
import loadingImage from "../../common/images/loading_popup.gif";
var Parser = require("html-react-parser");
class Placeorder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payment_attempt: 0,
      validateimage: loadingImage,
      processingText: "We are processing your order",
    };
  }
  componentDidMount() {
    this.placeOrder();
    setTimeout(
      function () {
        $.magnificPopup.open({
          items: {
            src: ".processing",
          },
          type: "inline",
          showCloseBtn: false,
          midClick: false,
          closeOnBgClick: false,
        });
      }.bind(this),
      300
    );
  }

  placeOrder() {
    var history = this.props.history;
    var urlParams = new URLSearchParams(this.props.location.search);
    if (
      (urlParams.get("redirect_status") == "succeeded" ||
        urlParams.get("redirect_status") == "processing") &&
      urlParams.get("payment_intent") == cookie.load("payment_intent")
    ) {
      var postObject =
        window.sessionStorage.getItem("postObject") +
        "&payment_intent=" +
        cookie.load("payment_intent") +
        "&preference=" +
        stripeReference;
      var payType = cookie.load("payType");

      cookie.remove("payment_intent", { path: "/" });

      if (payType == "Subscription") {
        axios
          .post(
            apiUrl + "subscription/createSubscription",
            postObject,
            headerconfig
          )
          .then((res) => {
            hideLoaderLst("place-order-link", "class");
            if (res.data.status === "ok") {
              setTimeout(function () {
                $.magnificPopup.close();
                showAlert("Success", res.data.message, "success");
                history.push("/myaccount");
              }, 3000);
            } else {
              setTimeout(
                function () {
                  this.setState({
                    processingText: res.data.message,
                  });
                }.bind(this),
                300
              );
              setTimeout(function () {
                $.magnificPopup.close();
                history.push("/myaccount");
              }, 3000);
            }
          });
      } else {
        axios
          .post(apiUrl + "wallettopup/topup", postObject, headerconfig)
          .then((res) => {
            hideLoaderLst("place-order-link", "class");
            if (res.data.status === "ok") {
              localStorage.removeItem("planData");
              setTimeout(function () {
                $.magnificPopup.close();
                history.push("/myaccount");
              }, 3000);
            } else {
              setTimeout(
                function () {
                  this.setState({
                    processingText: res.data.message,
                  });
                }.bind(this),
                300
              );
              setTimeout(function () {
                $.magnificPopup.close();
                history.push("/checkout");
              }, 3000);
            }
          });
      }
    } else if (urlParams.get("status") == "failure") {
      setTimeout(
        function () {
          this.setState({
            processingText:
              "Please check in myaccount, to get <br/>order details.",
          });
        }.bind(this),
        300
      );
      setTimeout(function () {
        $.magnificPopup.close();
        history.push("/checkout");
      }, 3000);
    } else {
      setTimeout(
        function () {
          $.magnificPopup.close();
          showAlert(
            "Alert",
            "Please check in myaccount, to get <br/>order details.",
            "error"
          );
          history.push("/myaccount");
        }.bind(this),
        300
      );
    }
  }

  sateValChange = (field, value) => {};

  render() {
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel">
          <div className="container">
            <div className="bluebar">
              <div className="member-status">
                <h1>Placing Order</h1>
              </div>

              <div
                id="processing-popup"
                className="white-popup mfp-hide popup_sec processing"
              >
                <div className="pouup_in">
                  <h3 className="title1 text-center">
                    {this.state.processingText !== ""
                      ? Parser(this.state.processingText)
                      : ""}
                  </h3>
                  <div className="process_inner">
                    <div className="process_col">
                      <div className="process_left">
                        <img src={this.state.validateimage} />
                      </div>
                      <div className="process_right">
                        <h5>Waiting for Payment Confirmation</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer section */}
              <Footer />
              {/* Donate popup - end */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Placeorder;
