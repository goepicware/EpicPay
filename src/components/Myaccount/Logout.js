import React, { Component } from "react";
import cookie from "react-cookies";
import { baseUrl } from "../Settings/Config";

class Logout extends Component {
  componentWillMount() {
    cookie.remove("UserId");
    cookie.remove("UserFname");
    cookie.remove("UserLname");
    cookie.remove("UserMobile");
    cookie.remove("UserEmail");

    cookie.remove("IsVerifiedUser");
    cookie.remove("triggerOTP");
    cookie.remove("triggerFrom");

    localStorage.removeItem("company_id");
    localStorage.removeItem("company_app_id");
    localStorage.removeItem("company_logo");
    localStorage.removeItem("selectedcompany_data");
    localStorage.removeItem("token");

    setTimeout(function () {
      window.location.href = baseUrl;
    }, 0);
  }

  render() {
    return <h1 className="loading-text">Logging out...</h1>;
  }
}

export default Logout;
