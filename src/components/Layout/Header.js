/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import logo from "../../common/images/logo.png";
import user from "../../common/images/user.svg";
import nav from "../../common/images/navigation.svg";
import cookie from "react-cookies";
import invoice from "../../common/images/invoice-icon.svg";
import vouc from "../../common/images/voucher-icon.svg";
import wallet from "../../common/images/wallet.svg";
import back from "../../common/images/back-arrow.svg";
import walletlight from "../../common/images/wallet.svg";
import homelg from "../../common/images/homelg.png";
import epicpay from "../../common/images/epicpay.png";
import { companyLogo } from "../Settings/Config";
import { GET_STATICBLOCKS_LIST } from "../../actions";

var Parser = require("html-react-parser");
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toppageData: [],
      menuActive: "hide",
      headerBlocks: "",
      headerlink: "",
    };
  }

  componentDidMount() {
    var customerId = cookie.load("UserId");
    this.props.getStaticblocksList("customer_id=" + customerId);
  }

  componentWillReceiveProps(PropsData) {
    if (this.state.toppageData !== PropsData.mainpagestate) {
      this.setState({ toppageData: PropsData.mainpagestate });
    }
  }

  openMenuFun(event) {
    event.preventDefault();
    let menuActive = this.state.menuActive;
    if (menuActive == "hide") {
      this.setState({ menuActive: "open" });
      $(".side-bar-maincls").addClass("open");
    } else {
      this.setState({ menuActive: "hide" });
      $(".side-bar-maincls").removeClass("open");
    }
  }

  goToNavPage(activepage, event) {
    event.preventDefault();
    let pageTxt = "";
    if (activepage == "Top Up" || activepage == "PointsRedeem") {
      pageTxt = "myaccount";
    } else if (activepage == "Vouchers") {
      let actionfrom =
        Object.keys(this.props.mainpagestate).length > 0
          ? this.props.mainpagestate.actionfrom
          : "";
      //pageTxt = (actionfrom == 'rewards') ? 'rewards' : 'home';
      pageTxt = actionfrom == "rewards" ? "rewards" : "myaccount";
    } else if (
      activepage == "History" ||
      activepage == "Tier Benefits" ||
      activepage == "T & C"
    ) {
      pageTxt = "rewards";
    } else if (
      activepage == "VouchersDetail" ||
      activepage == "VouchersRedeem"
    ) {
      pageTxt = "vouchers";
    } else if (activepage == "Checkout") {
      pageTxt = "topup";
    }
    this.props.prntPagePrps.history.push("/" + pageTxt);
  }

  showVoucher(tabTxt, event) {
    event.preventDefault();
    cookie.save("vouchers_show", tabTxt, { path: "/" });
    this.props.prntPagePrps.history.push("/vouchers");
  }

  render() {
    let activepage =
      Object.keys(this.props.mainpagestate).length > 0
        ? this.props.mainpagestate.current_page
        : "";
    return (
      <>
        <header className="header-main">
          <div className="header-action header-center-txt">
            <div className="container">
              {activepage === "My Account" || activepage === "Epic" ? (
                <>
                  <div className="ha-lhs">
                    {activepage === "Epic" ? (
                      <a href={void 0}>
                        <img src={epicpay} />
                      </a>
                    ) : (
                      <Link to={"/home"} title="Home">
                        {companyLogo != "" ? (
                          <img className="dynmic-cmp-logo" src={companyLogo} />
                        ) : (
                          <img src={logo} />
                        )}
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="ha-lhs-arrow">
                    {activepage != "Epic" && (
                      <a
                        href={void 0}
                        onClick={this.goToNavPage.bind(this, activepage)}
                      >
                        <img src={back} />
                      </a>
                    )}
                  </div>
                  <div className="ha-middle">
                    {activepage != "VouchersDetail" &&
                    activepage != "VouchersRedeem"
                      ? activepage
                      : ""}
                  </div>
                </>
              )}
              <div className="ha-rhs">
                <ul>
                  {activepage === "My Account" && (
                    <li className="profile-user home-linkcls">
                      <Link to={"/home"} className="home-btn" title="company">
                        <img src={homelg} />
                      </Link>
                    </li>
                  )}
                  <li className="profile-user">
                    <a href={void 0}>
                      <img src={user} />
                    </a>
                  </li>
                  <li className="navsbar">
                    <a href={void 0} onClick={this.openMenuFun.bind(this)}>
                      <img src={nav} />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        <div className={"side-bar full-height side-bar-maincls"}>
          <div className="container">
            <div className="three-nav">
              <Link
                to={"/refpage/myaccount"}
                className="button rv-btn"
                title="Myaccount"
              >
                {" "}
                <img src={walletlight} /> My Account{" "}
              </Link>
              <Link
                to={"/refpage/vouchers"}
                className="button rv-btn"
                title="Vouchers"
              >
                {" "}
                <img src={vouc} /> Vouchers{" "}
              </Link>
              <Link
                to={"/refpage/topup"}
                title="Redeem Credits"
                className="button rc-btn"
              >
                {" "}
                <img src={wallet} /> Topup Credits{" "}
              </Link>
              <Link
                to={"/refpage/history"}
                title="View Daily Transactions"
                className="button vdt-btn"
              >
                {" "}
                <img src={invoice} /> View History{" "}
              </Link>
              <Link to={"/logout"} title="Logout" className="button vdt-btn">
                {" "}
                <img src={invoice} /> Logout{" "}
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateTopProps = (state) => {
  return "";
};

const mapDispatchToProps = (dispatch) => {
  return {
    getStaticblocksList: (params) => {
      dispatch({ type: GET_STATICBLOCKS_LIST, params });
    },
  };
};
export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(withRouter(Header));
