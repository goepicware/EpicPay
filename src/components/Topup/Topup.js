/* eslint-disable */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { IonFooter } from "@ionic/react";
import "@ionic/react/css/core.css";
import cookie from "react-cookies";
import { BulletList } from "react-content-loader";
import { GET_CUSTOMER_DETAILS, GET_TOPUPPLAN_LIST } from "../../actions";
import { unquieID } from "../Settings/Config";
import Header from "../Layout/Header";
import walletlight from "../../common/images/wallet.svg";
import orange from "../../common/images/orange-shape.svg";

class Topup extends Component {
  constructor(props) {
    super(props);
    var planData =
      localStorage.getItem("planData") === null
        ? ""
        : localStorage.getItem("planData");
    planData = planData !== "" ? JSON.parse(planData) : [];

    this.state = {
      current_page: "Buy Credits",
      customerData: [],
      topupplanList: [],
      avbl_credits: 0,
      selectedplan: planData,
      tax_type: "",
      tax_percentage: 0,
      loadding: true,
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
    let outlet_id = "";
    this.props.getTopupPlanList("&outlet_id=" + outlet_id);
  }

  componentDidMount() {}

  componentWillReceiveProps(PropsDt) {
    if (this.state.topupplanList !== PropsDt.topupplanlist) {
      this.setState({ topupplanList: PropsDt.topupplanlist });
    }
    if (this.state.customerData !== PropsDt.customerdetails) {
      let tax_type = this.state.tax_type;
      let tax_percentage = this.state.tax_percentage;
      let avbl_credits = 0;
      if (
        Object.keys(PropsDt.customerdetails).length > 0 &&
        PropsDt.customerdetails.common_setting != undefined &&
        Object.keys(PropsDt.customerdetails.common_setting).length > 0
      ) {
        tax_type = PropsDt.customerdetails.common_setting.company_tax_type;
        if (
          PropsDt.customerdetails.common_setting.company_tax_type == "Exclusive"
        ) {
          tax_percentage =
            PropsDt.customerdetails.common_setting.company_tax_percentage;
          tax_percentage =
            tax_percentage != undefined && tax_percentage != ""
              ? tax_percentage
              : 0;
        } else {
          tax_percentage = 0;
        }
        //avbl_credits = PropsDt.customerdetails.customer_available_credits
        avbl_credits = PropsDt.customerdetails.custmap_available_credits;
      }
      this.setState({
        customerData: PropsDt.customerdetails,
        avbl_credits: avbl_credits,
        tax_type: tax_type,
        tax_percentage: tax_percentage,
        loadding: false,
      });
    }
  }

  selectedTopupPlan(topupplan) {
    this.setState(
      { selectedplan: topupplan },
      function () {
        $("body").addClass("hide-overlay");
      }.bind(this)
    );
  }

  topupplanListing() {
    let topupplanList = this.state.topupplanList;
    let selectedplan = this.state.selectedplan;
    if (Object.keys(topupplanList).length > 0) {
      const topupplanHtml = topupplanList.map((topupplan, rwInt) => {
        let msnCls =
          Object.keys(selectedplan).length > 0 &&
          selectedplan.topupplan_id == topupplan.topupplan_id
            ? "active"
            : "";
        return (
          <li
            className={msnCls}
            onClick={this.selectedTopupPlan.bind(this, topupplan)}
          >
            <div className="list-parent">
              <figure>
                {" "}
                <img src={walletlight} />{" "}
              </figure>
              <div className="buy-credit-txt">
                <h2>{topupplan.topupplan_display_name}</h2>
                <p>
                  Bonus <span>{topupplan.topupplan_bonus_amount} Credits</span>
                </p>
              </div>
              <div className="credit-offer">
                <span>Buy For</span>
                <h2>${topupplan.topupplan_credits_amount}</h2>
              </div>
              <img className="last-img" src={orange} />{" "}
            </div>
          </li>
        );
      });
      return <ul>{topupplanHtml}</ul>;
    }
  }

  goToNavPage(pageTxt, event) {
    event.preventDefault();
    this.props.history.push("/" + pageTxt);
  }

  purchasePlan(planData, event) {
    event.preventDefault();
    let planDataTxt = "";
    if (Object.keys(planData).length > 0) {
      planData["tax_type"] = this.state.tax_type;
      planData["tax_percentage"] = this.state.tax_percentage;
      planDataTxt = JSON.stringify(planData);
    }
    //let planDataTxt = (Object.keys(planData).length > 0)?JSON.stringify(planData):'';
    localStorage.setItem("planData", planDataTxt);
    this.props.history.push("/checkout");
  }

  render() {
    let selectedplan = this.state.selectedplan;
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel">
          <div className="redbar">
            <div className="container">
              <div className="redbar-merge">
                <div className="redbar-rhs">
                  <figure>
                    <img src={walletlight} />
                  </figure>
                  <span>{this.state.avbl_credits} </span>
                </div>
                <div className="redbar-lhs">Balance (as of 4.30pm)</div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="equalto textcenter">1 Credit = $1.00</div>
            {this.state.loadding === true ? (
              <BulletList
                backgroundColor={"#c7c7c7"}
                foregroundColor={"#c7c7c7"}
              />
            ) : (
              <div className="credit-list">{this.topupplanListing()}</div>
            )}
          </div>
        </div>

        {Object.keys(selectedplan).length > 0 && (
          <IonFooter collapse="fade">
            <div className="sticky-single-btn">
              <a
                href="#"
                className="button "
                onClick={this.purchasePlan.bind(this, selectedplan)}
              >
                Purchase : ${selectedplan.topupplan_credits_amount}
              </a>
            </div>
          </IonFooter>
        )}
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
  var topupplanArr = Array();
  if (Object.keys(state.topupplanlist).length > 0) {
    if (state.topupplanlist[0].status === "ok") {
      topupplanArr = state.topupplanlist[0].result;
    }
  }
  return {
    customerdetails: customerdetailsArr,
    topupplanlist: topupplanArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomerDetails: (params) => {
      dispatch({ type: GET_CUSTOMER_DETAILS, params });
    },
    getTopupPlanList: (params) => {
      dispatch({ type: GET_TOPUPPLAN_LIST, params });
    },
  };
};
export default connect(mapStateTopProps, mapDispatchToProps)(withRouter(Topup));
