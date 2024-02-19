import React, { Component } from "react";
import cookie from "react-cookies";

class Refpage extends Component {
  constructor(props) {
    super(props);

    let slugtext =
      typeof this.props.match.params.slugtext !== "undefined"
        ? this.props.match.params.slugtext
        : "";

    if (slugtext === "myaccount") {
      this.props.history.push("/myaccount");
    } else if (slugtext === "history") {
      this.props.history.push("/history");
    } else if (slugtext === "vouchers") {
      this.props.history.push("/vouchers");
    } else if (slugtext === "topup") {
      this.props.history.push("/topup");
    } else if (slugtext === "redeemed") {
      cookie.save("vouchers_show", "redeemed", { path: "/" });
      this.props.history.push("/vouchers");
    } else if (slugtext === "referal") {
      let slugval =
        typeof this.props.match.params.slugval !== "undefined"
          ? this.props.match.params.slugval
          : "";
      localStorage.setItem("refcode", slugval);
      this.props.history.push("/");
    } else {
      this.props.history.push("/myaccount");
    }
  }

  render() {
    return <div></div>;
  }
}

export default Refpage;
