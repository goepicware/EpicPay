/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import cookie from "react-cookies";
import { apiUrl, baseUrl, unquieID } from "../Settings/Config";
import { showLoaderLst, hideLoaderLst } from "../Helpers/SettingHelper";
import update from "immutability-helper";
import "../../common/css/owl.carousel.css";
import logo from "../../common/images/logo.png";
import user from "../../common/images/user.svg";
import nav from "../../common/images/navigation.svg";
import baner from "../../common/images/bannerd.jpeg";
import cellphone1 from "../../common/images/cellphone1.svg";

var qs = require("qs");

class Home extends Component {
  constructor(props) {
    super(props);

    var refcode =
      localStorage.getItem("refcode") === null
        ? ""
        : localStorage.getItem("refcode");
    var triggerOTP = "No";
    var triggerFrom = "";
    var bottompopup = "regphone";
    var reg_phone_no = "";
    if (cookie.load("triggerOTP") == "Yes") {
      triggerOTP = "Yes";
      triggerFrom = cookie.load("triggerFrom");
      reg_phone_no = cookie.load("UserMobile");
      bottompopup = "regotp";
    }

    this.state = {
      runingNum: 0,
      bottompopup: bottompopup,
      trigger_otp: triggerOTP,
      trigger_from: triggerFrom,
      reg_phone_no: reg_phone_no,
      regphone_error: "",
      regotpdata: {
        reg_otp_dgt1: "",
        reg_otp_dgt2: "",
        reg_otp_dgt3: "",
        reg_otp_dgt4: "",
      },
      regotp_terms: "No",
      regotp_promo: "No",
      regotp_error: "",
      cust_name: "",
      cust_email_id: "",
      birthday_month: "",
      regcust_error: "",
      cust_ref_code: refcode,
    };

    if (
      cookie.load("UserId") !== undefined &&
      cookie.load("UserId") !== "" &&
      cookie.load("triggerOTP") != "Yes"
    ) {
      props.history.push("/myaccount");
    }

    if (cookie.load("triggerOTP") == "Yes") {
      this.triggerOTPFunction();
      cookie.remove("triggerOTP");
      cookie.remove("triggerFrom");
    }

    if (refcode != "") {
      localStorage.removeItem("planData");
    }
  }

  handleFldChange(event) {
    const re = /^[0-9 \b]+$/;
    if (event.target.name === "reg_phone_no") {
      if (event.target.value === "" || re.test(event.target.value)) {
        var mblnumber = this.space(event.target.value);
        var mblnumberLenght = mblnumber.length;
        if (mblnumberLenght <= 9) {
          this.setState({ reg_phone_no: mblnumber });
        }
      }
    } else if (
      event.target.name === "reg_otp_dgt1" ||
      event.target.name === "reg_otp_dgt2" ||
      event.target.name === "reg_otp_dgt3" ||
      event.target.name === "reg_otp_dgt4"
    ) {
      if (event.target.value === "" || re.test(event.target.value)) {
        var mblnumber = this.space(event.target.value);
        var mblnumberLenght = mblnumber.length;
        if (mblnumberLenght <= 1) {
          let field = event.target.name;
          let fieldvalue = event.target.value;
          this.setState(
            update(this.state, {
              regotpdata: { [field]: { $set: fieldvalue } },
            }),
            function () {
              if (field === "reg_otp_dgt1" && mblnumberLenght == 1) {
                $("#reg_otp_dgt2").focus();
              }
              if (field === "reg_otp_dgt2" && mblnumberLenght == 1) {
                $("#reg_otp_dgt3").focus();
              }
              if (field === "reg_otp_dgt3" && mblnumberLenght == 1) {
                $("#reg_otp_dgt4").focus();
              }
            }
          );
        }
      }
    } else if (event.target.name === "cust_name") {
      this.setState({ cust_name: event.target.value });
    } else if (event.target.name === "cust_email_id") {
      this.setState({ cust_email_id: event.target.value });
    } else if (event.target.name === "birthday_month") {
      this.setState({ birthday_month: event.target.value });
    } else if (event.target.name === "cust_ref_code") {
      this.setState({ cust_ref_code: event.target.value });
    }
    this.setState({ regphone_error: "", regotp_error: "", regcust_error: "" });
  }

