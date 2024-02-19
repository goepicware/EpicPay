/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import cookie from "react-cookies";
import { apiUrl, unquieID, headerconfig } from "../Settings/Config";
import Header from "../Layout/Header";
import { IonFooter } from "@ionic/react";
import "@ionic/react/css/core.css";
import reloadQr from "../../common/images/reload_qr.png";

var qs = require("qs");
var downloadTimer = "";
class PointsRedeem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "PointsRedeem",
      qrcodeData: [],
      qrcode_str: "",
      qrCode: "",
      runingNum: 0,
      inititalLoad: true,
      UserId: cookie.load("UserId"),
    };

    if (cookie.load("UserId") === undefined) {
      props.history.push("/");
    }

    if (unquieID == "") {
      props.history.push("/home");
    }

    if (cookie.load("IsVerifiedUser") !== "Yes") {
      cookie.save("triggerOTP", "Yes");
      cookie.save("triggerFrom", "myaccount");
      props.history.push("/");
    }

    var customerId = this.state.UserId;
    if (customerId !== undefined && customerId !== "") {
      this.generateCustQrcode(customerId);
    } else {
      this.props.history.push("/vouchers");
    }
  }
  componentDidMount() {
    $("body").addClass("hide-overlay");
  }

  setRuningNum() {
    var rct_this = this;
    var runingNum = this.state.runingNum;
    downloadTimer = setInterval(function () {
      if (runingNum <= 0) {
        clearInterval(downloadTimer);
      }
      runingNum = runingNum - 1;
      rct_this.setState({ runingNum: runingNum }, function () {
        if (runingNum <= 0) {
          //rct_this.props.history.push("/vouchers");
        }
      });
    }, 1000);
  }

  generateCustQrcode(customerId) {
    var postObject = {};
    postObject = {
      app_id: unquieID,
      qr_type: "points",
      customer_id: customerId,
    };
    axios
      .post(
        apiUrl + "customer/generateCustQrcode",
        qs.stringify(postObject),
        headerconfig
      )
      .then((res) => {
        if (res.data.status === "ok") {
          let qrData =
            res.data.common.image_source +
            "/" +
            res.data.result_set.cust_qr_image;
          this.setState(
            {
              qrcodeData: res.data.result_set,
              qrcode_str: qrData,
              qrCode: res.data.result_set.cust_qr_code,
              runingNum: 12,
            },
            function () {
              this.setRuningNum();
              if (this.state.inititalLoad === true) {
                this.setState({ inititalLoad: false }, function () {
                  this.checkingQRstatus();
                });
              }
            }.bind(this)
          );
        }
      });
  }

  goBackFun(event) {
    event.preventDefault();
    clearInterval(downloadTimer);
    this.props.history.push("/myaccount");
  }

  reloadQrFun(event) {
    event.preventDefault();
    var customerId = this.state.UserId;
    this.generateCustQrcode(customerId);
  }
  checkingQRstatus() {
    var postObject = {};
    postObject = {
      app_id: unquieID,
      qrcode: this.state.qrCode,
      customer_id: this.state.UserId,
    };
    axios
      .post(
        apiUrl + "customer/checkRedeemStatus",
        qs.stringify(postObject),
        headerconfig
      )
      .then((res) => {
        var currentThis = this;
        if (res.data.status === "ok") {
          if (this.state.runingNum > 0) {
            setTimeout(function () {
              currentThis.checkingQRstatus();
            }, 3000);
          }
        } else if (res.data.status === "used") {
          Swal.fire({
            title: "Success",
            html: res.data.message,
            icon: "success",
            customClass: {
              confirmButton: "btn btn-primary waves-effect waves-light",
            },
            buttonsStyling: false,
          });
          this.props.history.push("/myaccount");
        } else {
        }
      });
  }

  render() {
    let qrcode_str = this.state.qrcode_str;
    var runingNum = this.state.runingNum;
    if (qrcode_str != "") {
      return (
        <div className="main-div">
          <Header mainpagestate={this.state} prntPagePrps={this.props} />

          <div className="mbtm-need-less rel">
            <div className="container">
              <div className="voucher-redeem-detail textcenter">
                <div className="vod-header">
                  <h2>Redeem Now</h2>
                  <p>Please show this QR code to our cashier</p>
                </div>
                <div className="vod-body">
                  {runingNum > 0 ? (
                    <img src={qrcode_str} />
                  ) : (
                    <img src={reloadQr} onClick={this.reloadQrFun.bind(this)} />
                  )}
                </div>
                {runingNum > 0 && (
                  <div className="vod-footer">
                    <span>QR Code expire in</span>
                    <h2>{this.state.runingNum}</h2>
                    <p>Seconds</p>
                  </div>
                )}
                <br></br>
              </div>
            </div>
          </div>

          <IonFooter collapse="fade">
            <div className="sticky-single-btn">
              {runingNum > 0 ? (
                <a
                  href={void 0}
                  className="button btn-dark"
                  onClick={this.goBackFun.bind(this)}
                >
                  Cancel
                </a>
              ) : (
                <a
                  href={void 0}
                  className="button btn-dark"
                  onClick={this.reloadQrFun.bind(this)}
                >
                  Reload
                </a>
              )}
            </div>
          </IonFooter>
        </div>
      );
    }
  }
}

export default PointsRedeem;
