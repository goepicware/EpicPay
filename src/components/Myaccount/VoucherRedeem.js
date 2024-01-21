/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import cookie from "react-cookies";
import { apiUrl, unquieID } from "../Settings/Config";

import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { IonContent, IonButtons, IonButton,  IonFooter, IonTitle, IonToolbar } from '@ionic/react';
import "@ionic/react/css/core.css";
import reloadQr from "../../common/images/reload_qr.png";

var qs = require('qs');
var downloadTimer = '';

class VoucherRedeem extends Component {
  constructor(props) {
    super(props);
    var customerId = cookie.load("UserId");
    var voucherId = (localStorage.getItem('voucherId') === null) ? '' : localStorage.getItem('voucherId');
    var voucherType = (localStorage.getItem('voucherType') === null) ? '' : localStorage.getItem('voucherType');
    var isFreeVoucherTxt = (localStorage.getItem('isFreeVoucher') === null) ? '' : localStorage.getItem('isFreeVoucher');
    var freeProductIdTxt = (localStorage.getItem('freeProductId') === null) ? '' : localStorage.getItem('freeProductId');
    var isFreeVoucher = 'No';
    var freeProductId = '';
    if(isFreeVoucherTxt == 'yes') {
        isFreeVoucher = 'Yes';
        freeProductId = freeProductIdTxt;
    }

    console.log('AAA-voucherId', voucherId);

    this.state = {
      current_page: 'VouchersRedeem',
      qrcodeData: [],
      qrcode_str: '',
      voucher_id: voucherId,
      voucher_type: voucherType,
      is_freevoucher: isFreeVoucher,
      free_productid: freeProductId,
      runingNum: 0,
    };

    if(cookie.load("UserId") === undefined) {
        props.history.push("/");
    }

    if(unquieID == '') {
          props.history.push("/home");
    }

    if(cookie.load("IsVerifiedUser") !== 'Yes') {
        cookie.save("triggerOTP", 'Yes');
        cookie.save("triggerFrom", 'vouchers');
        props.history.push("/");
    }

    if(voucherId !== undefined && voucherId !== '' && voucherType !== undefined && voucherType !== '') {
      console.log('voucherIdSS', voucherId);
      localStorage.removeItem("voucherId");
      localStorage.removeItem("voucherType");
      localStorage.removeItem("isFreeVoucher");
      localStorage.removeItem("freeProductId");
      this.generateCustQrcode(customerId,voucherType,voucherId,isFreeVoucher,freeProductId);
    } else {
      this.props.history.push("/vouchers");
    }

  }

  reloadQrFun(event) {
    event.preventDefault();
    var customerId = cookie.load("UserId");
    let voucherType = this.state.voucher_type;
    let voucherId = this.state.voucher_id;
    let isFreeVoucher = this.state.is_freevoucher;
    let freeProductId = this.state.free_productid;
    this.generateCustQrcode(customerId,voucherType,voucherId,isFreeVoucher,freeProductId);
  }

  componentDidMount() {
    /*var customerId = cookie.load("UserId");
    var voucherId = cookie.load("voucherId");
    var voucherType = cookie.load("voucherType");
    var isFreeVoucher = 'No';
    var freeProductId = '';
    if(cookie.load("isFreeVoucher") == 'yes') {
        isFreeVoucher = 'Yes';
        freeProductId = cookie.load("freeProductId");
    }

    if(voucherId !== undefined && voucherId !== '' && voucherType !== undefined && voucherType !== '') {
      console.log('voucherIdSS', voucherId);
      this.setState({ voucher_id: voucherId, voucher_type: voucherType, is_freevoucher: isFreeVoucher, free_productid: freeProductId },
        function () {
            
          cookie.remove("voucherId", { path: "/" });
          cookie.remove("voucherType", { path: "/" });
          cookie.remove("isFreeVoucher", { path: "/" });
          cookie.remove("freeProductId", { path: "/" });
          this.generateCustQrcode(customerId,voucherType,voucherId,isFreeVoucher,freeProductId);

        }.bind(this)
      );
    } else {
      this.props.history.push("/vouchers");
    }*/

     $("body").addClass("hide-overlay");
  }

  componentWillReceiveProps(PropsDt) {
    
  }
  
  setRuningNum() {
    var rct_this = this;
    var runingNum = this.state.runingNum;
    downloadTimer = setInterval(function(){
      if(runingNum <= 0){
        clearInterval(downloadTimer);
      }
      runingNum = runingNum - 1;
      rct_this.setState({ runingNum: runingNum }, function () {
        if(runingNum <= 0) {
            //rct_this.props.history.push("/vouchers");
        }
      });
    }, 1000);
  }

  generateCustQrcode(customerId,voucherType,voucherId,isFreeVoucher,freeProductId) {
    var postObject = {};
        postObject = {
          'app_id': unquieID,
          "voucher_id": voucherId,
          "qr_type": voucherType,
          "customer_id": customerId,
          "is_free_product": isFreeVoucher,
          "free_productid": freeProductId,
        };
    axios.post(apiUrl + "customer/generateCustQrcode", qs.stringify(postObject)).then(res => {
      if (res.data.status === "ok") {
        let qrData = res.data.common.image_source+'/'+res.data.result_set.cust_qr_image;
        this.setState({ qrcodeData: res.data.result_set, qrcode_str: qrData, runingNum: 12 },
          function () {
            this.setRuningNum();
          }.bind(this)
          );
      }
    });
  }

  goBackFun(event) {
    event.preventDefault();
    clearInterval(downloadTimer);
    this.props.history.push("/vouchers");
  }

  render() {
    let qrcode_str = this.state.qrcode_str;
    var runingNum = this.state.runingNum;
    if(qrcode_str != '') {
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
              {(runingNum > 0)?<img src={qrcode_str} />:<img src={reloadQr} />}
              </div>
              {(runingNum > 0) && <div className="vod-footer">
                <span>QR Code expire in</span>
                <h2>{this.state.runingNum}</h2>
                <p>Seconds</p>
              </div>}
              <br></br>
            </div>
          </div>
        </div>

        <IonFooter collapse="fade">
          <div className="sticky-single-btn">
          {(runingNum > 0)?<a href="#" className="button btn-dark" onClick={this.goBackFun.bind(this)}>
              Cancel
            </a>:<a href="#" className="button btn-dark" onClick={this.reloadQrFun.bind(this)}>
              Reload
            </a>}
          </div>
        </IonFooter>
      </div>
    );
   }
  }
}

export default (VoucherRedeem);