  space(el) {
    var numbes = el.replace(/ /g, "");
    return numbes.replace(/(\d{4})/g, "$1 ").replace(/(^\s+|\s+$)/, "");
  }

  setRuningNum() {
    var rct_this = this;
    var runingNum = this.state.runingNum;
    var downloadTimer = setInterval(function () {
      if (runingNum <= 0) {
        clearInterval(downloadTimer);
      }
      runingNum = runingNum - 1;
      rct_this.setState({ runingNum: runingNum });
    }, 1000);
  }

  triggerOTPFunction() {
    var regphoneNo = cookie.load("UserMobile");
    regphoneNo = regphoneNo.replace(/ /g, "");
    if (regphoneNo != "") {
      var postObject = {
        app_id: unquieID,
        customer_mobile: regphoneNo,
      };
      showLoaderLst("home-page-maindiv", "class");
      axios
        .post(apiUrl + "customer/send_otponly", qs.stringify(postObject))
        .then((res) => {
          hideLoaderLst("home-page-maindiv", "class");
          if (res.data.status === "ok") {
            this.setState(
              { bottompopup: "regotp", runingNum: 120 },
              function () {
                this.setRuningNum();
              }.bind(this)
            );
          } else {
            this.setState({ regphone_error: res.data.message });
          }
        });
    } else {
      this.setState({ regphone_error: "Phone number required" });
    }
  }

  regSendOtp(typeflg, event) {
    event.preventDefault();
    var regphoneNo = this.state.reg_phone_no;
    regphoneNo = regphoneNo.replace(/ /g, "");
    if (regphoneNo != "") {
      var postObject = {
        app_id: unquieID,
        customer_mobile: regphoneNo,
        otp_type: typeflg,
      };
      let loadrdivcls = typeflg == "login" ? "login-otp-link" : "reg-otp-link";
      showLoaderLst(loadrdivcls, "class");
      axios
        .post(apiUrl + "customer/send_customer_otp", qs.stringify(postObject))
        .then((res) => {
          hideLoaderLst(loadrdivcls, "class");
          if (res.data.status === "ok") {
            if (
              typeflg == "login" ||
              (typeflg == "register" && res.data.is_existing_user == "yes")
            ) {
              let custArr = res.data.result;
              cookie.save("UserId", custArr.customer_id);
              cookie.save("UserEmail", custArr.customer_email);
              cookie.save(
                "UserFname",
                custArr.customer_first_name !== ""
                  ? custArr.customer_first_name
                  : ""
              );
              cookie.save(
                "UserLname",
                custArr.customer_last_name !== ""
                  ? custArr.customer_last_name
                  : ""
              );
              cookie.save("UserMobile", regphoneNo);
              cookie.save("IsVerifiedUser", "No");
              localStorage.setItem("token", custArr.token);

              let $_this = this;
              setTimeout(function () {
                location.href = baseUrl + "myaccount";
                //$_this.props.history.push("/myaccount");
              }, 100);
            } else {
              /*var bottompopuptxt = (typeflg == 'login')? 'loginotp' : 'regotp';*/
              this.setState({ bottompopup: "confirm" });
            }
          } else {
            this.setState({ regphone_error: res.data.message });
          }
        });
    } else {
      this.setState({ regphone_error: "Phone number required" });
    }
  }

  confirmPhone(event) {
    event.preventDefault();
    this.setState(
      { bottompopup: "regotp", runingNum: 120 },
      function () {
        this.setRuningNum();
      }.bind(this)
    );
  }

