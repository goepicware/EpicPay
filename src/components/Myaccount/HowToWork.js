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
      current_page: "How It Works",
      staticblocksList: [],
      activetab: "demo-credits",
      democredits: "",
      demopoints: "",
      demovouchers: "",
    };

    if (cookie.load("UserId") === undefined) {
      props.history.push("/");
    }

    if (unquieID == "") {
      props.history.push("/home");
    }
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
    let democredits = "";
    let demopoints = "";
    let demovouchers = "";
    if (Object.keys(staticblocksList).length > 0) {
      staticblocksList.map((staticblock) => {
        if (staticblock.staticblocks_slug == "demo-credits") {
          democredits = staticblock.staticblocks_description;
        }
        if (staticblock.staticblocks_slug == "demo-points") {
          demopoints = staticblock.staticblocks_description;
        }
        if (staticblock.staticblocks_slug == "demo-vouchers") {
          demovouchers = staticblock.staticblocks_description;
        }
        return staticblock;
      });
    }

    this.setState({
      democredits: democredits,
      demopoints: demopoints,
      demovouchers: demovouchers,
    });
  }

  memberInfoHtml() {
    let demoContent = "";
    if (this.state.activetab == "demo-credits") {
      demoContent =
        this.state.democredits !== "" ? Parser(this.state.democredits) : "";
    }
    if (this.state.activetab == "demo-points") {
      demoContent =
        this.state.demopoints !== "" ? Parser(this.state.demopoints) : "";
    }
    if (this.state.activetab == "demo-vouchers") {
      demoContent =
        this.state.demovouchers !== "" ? Parser(this.state.demovouchers) : "";
    }
    return <>{demoContent}</>;
  }

  nevMemberFun(tabTxt, event) {
    event.preventDefault();
    this.setState({ activetab: tabTxt });
  }

  render() {
    let staticblocksList = this.state.staticblocksList;
    let activetab = this.state.activetab;
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel">
          <div className="container">
            <div className="vouchers-list">
              <div className="vouchers-nav tier-benefit-nav">
                <ul>
                  <li
                    className={activetab == "demo-credits" ? "active" : ""}
                    onClick={this.nevMemberFun.bind(this, "demo-credits")}
                  >
                    <a href={void 0}>Credits</a>{" "}
                  </li>
                  <li
                    className={activetab == "demo-points" ? "active" : ""}
                    onClick={this.nevMemberFun.bind(this, "demo-points")}
                  >
                    <a href={void 0}>Points</a>{" "}
                  </li>
                  <li
                    className={activetab == "demo-vouchers" ? "active" : ""}
                    onClick={this.nevMemberFun.bind(this, "demo-vouchers")}
                  >
                    <a href={void 0}>Vouchers</a>{" "}
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
