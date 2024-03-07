/* eslint-disable */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Header from "../Layout/Header";
import cookie from "react-cookies";
import { IonFooter } from "@ionic/react";
import "@ionic/react/css/core.css";
import { GET_PRODUCT_LIST } from "../../actions";
import {
  showAlert,
  showLoader,
  showPriceValue,
} from "../Helpers/SettingHelper";

var Parser = require("html-react-parser");
class TierBenefits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "Subscription",
      productDetails: [],
      loader: true,
      subscription_cycle: "",
    };

    if (cookie.load("UserId") === undefined) {
      props.history.push("/");
    }

    let slugValue =
      typeof props.match.params.slugValue !== "undefined"
        ? props.match.params.slugValue
        : "";
    console.log("slugValue", slugValue);
    if (slugValue != "" && slugValue != undefined) {
      this.props.getProductList("product_type=6&product_slug=" + slugValue);
    } else {
      props.history.push("/");
    }
  }
  componentWillReceiveProps(PropsDt) {
    if (this.state.productDetails !== PropsDt.productlist) {
      this.setState({ productDetails: PropsDt.productlist, loader: false });
    }
  }

  displayProduct() {
    if (this.state.loader === true) {
      return (
        <div className="intvl-catlst-li loader-main-cls">
          <br />
          <br />
          <br />
          <div className="spinner-border loader-sub-div" role="status">
            <span className="visually-hidden"></span>
          </div>
        </div>
      );
    } else {
      var productDetails = this.state.productDetails;
      if (productDetails.length > 0) {
        productDetails = productDetails[0];
        let proImg =
          productDetails.product_thumbnail != ""
            ? productDetails.product_thumbnail
            : noImage;
        var subscriptionDetail =
          productDetails.product_subscription !== "" &&
          productDetails.product_subscription !== null
            ? JSON.parse(productDetails.product_subscription)
            : [];
        var subscriptionTypes = [
          "Weekly",
          "Monthly",
          "Quarterly",
          "Biannually",
          "Annually",
        ];
        return (
          <div className="subs-details">
            <div className="subs-details-top">
              {this.state.subscription_cycle !== "" && (
                <h3 className="textcenter">
                  {this.state.subscription_cycle} Subscription
                </h3>
              )}
              <figure>
                {" "}
                <img src={proImg} alt="banner" />{" "}
              </figure>
            </div>
            <div className="subs-details-btm">
              <h4>
                {productDetails.product_alias !== "" &&
                productDetails.product_alias !== null
                  ? productDetails.product_alias
                  : productDetails.product_name}

                {productDetails.product_tag_info !== "" &&
                  productDetails.product_tag_info !== null && (
                    <span>{productDetails.product_tag_info}</span>
                  )}
              </h4>
              {productDetails.product_long_description !== "" &&
              productDetails.product_long_description !== null
                ? Parser(productDetails.product_long_description)
                : ""}
            </div>
            {subscriptionTypes.length > 0 && (
              <div className="sub-check">
                <ul>
                  {subscriptionTypes.map((item, index) => {
                    var allowSubscribe =
                      subscriptionDetail[item.toLowerCase()] !== "" &&
                      typeof subscriptionDetail[item.toLowerCase()] !==
                        undefined &&
                      typeof subscriptionDetail[item.toLowerCase()] !==
                        "undefined"
                        ? subscriptionDetail[item.toLowerCase()]
                        : "";
                    if (allowSubscribe !== "") {
                      return (
                        <li key={index}>
                          <input
                            type="radio"
                            className="lft-chk"
                            name="subscription_cycle"
                            value={item}
                            onChange={this.selectSubscribe.bind(this, item)}
                          />
                          <div className="chk-divide">
                            <h4>
                              Pay {showPriceValue(allowSubscribe.amount)} {item}{" "}
                            </h4>
                            {allowSubscribe.infotext !== "" && (
                              <span>{allowSubscribe.infotext}</span>
                            )}
                          </div>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
            )}
          </div>
        );
      }
    }
  }
  selectSubscribe(cycle) {
    this.setState({ subscription_cycle: cycle });
  }
  subscribeNow() {
    if (this.state.subscription_cycle !== "") {
      var details = {
        productID: this.state.productDetails[0].product_id,
        subscription_cycle: this.state.subscription_cycle,
        subscribeType: "product",
      };

      this.props.history.push({
        pathname: "/subscription/checkout",
        state: details,
      });
    } else {
      showAlert("Alert", "Please Select Any One Cycle", "warning");
    }
  }

  render() {
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel">
          <div className="container">{this.displayProduct()}</div>
        </div>
        <IonFooter collapse="fade">
          <div className="sticky-redeem">
            <div className="sticky-redeem-bg myvchr-redeem">
              <a
                href={void 0}
                className="button"
                onClick={this.subscribeNow.bind(this)}
              >
                Subscribe Now
              </a>
            </div>
          </div>
        </IonFooter>
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  var productlistArr = Array();
  if (Object.keys(state.productlist).length > 0) {
    if (state.productlist[0].status === "ok") {
      productlistArr = state.productlist[0].result_set;
    }
  }
  return {
    productlist: productlistArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProductList: (params) => {
      dispatch({ type: GET_PRODUCT_LIST, params });
    },
  };
};
export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(withRouter(TierBenefits));