  displayRunNumbar() {
    if (this.state.regotp_error != "") {
      return <p className="error_info">{this.state.regotp_error}</p>;
    } else if (this.state.runingNum > 0) {
      return (
        <p className="runing_num">Resend in {this.state.runingNum} Seconds</p>
      );
    } else {
      return <p className="resend_link">Resend</p>;
    }
  }

  chakRegOtpChkBox(field) {
    var regotp_terms = this.state.regotp_terms;
    var regotp_promo = this.state.regotp_promo;
    if (field == "trams") {
      var chkBox = regotp_terms == "Yes" ? true : false;
      return chkBox;
    } else if (field == "promo") {
      var chkBox = regotp_promo == "Yes" ? true : false;
      return chkBox;
    }
  }

  changeRegOtpChkBox(field) {
    var regotp_terms = this.state.regotp_terms;
    var regotp_promo = this.state.regotp_promo;
    if (field == "trams") {
      var regotpterms = regotp_terms == "Yes" ? "No" : "Yes";
      this.setState({ regotp_terms: regotpterms });
      if (regotp_terms == "yes") {
        this.setState({ regotp_terms: "No" });
      }
    }

    if (field == "promo") {
      var regotpPromo = regotp_promo == "Yes" ? "No" : "Yes";
      this.setState({ regotp_promo: regotpPromo });
      if (regotpPromo == "yes") {
        this.setState({ regotp_terms: "No" });
      }
    }
  }

  cancelAct(event) {
    event.preventDefault();
    var triggerfrom = this.state.trigger_from;
    triggerfrom =
      triggerfrom != "" && triggerfrom != undefined ? triggerfrom : "myaccount";
    if (triggerfrom == "checkout") {
      triggerfrom = "topup";
    }
    this.props.history.push("/" + triggerfrom);
  }

  tgrVerifyOtp(event) {
    event.preventDefault();
    var regphoneNo = this.state.reg_phone_no;
    regphoneNo = regphoneNo.replace(/ /g, "");
    var regotpData = this.state.regotpdata;
    var regotpval =
      regotpData.reg_otp_dgt1 +
      regotpData.reg_otp_dgt2 +
      regotpData.reg_otp_dgt3 +
      regotpData.reg_otp_dgt4;
    regotpval = regotpval.replace(/ /g, "");
    var errorMgs = "";
    if (regotpval.length != 4) {
      errorMgs = "Please enter the OTP";
    }

    if (regphoneNo != "" && errorMgs == "") {
      var postObject = {
        app_id: unquieID,
        customer_mobile: regphoneNo,
        customer_otp_val: regotpval,
        otp_type: "redeempoints",
      };
      showLoaderLst("reg-otp-verify", "class");
      axios
        .post(
          apiUrl + "customer/customer_otp_verification",
          qs.stringify(postObject)
        )
        .then((res) => {
          hideLoaderLst("reg-otp-verify", "class");
          if (res.data.status === "ok") {
            cookie.save("IsVerifiedUser", "Yes");
            var triggerfrom = this.state.trigger_from;
            triggerfrom =
              triggerfrom != "" && triggerfrom != undefined
                ? triggerfrom
                : "myaccount";
            let $_this = this;
            setTimeout(function () {
              $_this.props.history.push("/" + triggerfrom);
            }, 500);
          } else {
            this.setState({ regotp_error: res.data.message });
          }
        });
    } else {
      this.setState({ regotp_error: errorMgs });
    }
  }

