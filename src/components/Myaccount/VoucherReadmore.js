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

import OwlCarousel from "react-owl-carousel2";
import "../../common/css/owl.carousel.css";

import user from "../../common/images/user.svg";
import nav from "../../common/images/navigation.svg";

import ot from "../../common/images/outlet-place.png";
import innerbg from "../../common/images/inner-banner.jpg";

import coin from "../../common/images/coin.svg";
import medal from "../../common/images/medall.svg";
import gcard from "../../common/images/gift-card.svg";
import reward from "../../common/images/rewards.svg";
import tick from "../../common/images/tick-red.svg";
import topup from "../../common/images/topup-nav.svg";
import crown from "../../common/images/crown-nav.svg";
import referal from "../../common/images/referral-nav.svg";
import back from "../../common/images/back-arrow.svg";
import chati from "../../common/images/chat.svg";
import infoi from "../../common/images/info.svg";

import { th } from "date-fns/locale";

var mbanner = {
  items: 1,
  loop: true,
  dots: true,
  nav: false,
  margin: 15,
  stagePadding: 40,
  responsive: {
    0: {
      items: 1,
      stagePadding: 20,
    },
    480: {
      items: 1,
      margin: 15,
      stagePadding: 40,
    },
  },
};

var foodbanner = {
  items: 4,
  loop: true,
  dots: false,
  nav: false,
  margin: 13,
  stagePadding: 30,
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagList: [],
      bannerList: [],
      storeList: [],
      storeDisplay: "",
      locationName:
        cookie.load("locationName") !== "" &&
        typeof cookie.load("locationName") !== undefined &&
        typeof cookie.load("locationName") !== "undefined"
          ? cookie.load("locationName")
          : "",
      locationImage:
        cookie.load("locationImage") !== "" &&
        typeof cookie.load("locationImage") !== undefined &&
        typeof cookie.load("locationImage") !== "undefined"
          ? cookie.load("locationImage")
          : "",
    };

    if (
      cookie.load("token") === "" ||
      typeof cookie.load("token") === undefined ||
      typeof cookie.load("token") === "undefined"
    ) {
      cookie.save(
        "token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjo4OTExOTgzLCJpZF9kZXZpY2UiOiJhYmNkYWJjZCIsImlhdCI6MTY5NjUwMjMzMiwiZXhwIjoxNzI4MDM4MzMyLCJpc3MiOiJuZXJvX2JhY2tlbmRfYXBpIiwic3ViIjoibmVyby1hY2Nlc3MtdG9rZW4iLCJqdGkiOiJuZXJvLXVzZXIuaWQifQ.Bkaurv21swbajmz1-_XDqPvF10Qoj66AxElVBfDYRnE",
        { path: "/" }
      );
    }
  }
  componentDidMount() {
    this.loadTag();
    this.loadBanner();

    $("body").addClass("hide-overlay");
  }
  componentWillReceiveProps(PropsDt) {
    if (this.state.storeList !== PropsDt.storeList) {
      this.setState({ storeList: PropsDt.storeList }, function () {
        this.displayStore();
      });
    }
  }
  loadTag() {
    axios.get(apiUrl + "store/tagList?unquieid=" + unquieID).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ tagList: res.data.result }, function () {
          if (
            cookie.load("locationID") !== "" &&
            typeof cookie.load("locationID") !== undefined &&
            typeof cookie.load("locationID") !== "undefined"
          ) {
            var latitude =
              cookie.load("deliveryaddresslat") !== "" &&
              typeof cookie.load("deliveryaddresslat") !== undefined &&
              typeof cookie.load("deliveryaddresslat") !== "undefined"
                ? cookie.load("deliveryaddresslat")
                : "";
            var longitude =
              cookie.load("deliveryaddresslong") !== "" &&
              typeof cookie.load("deliveryaddresslong") !== undefined &&
              typeof cookie.load("deliveryaddresslong") !== "undefined"
                ? cookie.load("deliveryaddresslong")
                : "";
            this.props.getStoreList(
              "&dellocation=" +
                cookie.load("locationID") +
                "&latitude=" +
                latitude +
                "&longitude=" +
                longitude
            );
          }
        });
      }
    });
  }
  loadBanner() {
    axios.get(apiUrl + "banner/listBanner?unquieid=" + unquieID).then((res) => {
      if (res.data.status === "ok") {
        this.setState({ bannerList: res.data.result });
      }
    });
  }
  displayStore() {
    var storeDisplay = "";
    if (this.state.storeList.length > 0) {
      storeDisplay = this.state.storeList.map((item, index) => {
        return (
          <li key={index}>
            <Link to={"/restaurant/" + item.storeSlug} className="ot-parent">
              <div className="ot-img">
                <img
                  src={
                    item.storeImage !== "" && item.storeImage !== null
                      ? item.storeImage
                      : ot
                  }
                  alt={item.storeName}
                />
              </div>
              <div className="ot-info">
                <h3 className="ot-title">{item.storeName}</h3>
                <div className="km-rating">
                  <strong>
                    {item.distance !== ""
                      ? parseFloat(item.distance).toFixed("2")
                      : "0"}{" "}
                    km
                  </strong>
                  <span>
                    {item.Rating} ({item.totalRating})
                  </span>
                </div>
                <div className="op-time">{item.storeTimeInfo}</div>
                {item.tagID !== "" &&
                  item.tagID !== null &&
                  this.state.tagList.length > 0 && (
                    <div className="ot-keyword">
                      {this.loadStoreTag(item.tagID)}
                    </div>
                  )}
                {item.offerInfo !== "" && item.offerInfo !== null && (
                  <div className="ot-offers">{item.offerInfo}</div>
                )}
              </div>
            </Link>
          </li>
        );
      });
    }
    this.setState({ storeDisplay: storeDisplay });
  }
  loadStoreTag(storeTag) {
    if (this.state.tagList.length > 0) {
      var storeTag = storeTag.split(",");
      var tagList = [];
      this.state.tagList.map((item) => {
        if (storeTag.indexOf(item.value) >= 0) {
          tagList.push(item.label);
        }
      });
      if (tagList.length > 0) {
        return tagList.join(", ");
      }
    }
  }

  render() {
    return (
      <div className="main-div">
        <div className="header-action header-center-txt">
          <div className="container">
            <div className="ha-lhs-arrow">
              <a href="#">
                <img src={back} />
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
        <div className="mbtm-need rel">
          <div className="banner-bar">
            <img src={innerbg} />
          </div>
          <div className="container">
            <div className="voucher-detail">
              <div className="voucher-detail-header">
                <h2>Savannah Set</h2>
                <span>Valid Till 23/10/2023</span>
              </div>
              <div className="voucher-detail-body">
                <h5>Highlight</h5>
                <p>You can use your coins to purchase this product voucher. </p>
                <br />
                <h5>Terms & Conditions</h5>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.{" "}
                </p>
                <br />
                <p>
                  {" "}
                  Lorem Ipsum has been the industry's standard dummy text ever
                  since the 1500s, when an unknown printer took a galley of type
                  and scrambled.
                </p>{" "}
                <br />
                <p>
                  {" "}
                  Make a type specimen book. It has survived not only five
                  centuries, but also the leap into electronic typesetting,
                  remaining essentially unchanged.
                </p>
                <br />
              </div>
            </div>
          </div>
        </div>

        <BottomSheet
          open={true}
          className="bottomSheetMain two-btn"
          blocking={false}
        >
          <div href="#" className="sticky-single-btn">
            <a href="#" className="button ">
              Use Now
            </a>
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
export default connect(mapStateTopProps, mapDispatchToProps)(withRouter(Home));
