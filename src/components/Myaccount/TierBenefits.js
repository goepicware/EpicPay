/* eslint-disable */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Header from "../Layout/Header";
import cookie from "react-cookies";
import { unquieID } from "../Settings/Config";
var Parser = require("html-react-parser");
class TierBenefits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "Tier Benefits",
      staticblocksList: [],
      activemember: "bronze-member",
      bronzememberInfo: "",
      goldmemberInfo: "",
      platinummemberInfo: "",
    };

    if (cookie.load("UserId") === undefined) {
      props.history.push("/");
    }

    if (unquieID == "") {
      props.history.push("/home");
    }
  }
  componentDidMount() {
    //$("body").addClass("hide-overlay");
  }

  componentWillReceiveProps(PropsDt) {
    if (this.state.staticblocksList !== PropsDt.staticblocks) {
      this.setState({ staticblocksList: PropsDt.staticblocks }, function () {
        this.setMemberInfo();
      });
    }
  }

  setMemberInfo() {
    let staticblocksList = this.state.staticblocksList;
    let bronzememberInfo = "";
    let goldmemberInfo = "";
    let platinummemberInfo = "";
    if (Object.keys(staticblocksList).length > 0) {
      staticblocksList.map((staticblock) => {
        if (staticblock.staticblocks_slug == "bronze-member") {
          bronzememberInfo = staticblock.staticblocks_description;
        }
        if (staticblock.staticblocks_slug == "gold-member") {
          goldmemberInfo = staticblock.staticblocks_description;
        }
        if (staticblock.staticblocks_slug == "platinum-member") {
          platinummemberInfo = staticblock.staticblocks_description;
        }
        return staticblock;
      });
    }

    this.setState({
      bronzememberInfo: bronzememberInfo,
      goldmemberInfo: goldmemberInfo,
      platinummemberInfo: platinummemberInfo,
    });
  }

  memberInfoHtml() {
    let memberInfo = "";
    if (this.state.activemember == "bronze-member") {
      memberInfo =
        this.state.bronzememberInfo !== ""
          ? Parser(this.state.bronzememberInfo)
          : "";
    }
    if (this.state.activemember == "gold-member") {
      memberInfo =
        this.state.goldmemberInfo !== ""
          ? Parser(this.state.goldmemberInfo)
          : "";
    }
    if (this.state.activemember == "platinum-member") {
      memberInfo =
        this.state.platinummemberInfo !== ""
          ? Parser(this.state.platinummemberInfo)
          : "";
    }
    return <>{memberInfo}</>;
  }

  nevMemberFun(tabTxt, event) {
    event.preventDefault();
    this.setState({ activemember: tabTxt });
  }

  render() {
    let staticblocksList = this.state.staticblocksList;
    let activemember = this.state.activemember;
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel">
          <div className="container">
            <div className="vouchers-list">
              <div className="vouchers-nav tier-benefit-nav">
                <ul>
                  <li
                    className={activemember == "bronze-member" ? "active" : ""}
                    onClick={this.nevMemberFun.bind(this, "bronze-member")}
                  >
                    <a href={void 0}>Bronze</a>{" "}
                  </li>
                  <li
                    className={activemember == "gold-member" ? "active" : ""}
                    onClick={this.nevMemberFun.bind(this, "gold-member")}
                  >
                    <a href={void 0}>Gold</a>{" "}
                  </li>
                  <li
                    className={
                      activemember == "platinum-member" ? "active" : ""
                    }
                    onClick={this.nevMemberFun.bind(this, "platinum-member")}
                  >
                    <a href={void 0}>Platinum</a>{" "}
                  </li>
                </ul>
              </div>
              <div className="tier-benefit-body">
                {Object.keys(staticblocksList).length > 0 &&
                  this.memberInfoHtml()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  var staticblocksArr = Array();
  if (Object.keys(state.staticblocks).length > 0) {
    if (state.staticblocks[0].status === "ok") {
      staticblocksArr = state.staticblocks[0].result_set;
    }
  }
  return {
    staticblocks: staticblocksArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return "";
};
export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(withRouter(TierBenefits));
