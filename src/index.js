import React from "react";
/* import { render } from "react-dom"; */
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { getStore } from "./store";

import "./common/css/font-awesome.min.css";
import "./common/css/bootstrap.min.css";
import "./common/css/style.css";
import "./common/css/responsive.css";
import "./common/css/slick.css";
import Home from "./components/Home/Home";
import SiteQR from "./components/Home/SiteQR";
import Company from "./components/Home/Company";
import Myaccount from "./components/Myaccount/Myaccount";
import Topup from "./components/Topup/Topup";
import Checkout from "./components/Checkout/Checkout";
import Placeorder from "./components/Checkout/Placeorder";
import Rewards from "./components/Myaccount/Rewards";
import History from "./components/Myaccount/History";
import TierBenefits from "./components/Myaccount/TierBenefits";
//import Vouchers from "./components/Myaccount/Vouchers";
import Vouchers from "./components/Myaccount/Companyvouchers";
import VoucherReadmore from "./components/Myaccount/VoucherReadmore";
import voucherDetail from "./components/Myaccount/voucherDetail";
import myVoucherDetail from "./components/Myaccount/myVoucherDetail";
import VoucherRedeem from "./components/Myaccount/VoucherRedeem";
import PointsRedeem from "./components/Myaccount/PointsRedeem";
import Termsandconditions from "./components/Myaccount/Termsandconditions";
import Usershare from "./components/Myaccount/Usershare";
import SubscriptionList from "./components/Subscription/SubscriptionList";
import SubscriptionDetail from "./components/Subscription/SubscriptionDetail";
import SubscriptionCalender from "./components/Subscription/SubscriptionCalender";
import SubscriptionType from "./components/Subscription/SubscriptionType";
import SubscriptionCheckout from "./components/Checkout/SubscriptionCheckout";

import HowToWork from "./components/Myaccount/HowToWork";

import Refpage from "./components/Myaccount/Refpage";
import Logout from "./components/Myaccount/Logout";

import Page404 from "./Page404";

const store = getStore();
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <Router>
      <Switch>
        {/*  Master Admin Start*/}
        <Route exact path="/" component={Home} />
        <Route path="/home" component={Company} />
        <Route path={"/cmpqrcode/:slugtext"} component={SiteQR} />
        <Route path="/myaccount" component={Myaccount} />
        <Route path="/topup" component={Topup} />
        <Route exact path="/checkout" component={Checkout} />
        <Route exact path="/placeorder" component={Placeorder} />
        <Route exact path="/rewards" component={Rewards} />
        <Route exact path="/vouchers/:slugValue" component={voucherDetail} />
        <Route exact path="/vouchers" component={Vouchers} />
        <Route
          exact
          path="/subscription/:subscribeType/:slugValue"
          component={SubscriptionDetail}
        />
        <Route
          exact
          path="/subscription/checkout"
          component={SubscriptionCheckout}
        />
        <Route
          exact
          path="/subscription/:subscribeType"
          component={SubscriptionList}
        />
        <Route exact path="/subscription" component={SubscriptionType} />
        <Route
          exact
          path="/subscription-calender"
          component={SubscriptionCalender}
        />

        <Route exact path="/myvoucher" component={myVoucherDetail} />
        <Route exact path="/redeem" component={VoucherRedeem} />
        <Route exact path="/redeempts" component={PointsRedeem} />
        <Route exact path="/terms-conditions" component={Termsandconditions} />
        {/* <Route exact path="/subscription" component={Subscription} /> */}
        <Route exact path="/how-it-works" component={HowToWork} />

        <Route exact path="/history" component={History} />
        <Route exact path="/memberinfo" component={TierBenefits} />

        <Route exact path="/voucher-more" component={VoucherReadmore} />
        <Route exact path="/allvoucher-more" component={voucherDetail} />
        <Route exact path="/share" component={Usershare} />

        <Route path={"/refpage/:slugtext/:slugval"} component={Refpage} />
        <Route path={"/refpage/:slugtext"} component={Refpage} />
        <Route exact path="/logout" component={Logout} />

        <Route component={Page404} />
      </Switch>
    </Router>
  </Provider>
);
