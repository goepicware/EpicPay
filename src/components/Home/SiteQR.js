/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import cookie from "react-cookies";
import { GET_STORE_LIST } from "../../actions";
import { apiUrl, unquieID, baseUrl } from "../Settings/Config";
import { showLoaderLst, hideLoaderLst } from "../Helpers/SettingHelper";
import update from "immutability-helper";
import "../../common/css/owl.carousel.css";
import logo from "../../common/images/logo.png";
import user from "../../common/images/user.svg";
import nav from "../../common/images/navigation.svg";
import baner from "../../common/images/bannerd.jpeg";
import cellphone1 from "../../common/images/cellphone1.svg";

var qs = require("qs");

class SiteQR extends Component {
  constructor(props) {
    super(props);

    let slugtext = (typeof this.props.match.params.slugtext !== "undefined" ? this.props.match.params.slugtext : "");

    this.state = {
      company_id: slugtext,
      company_data: [],
    };

    if(slugtext == undefined || slugtext == '') {
        props.history.push("/");
    }

    if((cookie.load("UserId") !== undefined && cookie.load("UserId") !== '') && (cookie.load("triggerOTP") != 'Yes')) {
        props.history.push("/myaccount");
    }
  }
  
  componentDidMount() {
    this.getCompanyDetails();
  }
  
  componentWillReceiveProps(PropsDt) {
    
  }
  
  getCompanyDetails() {
    var companyId = this.state.company_id;
    if(companyId != '') {
      var postObject = {
        company_id: companyId
      };
      showLoaderLst('siteqr-page-maindiv','class');
      axios.post(apiUrl + "companycategory/company", qs.stringify(postObject))
      .then((res) => {
        hideLoaderLst('siteqr-page-maindiv','class');
        if(res.data.status === "ok") {
          let companyArr = res.data.result_set;

          localStorage.setItem('company_id', companyArr.company_id);
          localStorage.setItem('company_app_id', companyArr.company_unquie_id);
          localStorage.setItem('company_logo', companyArr.company_logo);

          let $_this = this;
          setTimeout(function () {
              //$_this.props.history.push("/myaccount");
              window.location.href = baseUrl+"myaccount";
          }, 0);
        } else {
          this.props.history.push("/");
        }
        
      });

    } else {
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <div className="main-div home-page-maindiv siteqr-page-maindiv">
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

      </div>
    );
  }
}

export default (SiteQR);
