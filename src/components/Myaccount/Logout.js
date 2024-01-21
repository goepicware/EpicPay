import React, { Component } from "react";
import cookie from "react-cookies";
import { apiUrl, unquieID, baseUrl } from "../Settings/Config";

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
    localStorage.removeItem("selectedcompany_data");

    //this.props.history.push("/");
    setTimeout(function () {
      window.location.href = baseUrl;
    }, 0);

  }

  render() {
    return <h1 className="loading-text">Logging out...</h1>;
  }
}

export default Logout;
