/* eslint-disable */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Header from "../Layout/Header";
import cookie from "react-cookies";
import OwlCarousel from "react-owl-carousel2";
import "../../common/css/owl.carousel.css";

import banner1 from "../../common/images/banner.jpg";
import banner2 from "../../common/images/banner1.jpg";
import chn from "../../common/images/Chicken.png";
import bur from "../../common/images/Burger.png";
import cke from "../../common/images/Cake.png";
import ndle from "../../common/images/Noddle.png";
import piz from "../../common/images/Pizza.png";
import op1 from "../../common/images/outlet-place.png";
import op2 from "../../common/images/outlet-place1.png";
import lik from "../../common/images/liked.svg";

var Parser = require("html-react-parser");

var mbanner = {
  items: 1,
  loop: true,
  dots: false,
  nav: false,
  margin: 10,
  stagePadding: 30,
};

var foodbanner = {
  items: 4,
  loop: true,
  dots: true,
  nav: false,
  margin: 10,
  stagePadding: 30,
};

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "T & C",
      staticblocksList: [],
      termsandcondInfo: "",
    };

    if (cookie.load("UserId") === undefined) {
      props.history.push("/");
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
    let termsandcondInfo = "";
    if (Object.keys(staticblocksList).length > 0) {
      const staticblockHtml = staticblocksList.map((staticblock, rwInt) => {
        if (staticblock.staticblocks_slug == "terms-conditions") {
          termsandcondInfo = staticblock.staticblocks_description;
        }
        return staticblock;
      });
    }
    let termsandcondInfoHtml =
      termsandcondInfo != "" ? Parser(termsandcondInfo) : "";
    this.setState({ termsandcondInfo: termsandcondInfoHtml });
  }

  render() {
    let termsandcondInfo = this.state.termsandcondInfo;
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel">
          <div className="container">
            <div className="epic-banner">
              <OwlCarousel options={mbanner}>
                <div className="mowl-banner">
                  <img src={banner1} />
                </div>
                <div className="mowl-banner">
                  <img src={banner2} />
                </div>
                <div className="mowl-banner">
                  <img src={banner1} />
                </div>
              </OwlCarousel>
            </div>
            <div className="che-slider">
              <h3>Recent visits</h3>
              <OwlCarousel options={foodbanner}>
                <div className="img-round">
                  <a href={void 0}>
                    <img src={chn} />
                  </a>
                </div>
                <div className="img-round">
                  <a href={void 0}>
                    <img src={bur} />
                  </a>
                </div>
                <div className="img-round">
                  <a href={void 0}>
                    <img src={cke} />
                  </a>
                </div>
                <div className="img-round">
                  <a href={void 0}>
                    <img src={piz} />
                  </a>
                </div>
                <div className="img-round">
                  <a href={void 0}>
                    <img src={ndle} />
                  </a>
                </div>
              </OwlCarousel>
            </div>

            <div className="fav-tab">
              <div className="fav-tab-nav">
                <ul>
                  <li>
                    <a href={void 0}>Favourite</a>
                  </li>
                  <li className="active">
                    <a href={void 0}>Food & Drinks</a>
                  </li>
                  <li>
                    <a href={void 0}>Fashion & Lifestyle</a>
                  </li>
                </ul>
              </div>
              <div className="fav-tab-content">
                <ul>
                  <li>
                    <a href={void 0} className="love-it">
                      <img src={lik} />
                    </a>
                    <a href={void 0} className="main-cover">
                      <img src={op1} />
                      <p>Pastamania</p>
                    </a>
                    <div className="color-tag">Visited</div>
                  </li>
                  <li>
                    <a href={void 0} className="love-it">
                      <img src={lik} />
                    </a>
                    <a href={void 0} className="main-cover">
                      <img src={op2} />
                      <p>Mrs Pho</p>
                    </a>
                  </li>
                  <li>
                    <a href={void 0} className="love-it">
                      <img src={lik} />
                    </a>
                    <a href={void 0} className="main-cover">
                      <img src={op1} />
                      <p>Canadian</p>
                    </a>
                    <div className="color-tag">Visited</div>
                  </li>
                  <li>
                    <a href={void 0} className="love-it">
                      <img src={lik} />
                    </a>
                    <a href={void 0} className="main-cover">
                      <img src={op2} />
                      <p>Ambok Solok</p>
                    </a>
                  </li>
                </ul>
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
)(withRouter(Company));
