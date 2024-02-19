/* eslint-disable */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import cookie from "react-cookies";

import Header from "../Layout/Header";
import Footer from "../Layout/Footer";

import {
  GET_CUSTOMER_DETAILS,
  GET_MISSIONS_LIST,
  GET_REWARDSETTING_LIST,
} from "../../actions";
import { unquieID } from "../Settings/Config";
import { ordinalSuffixOf, showPriceValue } from "../Helpers/SettingHelper";
import "../../common/css/owl.carousel.css";

import walletlight from "../../common/images/wallet.svg";
import coin from "../../common/images/coin.svg";
import tick from "../../common/images/tick-red.svg";
import qrCodeDfl from "../../common/images/qr-codeDfl.png";

class Myaccount extends Component {
  constructor(props) {
    super(props);

    let missiontype = "Monthly";
    this.state = {
      current_page: "My Account",
      customerData: [],
      missionList: [],
      mission_type: missiontype,
      rewardsettingsdata: [],
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
    this.props.getMissionsList(
      "mission_type=" + missiontype + "&customer_id=" + customerId
    );
    this.props.getRewardSettingList("&customer_id=" + customerId);
  }

  componentDidMount() {
    $("body").addClass("hide-overlay");
  }

  componentWillReceiveProps(PropsDt) {
    if (this.state.customerData !== PropsDt.customerdetails) {
      this.setState({ customerData: PropsDt.customerdetails });
    }
    if (this.state.missionList !== PropsDt.missionslis) {
      this.setState({ missionList: PropsDt.missionslis });
    }
    if (this.state.rewardsettingsdata !== PropsDt.rewardsettingslist) {
      this.setState({ rewardsettingsdata: PropsDt.rewardsettingslist });
    }
  }

  goToNavPage(pageTxt, event) {
    event.preventDefault();
    this.props.history.push("/" + pageTxt);
  }

  getmissionData(missionList) {
    const missionsRowHtml = missionList.map((missionsRow, rwInt) => {
      let msnCls = missionsRow.is_earned == "Yes" ? "" : "active";
      let noofTrans = parseInt(missionsRow.mission_noof_transaction);
      return (
        <li className={msnCls} key={rwInt}>
          <div className="mission-top">
            <figure>
              <img src={missionsRow.mission_info_icon} />
              <span>
                {rwInt == 0 && <img className="active-img" src={tick} />}{" "}
                {ordinalSuffixOf(noofTrans)} Transaction
              </span>
            </figure>
            {/*<strong>Bonus +{missionsRow.mission_bonus_points} </strong>*/}
            <strong> +{missionsRow.mission_bonus_points} points </strong>
          </div>
          {/*<div className="mission-btm">Validity period : 06-11-2023</div>*/}
          {/*<div className="mission-btm">Validity period : {missionsRow.mission_bonuspoints_validity} days</div>*/}
        </li>
      );
    });

    return <ul>{missionsRowHtml}</ul>;
  }

  getmissionDataOld(missionList) {
    const missionsRowHtml = missionList.map((missionsRow, rwInt) => {
      let msnCls = "active";
      let noofTrans = parseInt(missionsRow.mission_noof_transaction);
      return (
        <li className={msnCls}>
          <figure>
            <img src={missionsRow.mission_info_icon} />
            <span>
              {rwInt == 0 && <img className="active-img" src={tick} />}{" "}
              {ordinalSuffixOf(noofTrans)} Transaction
            </span>
          </figure>
          <strong>Bonus +{missionsRow.mission_bonus_points} points</strong>
        </li>
      );
    });

    return <ul>{missionsRowHtml}</ul>;
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  rewardProLst(membership_spent_amount) {
    if (this.state.rewardsettingsdata.length > 0) {
      const rewardsettingsHtml = this.state.rewardsettingsdata.map(
        (rewardsettings, rwInt) => {
          let msnCls = rewardsettings.is_earned == "Yes" ? "active" : "";
          let proImg =
            rewardsettings.reward_freeproduct_image != "" ? (
              <img src={rewardsettings.reward_freeproduct_image} alt="Coin" />
            ) : (
              ""
            );
          return (
            <li key={rwInt} className={msnCls}>
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

      let calcMemberPerc = 0;
      let indxVal = Object.keys(this.state.rewardsettingsdata).length - 1;
      let membership_max_amount = parseInt(
        this.state.rewardsettingsdata[indxVal].reward_pointstoreach
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

      calcMemberPerc = calcMemberPerc;

      return (
        <>
          <div className="rewards-uget">
            <h2>Rewards You Get</h2>
            <ul>{rewardsettingsHtml}</ul>
          </div>
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
            {this.rewardActLst(membership_spent_amount)}
          </div>
        </>
      );
    }
  }

  rewardActLst(membership_spent_amount) {
    const rewardsettingsHtml = this.state.rewardsettingsdata.map(
      (rewardsettings, rwInt) => {
        let msnCls =
          parseFloat(membership_spent_amount) >=
          parseFloat(rewardsettings.reward_pointstoreach)
            ? "active"
            : "";
        return (
          <li key={rwInt} className={msnCls}>
            {rewardsettings.reward_pointstoreach}
          </li>
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

  render() {
    let customerData = this.state.customerData;
    let missionList = this.state.missionList;
    if (Object.keys(customerData).length > 0) {
      let availablePoints =
        customerData.custmap_available_points != "" &&
        customerData.custmap_available_points != null &&
        customerData.custmap_available_points != undefined
          ? customerData.custmap_available_points
          : 0;
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
      }

      return (
        <div className="main-div">
          <Header mainpagestate={this.state} prntPagePrps={this.props} />
          <div className="rel">
            <div className="container">
              <div className="wallet-top">
                <div className="wallet-lhs">
                  <div className="flex">
                    <img src={walletlight} />
                    <span>Wallet</span>
                  </div>
                  <em>Balance (as of {this.formatAMPM(new Date())})</em>
                  <h1>
                    <sup>$</sup>
                    {customerData.custmap_available_credits + ".00"}
                  </h1>

                  <a
                    href={void 0}
                    className="button"
                    onClick={this.goToNavPage.bind(this, "topup")}
                  >
                    Top Up
                  </a>
                </div>
                <div className="wallet-rhs">
                  <div className="wallet-qrcode">
                    <img
                      src={qrCodeDfl}
                      onClick={this.goToNavPage.bind(this, "redeempts")}
                    />
                  </div>
                  {parseFloat(customerData.totalSaved) > 0 && (
                    <div className="save-amount">
                      You have Saved :{" "}
                      {showPriceValue(parseFloat(customerData.totalSaved))}
                    </div>
                  )}
                </div>
              </div>

              <div className="wallet-btm margin-to-hide">
                <div className="wallet-btm-lhs">
                  <strong>Available Points</strong>
                  <h2>
                    {availablePoints} <img src={coin} />
                  </h2>
                </div>
                <div className="wallet-btm-rhs">
                  <a
                    href={void 0}
                    className="button"
                    onClick={this.goToNavPage.bind(this, "vouchers")}
                  >
                    Rewards
                  </a>
                </div>
              </div>

              <div className="upcoming-trans">
                {this.rewardProLst(membership_spent_amount)}
              </div>
              {Object.keys(missionList).length > 0 && (
                <div className="monthly-rewards">
                  <h2 className="textcenter">
                    {this.state.mission_type} Rewards
                  </h2>
                  {this.getmissionData(missionList)}
                </div>
              )}
            </div>
          </div>

          <Footer />
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
  var missionslistArr = Array();
  if (Object.keys(state.missionslist).length > 0) {
    if (state.missionslist[0].status === "ok") {
      missionslistArr = state.missionslist[0].result;
    }
  }
  var rewardsettingsArr = Array();
  if (Object.keys(state.rewardsettingslist).length > 0) {
    if (state.rewardsettingslist[0].status === "ok") {
      rewardsettingsArr = state.rewardsettingslist[0].result;
    }
  }

  return {
    customerdetails: customerdetailsArr,
    missionslis: missionslistArr,
    rewardsettingslist: rewardsettingsArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomerDetails: (params) => {
      dispatch({ type: GET_CUSTOMER_DETAILS, params });
    },
    getMissionsList: (params) => {
      dispatch({ type: GET_MISSIONS_LIST, params });
    },
    getRewardSettingList: (params) => {
      dispatch({ type: GET_REWARDSETTING_LIST, params });
    },
  };
};
export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(withRouter(Myaccount));
