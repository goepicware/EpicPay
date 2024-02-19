/* eslint-disable */
import React, { Component } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import cookie from "react-cookies";
import user from "../../common/images/user.svg";
import nav from "../../common/images/navigation.svg";
import innerbg from "../../common/images/inner-banner.jpg";
import back from "../../common/images/back-arrow.svg";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  }
  componentDidMount() {
    $("body").addClass("hide-overlay");
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
export default Home;
