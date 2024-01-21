/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import cookie from "react-cookies";
import { GET_STORE_LIST } from "../../actions";
import { apiUrl, unquieID } from "../Settings/Config";
import update from "immutability-helper";
import "../../common/css/owl.carousel.css";
import logo from "../../common/images/logo.png";
import user from "../../common/images/user.svg";
import nav from "../../common/images/navigation.svg";

import baner from "../../common/images/bannerd.jpeg";

class Myaccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagList: [],
      bannerList: [],
      storeList: [],
      storeDisplay: "",
      runingNum: 0,
      bottompopup: "regphone"
    };

  }
  
  componentDidMount() {
  }
  
  componentWillReceiveProps(PropsDt) {
    if (this.state.storeList !== PropsDt.storeList) {
      this.setState({ storeList: PropsDt.storeList });
    }
  }
  
  render() {
    return (
      <div className="main-div">
        <div className="header-action">
          <div className="container">
            <div className="ha-lhs">
              <a href="#">
                <img src={logo} />
              </a>
            </div>
            <div className="ha-rhs">
              <ul>
                <li className="profile-user">
                  <a href="#">
                    <img src={user} />
                  </a>
                </li>
                <li className="navsbar">
                  <a href="#">
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


            {(this.state.bottompopup == 'loginotp') && <div className="enter-otp enter-otp-login">
              <h2>Enter OTP</h2>
              <div className="four-bx-col">
                <div className="four-bx">
                  <input type="text" name="reg_otp_dgt1" id="reg_otp_dgt1"  />
                  <input type="text" name="reg_otp_dgt2" id="reg_otp_dgt2"  />
                  <input type="text" name="reg_otp_dgt3" id="reg_otp_dgt3"  />
                  <input type="text" name="reg_otp_dgt4" id="reg_otp_dgt4"  />
                </div>
                {this.displayRunNumbar()}
              </div>
              <div className="bottom-btn">
                <a href="#" className="button full-btn" >
                  Login
                </a>
              </div>
            </div>}

          </div>
        </BottomSheet>
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  var storelistArr = Array();
  if (Object.keys(state.storelist).length > 0) {
    if (state.storelist[0].status === "ok") {
      storelistArr = state.storelist[0].result;
    }
  }
  return {
    storeList: storelistArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getStoreList: (params) => {
      dispatch({ type: GET_STORE_LIST, params });
    },
  };
};
export default connect(mapStateTopProps, mapDispatchToProps)(withRouter(Myaccount));
