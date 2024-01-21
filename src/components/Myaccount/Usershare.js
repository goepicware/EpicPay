/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { IonContent, IonButtons, IonButton,  IonFooter, IonTitle, IonToolbar } from '@ionic/react';
import "@ionic/react/css/core.css";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

import cookie from "react-cookies";
import { GET_CUSTOMER_DETAILS, GET_STATICBLOCKS_LIST } from "../../actions";
import { apiUrl, unquieID, baseUrl } from "../Settings/Config";
import { showLoaderLst, hideLoaderLst } from "../Helpers/SettingHelper";

import shbg from "../../common/images/sharebg.svg";
import coinw from "../../common/images/coin.svg";
import bagin from "../../common/images/bag.svg";
import giftbx from "../../common/images/gift-box.svg";
import orderfood from "../../common/images/order-food.svg";

var Parser = require("html-react-parser");
var qs = require("qs");
class Usershare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "Share",
      customerData: [],
      points_settings: [],
      customer_referral_code: '',
      share_flag: 'initial',
      referee_email_id: '',
      staticblocksList: [],
      regcust_sucess: '',
      regcust_error: ''
    };

    if(cookie.load("UserId") === undefined) {
      props.history.push("/");
    }

    if(unquieID == '') {
          props.history.push("/home");
    }

    var customerId = cookie.load("UserId");
    this.props.getCustomerDetails("&customer_id=" + customerId);
    this.props.getStaticblocksList("&customer_id=" + customerId);
  }
  componentDidMount() {
    //$("body").addClass("hide-overlay");
  }

  componentWillReceiveProps(PropsDt) {
    if(this.state.customerData !== PropsDt.customerdetails) {
      let customer_referral_code = '';
      let points_settings = Array();
      if(Object.keys(PropsDt.customerdetails).length > 0) {
        points_settings = (Object.keys(PropsDt.customerdetails.points_settings).length > 0) ? PropsDt.customerdetails.points_settings : Array();
        customer_referral_code = PropsDt.customerdetails.customer_referral_code;
        console.log('customer_referral_code', customer_referral_code);
      }
      this.setState({ customerData: PropsDt.customerdetails, points_settings: points_settings, customer_referral_code: customer_referral_code });
    }
    if(this.state.staticblocksList !== PropsDt.staticblocks) {
        this.setState({ staticblocksList: PropsDt.staticblocks }, function () {
          /*this.setMemberInfo();*/
        });
    }
  }

  setMemberInfo() {
    let staticblocksList = this.state.staticblocksList;
    let bronzememberInfo = '';
    let goldmemberInfo = '';
    let platinummemberInfo = '';
    if(Object.keys(staticblocksList).length > 0) {
      const staticblockHtml = staticblocksList.map((staticblock, rwInt) => {
        if(staticblock.staticblocks_slug == 'bronze-member') {
            bronzememberInfo = staticblock.staticblocks_description;
        }
        if(staticblock.staticblocks_slug == 'gold-member') {
            goldmemberInfo = staticblock.staticblocks_description;
        }
        if(staticblock.staticblocks_slug == 'platinum-member') {
            platinummemberInfo = staticblock.staticblocks_description;
        }
        return(staticblock);
      });
    }

    this.setState({ bronzememberInfo: bronzememberInfo, goldmemberInfo: goldmemberInfo, platinummemberInfo: platinummemberInfo });

  }

  nevMemberFun(tabTxt, event) {
    event.preventDefault();
    this.setState({ activemember: tabTxt });
  }

  userReferal_old(actTxt, event) {
    event.preventDefault();
    if(actTxt == 'initial') {
      this.setState({ share_flag: 'share' });
    } else if(actTxt == 'cancel') {
        this.setState({ share_flag: 'initial', referee_email_id: '', regcust_error: '' });
    } else if(actTxt == 'share') {
      var errorMgs = '';
      let referee_email_id = this.state.referee_email_id;
      if(referee_email_id == '') {
          errorMgs = 'Referee Email required';
      }
      if(errorMgs == '') {
        this.setState({ regcust_error: '' });
        
        var postObject = {
          app_id: unquieID,
          referee_email_id: referee_email_id,
          customer_id: cookie.load("UserId"),
          customer_referral_code: this.state.customer_referral_code
        };
        showLoaderLst('cust-referal-btn','class');
        axios.post(apiUrl + "customer/userreferal", qs.stringify(postObject))
        .then((res) => {
          hideLoaderLst('cust-referal-btn','class');
          if(res.data.status === "ok") {
              this.setState({ regcust_sucess: 'Referal code shared successfully' });
              let $_this = this;
              setTimeout(function () {
                  $_this.props.history.push("/myaccount");
              }, 1000);
            } else {
              this.setState({ regcust_error: res.data.message });
            }
          });
      } else {
        this.setState({ regcust_error: errorMgs });
      }
    }
  }

  userReferal(actTxt, event) {
    event.preventDefault();
    if(actTxt == 'initial') {
      this.setState({ share_flag: 'share' });
    } else if(actTxt == 'cancel') {
        this.setState({ share_flag: 'initial', referee_email_id: '', regcust_error: '' });
    } else if(actTxt == 'share') {
      var errorMgs = '';
      let customer_referral_code = this.state.customer_referral_code;
      if(customer_referral_code == '') {
          errorMgs = 'Customer referral code required';
      }
      if(errorMgs == '') {
        this.setState({ regcust_error: '' });
        
      } else {
        this.setState({ regcust_error: errorMgs });
      }
    }
  }

  handleFldChange(event) {
    this.setState({ regcust_error: '', referee_email_id: event.target.value });
  }

  render() {
    let pointsSettings = this.state.points_settings;
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel">
          <div className="share-bg textcenter">
            <img src={shbg} />
          </div>
          <div className="container">
            {(Object.keys(pointsSettings).length > 0) && <div className="u-willget">
              <h2>You will get</h2>
              <div className="credit-list">
                <ul>
                  <li>
                    <div className="list-parent">
                      <div className="buy-credit-u">
                        <span>
                          When your referrals make <br />
                          their <strong>1st wallet topup</strong>
                        </span>
                      </div>
                      <div className="coin-price">
                        {pointsSettings[0].pntset_first_transaction_bonuspoints} <img src={coinw} />{" "}
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="list-parent">
                      <div className="buy-credit-u">
                        <span>
                          When your <br />
                          <strong>referrals signup</strong>
                        </span>
                      </div>
                      <div className="coin-price">
                        {pointsSettings[0].pntset_referrals_signup_bonuspoints} <img src={coinw} />{" "}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>}
            <div className="double-fun">
              <div className="double-fun-header">
                <h2>Double The Fun</h2>
                <a href="#">Learn more</a>
              </div>
              <ul>
                <li>
                  <figure className="of-icon">
                    <img src={orderfood} />
                  </figure>
                  <span>Refer using your link on your socials.</span>
                </li>
                <li>
                  <figure className="bg-icon">
                    <img src={bagin} />
                  </figure>
                  <span>When your referrals signup, you earn 10 points</span>
                </li>
                <li>
                  <figure className="gb-icon">
                    <img src={giftbx} />
                  </figure>
                  <span>
                    When your referrals make their first transaction, you earn
                    20 points
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {(this.state.customer_referral_code != '') && <IonFooter collapse="fade">
          {(this.state.share_flag == 'share')?<div className="update-personal"> 
              {(this.state.regcust_sucess == '')?<div className="up-form refral-frm">
              {/*<input type="text" placeholder="Referee Email Address" name="referee_email_id" value={this.state.referee_email_id} onChange={this.handleFldChange.bind(this)} />*/}
              <input type="text" placeholder="Referee Url" name="referee_url" value={baseUrl+'refpage/referal/'+this.state.customer_referral_code} />
              {(this.state.regcust_error != '') && <p className="error_info">{this.state.regcust_error}</p>}
              <div className="up-frm-btn">
                  <a href="#" className="button ghost-btn" onClick={this.userReferal.bind(this,'cancel')}>
                    Cancel
                  </a>
                  {/*<a href="#" className="button cust-referal-btn" onClick={this.userReferal.bind(this,'share')}>
                    Share
                  </a>*/}
                  <a href={"whatsapp://send?text="+baseUrl+"refpage/referal/"+this.state.customer_referral_code} className="button cust-referal-btn">
                    Share
                  </a>
              </div>
             </div>:<p className="sucess-msg">{this.state.regcust_sucess}</p>}
          </div>:<div className="sticky-single-btn">
            <a href="#" className="button " onClick={this.userReferal.bind(this,'initial')}>
                Share to the friends
            </a>
          </div>}
        </IonFooter>}

      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  var customerdetailsArr = Array();
  if (Object.keys(state.customerdetails).length > 0) {
    if (state.customerdetails[0].status === "ok") {
      customerdetailsArr = state.customerdetails[0].result_set;
    }
  }
  var staticblocksArr = Array();
  if (Object.keys(state.staticblocks).length > 0) {
    if (state.staticblocks[0].status === "ok") {
      staticblocksArr = state.staticblocks[0].result_set;
    }
  }
  return {
    customerdetails: customerdetailsArr,
    staticblocks: staticblocksArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomerDetails: (params) => {
      dispatch({ type: GET_CUSTOMER_DETAILS, params });
    },
    getStaticblocksList: (params) => {
      dispatch({ type: GET_STATICBLOCKS_LIST, params });
    },
  };
};
export default connect(mapStateTopProps, mapDispatchToProps)(withRouter(Usershare));
