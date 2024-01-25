/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import cookie from "react-cookies";
import {
  IonContent,
  IonButtons,
  IonButton,
  IonFooter,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "@ionic/react/css/core.css";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

import {
  GET_CUSTOMER_DETAILS,
  GET_REWARDSETTING_LIST,
  GET_PROMOTION_LIST,
} from "../../actions";
import { apiUrl, unquieID } from "../Settings/Config";

import user from "../../common/images/user.svg";
import nav from "../../common/images/navigation.svg";

import ot from "../../common/images/outlet-place.png";
import coin from "../../common/images/coin.svg";
import back from "../../common/images/back-arrow.svg";
import chati from "../../common/images/chat.svg";
import infoi from "../../common/images/info.svg";

class Rewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "Rewards",
      customerData: [],
      rewardsettingsdata: [],
      available_promo_count: 0,
      promotionlist: [],
    };

    if (cookie.load("UserId") === undefined) {
      props.history.push("/");
    }

    if (unquieID == "") {
      props.history.push("/home");
    }

    var customerId = cookie.load("UserId");
    this.props.getCustomerDetails(
      "&customer_id=" + customerId + "&common_setting=yes"
    );
    this.props.getRewardSettingList("&customer_id=" + customerId);
    this.props.getPromotionList("&customer_id=" + cookie.load("UserId"));
  }
  componentDidMount() {
    //$("body").addClass("hide-overlay");
  }

  componentWillReceiveProps(PropsDt) {
    if (this.state.customerData !== PropsDt.customerdetails) {
      this.setState({ customerData: PropsDt.customerdetails });
    }
    if (this.state.rewardsettingsdata !== PropsDt.rewardsettingslist) {
      this.setState({ rewardsettingsdata: PropsDt.rewardsettingslist });
    }
    if (this.state.promotionlist !== PropsDt.promotionlist) {
      let availablePromoCount = 0;
      if (
        PropsDt.promotionlist != "" &&
        PropsDt.promotionlist != undefined &&
        Object.keys(PropsDt.promotionlist).length > 0
      ) {
        availablePromoCount = Object.keys(
          PropsDt.promotionlist.my_promo
        ).length;
      }
      this.setState({
        promotionlist: PropsDt.promotionlist,
        available_promo_count: availablePromoCount,
      });
    }
  }

  rewardActLst(rewardsettingsData, membership_spent_amount) {
    const rewardsettingsHtml = rewardsettingsData.map(
      (rewardsettings, rwInt) => {
        //let msnCls = 'active';
        let msnCls =
          parseFloat(membership_spent_amount) >=
          parseFloat(rewardsettings.reward_pointstoreach)
            ? "active"
            : "";
        return (
          <li className={msnCls}>{rewardsettings.reward_pointstoreach}</li>
        );
      }
    );

    return (
      <ul>
        <li className="active">0</li>
        {rewardsettingsHtml}
      </ul>
    );
  }

  rewardProLst(rewardsettingsData) {
    const rewardsettingsHtml = rewardsettingsData.map(
      (rewardsettings, rwInt) => {
        let msnCls = rewardsettings.is_earned == "Yes" ? "active" : "";
        let proImg =
          rewardsettings.reward_freeproduct_image != "" ? (
            <img src={rewardsettings.reward_freeproduct_image} alt="Coin" />
          ) : (
            ""
          );
        return (
          <li className={msnCls}>
            <figure>{proImg}</figure>
            <div className="reward-reach">
              <em>{rewardsettings.reward_freeproduct_name}</em>
              <span>
                {rewardsettings.reward_pointstoreach}{" "}
                <img src={coin} alt="Coin" />
              </span>
            </div>
          </li>
        );
      }
    );

    return <ul>{rewardsettingsHtml}</ul>;
  }

  rewardsSettingList(customerData, rewardsettingsData) {
    /*let membership_spent_amount = (customerData.membership_spent_amount != '' && customerData.membership_spent_amount != null)?parseInt(
      customerData.membership_spent_amount
    ):0;*/
    let membership_spent_amount =
      customerData.custmap_earned_points != "" &&
      customerData.custmap_earned_points != null
        ? parseFloat(customerData.custmap_earned_points)
        : 0;
    let calcMemberPerc = 0;
    if (Object.keys(rewardsettingsData).length > 0) {
      let indxVal = Object.keys(rewardsettingsData).length - 1;
      let membership_max_amount = parseInt(
        rewardsettingsData[indxVal].reward_pointstoreach
      );

      if (membership_max_amount) {
        if (
          parseFloat(membership_spent_amount) >
          parseFloat(membership_max_amount)
        ) {
          calcMemberPerc = 100;
        } else {
          calcMemberPerc =
            (membership_spent_amount / membership_max_amount) * 100;
        }
      }
    }

    calcMemberPerc = calcMemberPerc;
    return (
      <>
        <div className="overview-merge">
          <div className="overview">
            <h5>OVERVIEW</h5>
            <h2>
              {membership_spent_amount} <img src={coin} alt="Coin" />
            </h2>
            <div className="ovr-view-inner">
              <div className="slide-frame">
                <div
                  className="inner-frame-bg"
                  style={{ width: calcMemberPerc + "%" }}
                ></div>
              </div>
              <div className="slide-frame1 active"></div>
              <div
                className={
                  parseFloat(calcMemberPerc) == 100
                    ? "slide-frame2 active"
                    : "slide-frame2"
                }
              ></div>
              {this.rewardActLst(rewardsettingsData, membership_spent_amount)}
            </div>
          </div>
          <div className="rewards-uget">
            <h2>Rewards You Get</h2>
            {this.rewardProLst(rewardsettingsData)}
          </div>
        </div>
      </>
    );
  }

  showVoucher(tabTxt, event) {
    event.preventDefault();
    cookie.save("vouchers_show", tabTxt, { path: "/" });
    cookie.save("vouchers_from", "rewards", { path: "/" });
    this.props.history.push("/vouchers");
  }

  render() {
    let customerData = this.state.customerData;
    let rewardsettingsData = this.state.rewardsettingsdata;
    if (Object.keys(customerData).length > 0) {
      let availablePoints =
        customerData.custmap_available_points != "" &&
        customerData.custmap_available_points != null &&
        customerData.custmap_available_points != undefined
          ? customerData.custmap_available_points
          : 0;
      let remnPoints = 0;
      let enableMembership = "No";
      let calcMemberPerc = 0;
      let membership_max_amount = 0;
      let membership_spent_amount = 0;
      let commonSetting =
        customerData.common_setting != undefined &&
        customerData.common_setting != "" &&
        customerData.common_setting != null
          ? customerData.common_setting
          : Array();
      if (
        Object.keys(commonSetting).length > 0 &&
        commonSetting.enable_membership == "true" &&
        customerData.customer_membership_displayname != undefined &&
        customerData.customer_membership_displayname != "" &&
        customerData.customer_membership_displayname != null
      ) {
        enableMembership = "Yes";
        membership_max_amount =
          customerData.membership_max_amount != "" &&
          customerData.membership_max_amount != null
            ? customerData.membership_max_amount
            : 0;
        membership_spent_amount =
          customerData.membership_spent_amount != "" &&
          customerData.membership_spent_amount != null
            ? customerData.membership_spent_amount
            : 0;
        if (parseInt(membership_max_amount)) {
          calcMemberPerc =
            (membership_spent_amount / parseInt(membership_max_amount)) * 100;
          calcMemberPerc =
            parseFloat(calcMemberPerc) > 100 ? 100 : calcMemberPerc;
        }
        remnPoints = membership_max_amount - membership_spent_amount;
      }

      return (
        <div className="main-div">
          <Header mainpagestate={this.state} prntPagePrps={this.props} />

          <div className="rel">
            <div className="container">
              <div className="overview-merge">
                <div className="overview">
                  <h5>Available Points</h5>
                  <h2>
                    {availablePoints} <img src={coin} alt="Coin" />
                  </h2>
                </div>
              </div>
            </div>
            {enableMembership == "Yes" && (
              <div className="container">
                <div className="bluebar">
                  <div className="member-status">
                    <span>Membership Status</span>
                    <h1>{customerData.customer_membership_displayname}</h1>
                  </div>
                  <div className="member-reach">
                    <div className="member-reach-points">
                      <span>{membership_spent_amount}</span>
                      <p>
                        <em>{customerData.membership_next_level}</em>
                        <strong>{parseFloat(membership_max_amount)}</strong>
                      </p>
                    </div>
                    <div className="member-reach-points-slide">
                      <div class="wallet-btm-full">
                        <div
                          className="wallet-progress"
                          style={{ width: calcMemberPerc + "%" }}
                        ></div>
                      </div>
                      <img src={coin} className="points-coin" />
                    </div>
                    <div className="member-reach-points-info">
                      Earn <strong>{remnPoints}</strong>{" "}
                      <img src={coin} alt="Coin" /> to become a{" "}
                      {customerData.membership_next_level} Member
                    </div>
                  </div>
                  <div className="member-tier-btn">
                    <Link
                      to={"/memberinfo"}
                      title="View Tier Details"
                      className="button btn-dark"
                    >
                      View Tier Details
                    </Link>
                  </div>
                </div>
              </div>
            )}
            <div className="container">
              {Object.keys(rewardsettingsData).length > 0 &&
                this.rewardsSettingList(customerData, rewardsettingsData)}
              <div className="links-column">
                <ul>
                  <li>
                    <Link to={"/history"} title="View History">
                      <img src={chati} alt="Coin" /> View History{" "}
                    </Link>{" "}
                  </li>
                  <li>
                    <Link to={"/terms-conditions"} title="Terms & Conditions">
                      <img src={infoi} alt="Coin" /> View Terms & Conditions{" "}
                    </Link>{" "}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <IonFooter collapse="fade">
            <div href="#" className="sticky-two-btn">
              <a
                href="#"
                className="button"
                onClick={this.showVoucher.bind(this, "all")}
              >
                All Rewards
              </a>
              <a
                href="#"
                className="button btn-dark"
                onClick={this.showVoucher.bind(this, "available")}
              >
                Available ({this.state.available_promo_count})
              </a>
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
  var rewardsettingsArr = Array();
  if (Object.keys(state.rewardsettingslist).length > 0) {
    if (state.rewardsettingslist[0].status === "ok") {
      rewardsettingsArr = state.rewardsettingslist[0].result;
    }
  }
  var promotionlistArr = Array();
  if (Object.keys(state.promotionlist).length > 0) {
    if (state.promotionlist[0].status === "ok") {
      promotionlistArr = state.promotionlist[0].result_set;
    }
  }

  return {
    customerdetails: customerdetailsArr,
    rewardsettingslist: rewardsettingsArr,
    promotionlist: promotionlistArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomerDetails: (params) => {
      dispatch({ type: GET_CUSTOMER_DETAILS, params });
    },
    getRewardSettingList: (params) => {
      dispatch({ type: GET_REWARDSETTING_LIST, params });
    },
    getPromotionList: (params) => {
      dispatch({ type: GET_PROMOTION_LIST, params });
    },
  };
};
export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(withRouter(Rewards));
