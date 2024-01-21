/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import {
  IonContent,
  IonButtons,
  IonButton,
  IonFooter,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "@ionic/react/css/core.css";
import topup from "../../common/images/topup-nav.svg";
import crown from "../../common/images/crown-nav.svg";
import referal from "../../common/images/referral-nav.svg";
import voc from "../../common/images/voucher-crop.svg";

var Parser = require("html-react-parser");
class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = { footerBlocks: "", footerlink: "" };
  }

  componentDidMount() {
    $("body").addClass("hide-overlay");
  }

  componentWillReceiveProps(PropsData) {}

  render() {
    return (
      <footer className="footer-main">
        <IonFooter collapse="fade">
          <div className="nav-full">
            <Link to={"/topup"} title="Topup" className="active">
              <img src={topup} /> <span>Top up</span>
            </Link>
            <Link to={"/rewards"} title="Rewards">
              <img src={crown} /> <span>Rewards</span>
            </Link>
            <Link to={"/vouchers"} title="Vouchers">
              <figure>
                <img src={voc} />
                {/*<em>25</em>*/}
              </figure>{" "}
              <span>Vouchers</span>
            </Link>
            <Link to={"/share"} title="Refer">
              <img src={referal} /> <span>Refer</span>
            </Link>
          </div>
        </IonFooter>
      </footer>
    );
  }
}

export default Footer;