  regVerifyOtp(event) {
    event.preventDefault();
    var regphoneNo = this.state.reg_phone_no;
    regphoneNo = regphoneNo.replace(/ /g, "");
    var regotpData = this.state.regotpdata;
    var regotpval =
      regotpData.reg_otp_dgt1 +
      regotpData.reg_otp_dgt2 +
      regotpData.reg_otp_dgt3 +
      regotpData.reg_otp_dgt4;
    regotpval = regotpval.replace(/ /g, "");
    var errorMgs = "";
    if (regotpval.length != 4) {
      errorMgs = "Please enter the OTP";
    } else if (this.state.regotp_terms != "Yes") {
      errorMgs = "Terms & Conditions required";
    } else if (this.state.regotp_promo != "Yes") {
      errorMgs = "Promotions required";
    }

    if (regphoneNo != "" && errorMgs == "") {
      var postObject = {
        app_id: unquieID,
        customer_mobile: regphoneNo,
        customer_otp_val: regotpval,
        otp_type: "register",
      };
      showLoaderLst("reg-otp-verify", "class");
      axios
        .post(
          apiUrl + "customer/customer_otp_verification",
          qs.stringify(postObject)
        )
        .then((res) => {
          hideLoaderLst("reg-otp-verify", "class");
          if (res.data.status === "ok") {
            this.setState({ bottompopup: "regpersonal", runingNum: 0 });
          } else {
            this.setState({ regotp_error: res.data.message });
          }
        });
    } else {
      this.setState({ regotp_error: errorMgs });
    }
  }

  goBackTo(refPage, event) {
    event.preventDefault();
    var regotpdata = {
      reg_otp_dgt1: "",
      reg_otp_dgt2: "",
      reg_otp_dgt3: "",
      reg_otp_dgt4: "",
    };
    this.setState({
      bottompopup: refPage,
      reg_phone_no: "",
      regphone_error: "",
      regotpdata: regotpdata,
      regotp_terms: "No",
      regotp_promo: "No",
      regotp_error: "",
      cust_name: "",
      cust_email_id: "",
      birthday_month: "",
      cust_ref_code: "",
      regcust_error: "",
    });
  }

  custRegistration(event) {
    event.preventDefault();
    var regphoneNo = this.state.reg_phone_no;
    regphoneNo = regphoneNo.replace(/ /g, "");
    var errorMgs = "";
    if (regphoneNo == "") {
      errorMgs = "Mobile No required";
    } else if (this.state.cust_name == "") {
      errorMgs = "Name required";
    } else if (this.state.cust_email_id == "") {
      errorMgs = "Email required";
    } else if (this.state.birthday_month == "") {
      errorMgs = "Birthday month required";
    }

    if (errorMgs == "") {
      var postObject = {
        app_id: unquieID,
        customer_phone: regphoneNo,
        customer_email: this.state.cust_email_id,
        customer_birthmonth: this.state.birthday_month,
        customer_ref_code: this.state.cust_ref_code,
        customer_name: this.state.cust_name,
      };
      showLoaderLst("cust-reg-btn", "class");
      axios
        .post(apiUrl + "customer/registration", qs.stringify(postObject))
        .then((res) => {
          hideLoaderLst("cust-reg-btn", "class");
          if (res.data.status === "ok") {
            //this.setState({ bottompopup: 'regpersonal', runingNum: 0 });

            let custArr = res.data.result_set;
            cookie.save("UserId", custArr.customer_id);
            cookie.save("UserEmail", custArr.customer_email);
            cookie.save(
              "UserFname",
              custArr.customer_first_name !== ""
                ? custArr.customer_first_name
                : ""
            );
            cookie.save(
              "UserLname",
              custArr.customer_last_name !== ""
                ? custArr.customer_last_name
                : ""
            );
            cookie.save("UserMobile", regphoneNo);
            cookie.save("IsVerifiedUser", "Yes");

            let $_this = this;
            setTimeout(function () {
              location.href = baseUrl + "myaccount";
              // $_this.props.history.push("/myaccount");
            }, 100);
          } else {
            this.setState({ regcust_error: res.data.message });
          }
        });
    } else {
      this.setState({ regcust_error: errorMgs });
    }
  }

