/* eslint-disable */
import React, { Component } from "react";
import Header from "../Layout/Header";
import cookie from "react-cookies";
import { unquieID } from "../Settings/Config";
class Subscription extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    if (cookie.load("UserId") === undefined) {
      props.history.push("/");
    }

    if (unquieID == "") {
      props.history.push("/home");
    }
  }

  render() {
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel">
          <div className="container">
            <div className="termsandcond-info">
              <br></br>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Subscription;