  loginVerifyOtp(event) {
    event.preventDefault();
    var regphoneNo = this.state.reg_phone_no;
    regphoneNo = regphoneNo.replace(/ /g, "");
    var regotpData = this.state.regotpdata;
    var regotpval =
      regotpData.reg_otp_dgt1 +
      regotpData.reg_otp_dgt2 +
      regotpData.reg_otp_dgt3 +
      regotpData.reg_otp_dgt4;
    regotpval = regotpval.replace(/ /g, "");
    var errorMgs = "";
    if (regotpval.length != 4) {
      errorMgs = "Please enter the OTP";
    }

    if (regphoneNo != "" && errorMgs == "") {
      var postObject = {
        app_id: unquieID,
        customer_mobile: regphoneNo,
        customer_otp_val: regotpval,
        otp_type: "login",
      };
      axios
        .post(
          apiUrl + "customer/customer_otp_verification",
          qs.stringify(postObject)
        )
        .then((res) => {
          if (res.data.status === "ok") {
            this.setState({ runingNum: 0 });
            this.props.history.push("myaccount");
          } else {
            this.setState({ regotp_error: res.data.message });
          }
        });
    } else {
      this.setState({ regotp_error: errorMgs });
    }
  }

  render() {
    return (
      <div className="main-div home-page-maindiv">
        <div className="header-action">
          <div className="container">
            <div className="ha-lhs">
              <a href={void 0}>
                <img src={logo} />
              </a>
            </div>
            <div className="ha-rhs">
              <ul>
                <li className="profile-user">
                  <a href={void 0}>
                    <img src={user} />
                  </a>
                </li>
                <li className="navsbar">
                  <a href={void 0}>
                    <img src={nav} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="full-height-load rel">
          <div className="hero-img">
            <img src={baner} className="hero-full" />
          </div>
        </div>

        <BottomSheet open={true}>
          <div className="container">
            {this.state.bottompopup == "regphone" && (
              <div className="welcome-phone">
                <div className="wp-top">
                  <h2>Welcome to Guardados</h2>
                  <p>Enter your phone number to create your account</p>
                </div>
                <div className="input-phone">
                  <div className="prefix-merge">
                    <div className="prefix">+65</div>
                    <div className="nxt-fix">
                      <input
                        type="input"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        name="reg_phone_no"
                        value={this.state.reg_phone_no}
                        placeholder="Phone number"
                        onChange={this.handleFldChange.bind(this)}
                      />
                    </div>
                  </div>
                  {this.state.regphone_error != "" && (
                    <span className="error-info">
                      {this.state.regphone_error}
                    </span>
                  )}
                  <p>
                    We will send you a one-time SMS, Additional carriers charges
                    may apply
                  </p>
                </div>
                <div className="bottom-btn bb-txt textcenter">
                  <a
                    href={void 0}
                    className="button full-btn reg-otp-link"
                    onClick={this.regSendOtp.bind(this, "register")}
                  >
                    Send OTP
                  </a>
                  <p>
                    Do you have an account ?{" "}
                    <a
                      href={void 0}
                      onClick={this.goBackTo.bind(this, "loginfrm")}
                    >
                      Login here
                    </a>
                  </p>
                </div>
              </div>
            )}

            {this.state.bottompopup == "confirm" && (
              <div className="update-personal">
                <div className="up-header confirm-header textcenter">
                  <h2>
                    You have entered<br></br>+65 {this.state.reg_phone_no}
                  </h2>
                  <img src={cellphone1} />
                </div>
                <div className="up-form confirm-phone">
                  <p>
                    A one-time verification code will be sent to this mobile
                    number
                  </p>
                  <p>
                    Press ‘Confirm’ to proceed or ‘Edit’ to amend your details.
                  </p>
                  {this.state.regcust_error != "" && (
                    <p className="error_info">{this.state.regcust_error}</p>
                  )}
                  <div className="up-frm-btn">
                    <a
                      href={void 0}
                      className="button ghost-btn"
                      onClick={this.goBackTo.bind(this, "regphone")}
                    >
                      Edit
                    </a>
                    <a
                      href={void 0}
                      className="button cust-reg-btn"
                      onClick={this.confirmPhone.bind(this)}
                    >
                      Confirm
                    </a>
                  </div>
                </div>
              </div>
            )}

            {this.state.bottompopup == "regotp" && (
              <div className="enter-otp">
                <h2>Enter OTP</h2>
                <div className="four-bx-col">
                  <div className="four-bx">
                    <input
                      type="input"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="reg_otp_dgt1"
                      id="reg_otp_dgt1"
                      value={this.state.regotpdata.reg_otp_dgt1}
                      onChange={this.handleFldChange.bind(this)}
                    />
                    <input
                      type="input"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="reg_otp_dgt2"
                      id="reg_otp_dgt2"
                      value={this.state.regotpdata.reg_otp_dgt2}
                      onChange={this.handleFldChange.bind(this)}
                    />
                    <input
                      type="input"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="reg_otp_dgt3"
                      id="reg_otp_dgt3"
                      value={this.state.regotpdata.reg_otp_dgt3}
                      onChange={this.handleFldChange.bind(this)}
                    />
                    <input
                      type="input"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="reg_otp_dgt4"
                      id="reg_otp_dgt4"
                      value={this.state.regotpdata.reg_otp_dgt4}
                      onChange={this.handleFldChange.bind(this)}
                    />
                  </div>
                  {this.displayRunNumbar()}
                </div>
                {this.state.trigger_otp != "Yes" && (
                  <div className="otp-checkbox">
                    <ul>
                      <li>
                        <input
                          type="checkbox"
                          name="regotp_terms"
                          onChange={this.changeRegOtpChkBox.bind(this, "trams")}
                          checked={this.chakRegOtpChkBox("trams")}
                        />
                        <p>
                          I confirm I have read and accept the{" "}
                          <a href={void 0}>Terms & Conditions</a>,{" "}
                          <a href={void 0}>Privacy Policy</a> and the{" "}
                          <a href={void 0}>PDPA consent</a>.
                        </p>
                      </li>
                      <li>
                        <input
                          type="checkbox"
                          name="regotp_promo"
                          onChange={this.changeRegOtpChkBox.bind(this, "promo")}
                          checked={this.chakRegOtpChkBox("promo")}
                        />
                        <p>
                          I'd like to receive news, updates and promotions from
                          Buzzr via email and sms
                        </p>
                      </li>
                    </ul>
                  </div>
                )}
                {this.state.trigger_otp === "Yes" ? (
                  <div className="up-frm-btn">
                    <a
                      href={void 0}
                      className="button ghost-btn"
                      onClick={this.cancelAct.bind(this)}
                    >
                      Cancel
                    </a>
                    <a
                      href={void 0}
                      className="button cust-reg-btn"
                      onClick={this.tgrVerifyOtp.bind(this)}
                    >
                      Continue
                    </a>
                  </div>
                ) : (
                  <div className="bottom-btn textcenter">
                    <a
                      href={void 0}
                      className="button full-btn reg-otp-verify"
                      onClick={this.regVerifyOtp.bind(this)}
                    >
                      Continue
                    </a>
                  </div>
                )}
              </div>
            )}

            {this.state.bottompopup == "regpersonal" && (
              <div className="update-personal">
                <div className="up-header textcenter">
                  <p>Update your personal details</p>
                </div>
                <div className="up-form">
                  <input
                    type="text"
                    placeholder="Name"
                    name="cust_name"
                    value={this.state.cust_name}
                    onChange={this.handleFldChange.bind(this)}
                  />
                  <input
                    type="text"
                    placeholder="Email Address"
                    name="cust_email_id"
                    value={this.state.cust_email_id}
                    onChange={this.handleFldChange.bind(this)}
                  />
                  <select
                    name="birthday_month"
                    value={this.state.birthday_month}
                    className="components_selct components_selctbox_cls"
                    onChange={this.handleFldChange.bind(this)}
                  >
                    <option value="">Birthday Month</option>
                    <option value="january">January</option>
                    <option value="february">February</option>
                    <option value="march">March</option>
                    <option value="april">April</option>
                    <option value="may">May</option>
                    <option value="june">June</option>
                    <option value="july">July</option>
                    <option value="august">August</option>
                    <option value="september">September</option>
                    <option value="october">October</option>
                    <option value="november">November</option>
                    <option value="december">December</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Referal Code"
                    name="cust_ref_code"
                    value={this.state.cust_ref_code}
                    onChange={this.handleFldChange.bind(this)}
                  />
                  {this.state.regcust_error != "" && (
                    <p className="error_info">{this.state.regcust_error}</p>
                  )}
                  <div className="up-frm-btn">
                    <a
                      href={void 0}
                      className="button ghost-btn"
                      onClick={this.goBackTo.bind(this, "regphone")}
                    >
                      Cancel
                    </a>
                    <a
                      href={void 0}
                      className="button cust-reg-btn"
                      onClick={this.custRegistration.bind(this)}
                    >
                      Register
                    </a>
                  </div>
                </div>
              </div>
            )}

            {this.state.bottompopup == "loginfrm" && (
              <div className="welcome-phone login-frm">
                <div className="wp-top">
                  <h2>Login to Guardados</h2>
                  <p>Enter your phone number to and login to your account</p>
                </div>
                <div className="input-phone">
                  <div className="prefix-merge">
                    <div className="prefix">+65</div>
                    <div className="nxt-fix">
                      <input
                        type="input"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        name="reg_phone_no"
                        value={this.state.reg_phone_no}
                        placeholder="Phone number"
                        onChange={this.handleFldChange.bind(this)}
                      />
                    </div>
                  </div>
                  {this.state.regphone_error != "" && (
                    <span className="error-info">
                      {this.state.regphone_error}
                    </span>
                  )}
                  <p>
                    We will send you a one-time SMS, Additional carriers charges
                    may apply
                  </p>
                </div>
                <div className="bottom-btn bb-txt textcenter">
                  <a
                    href={void 0}
                    className="button full-btn login-otp-link"
                    onClick={this.regSendOtp.bind(this, "login")}
                  >
                    Login
                  </a>
                  <p>
                    Do not have an account ?{" "}
                    <a
                      href={void 0}
                      onClick={this.goBackTo.bind(this, "regphone")}
                    >
                      Register here
                    </a>
                  </p>
                </div>
              </div>
            )}

            {this.state.bottompopup == "loginotp" && (
              <div className="enter-otp enter-otp-login">
                <h2>Enter OTP</h2>
                <div className="four-bx-col">
                  <div className="four-bx">
                    <input
                      type="input"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="reg_otp_dgt1"
                      id="reg_otp_dgt1"
                      value={this.state.regotpdata.reg_otp_dgt1}
                      onChange={this.handleFldChange.bind(this)}
                    />
                    <input
                      type="input"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="reg_otp_dgt2"
                      id="reg_otp_dgt2"
                      value={this.state.regotpdata.reg_otp_dgt2}
                      onChange={this.handleFldChange.bind(this)}
                    />
                    <input
                      type="input"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="reg_otp_dgt3"
                      id="reg_otp_dgt3"
                      value={this.state.regotpdata.reg_otp_dgt3}
                      onChange={this.handleFldChange.bind(this)}
                    />
                    <input
                      type="input"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="reg_otp_dgt4"
                      id="reg_otp_dgt4"
                      value={this.state.regotpdata.reg_otp_dgt4}
                      onChange={this.handleFldChange.bind(this)}
                    />
                  </div>
                  {this.displayRunNumbar()}
                </div>
                <div className="bottom-btn">
                  <a
                    href={void 0}
                    className="button full-btn"
                    onClick={this.loginVerifyOtp.bind(this)}
                  >
                    Login
                  </a>
                </div>
              </div>
            )}
          </div>
        </BottomSheet>
      </div>
    );
  }
}

export default Home;
