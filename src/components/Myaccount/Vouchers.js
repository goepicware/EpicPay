/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import cookie from "react-cookies";
import { GET_PRODUCT_LIST, GET_PROMOTION_LIST } from "../../actions";
import { unquieID } from "../Settings/Config";
import Header from "../Layout/Header";
import coin from "../../common/images/coin.svg";
import noImage from "../../common/images/no-image.jpg";

class Vouchers extends Component {
  constructor(props) {
    super(props);

    var vouchersShow =
      cookie.load("vouchers_show") != "" &&
      cookie.load("vouchers_show") != undefined
        ? cookie.load("vouchers_show")
        : "all";

    this.state = {
      current_page: "Vouchers",
      activetab: vouchersShow,
      productList: [],
      promotionlist: [],
      available_promo_count: 0,
      available_promo: [],
      redeemed_promo: [],
    };

    if (cookie.load("UserId") === undefined) {
      props.history.push("/");
    }

    if (unquieID == "") {
      props.history.push("/home");
    }

    if (cookie.load("vouchers_show") !== undefined) {
      cookie.remove("vouchers_show", { path: "/" });
    }

    this.props.getProductList("app_id=" + unquieID + "&product_type=5");
    this.props.getPromotionList("&customer_id=" + cookie.load("UserId"));
  }
  componentDidMount() {
    //$("body").addClass("hide-overlay");
  }
  componentWillReceiveProps(PropsDt) {
    if (this.state.productList !== PropsDt.productlist) {
      this.setState({ productList: PropsDt.productlist });
    }
    if (this.state.promotionlist !== PropsDt.promotionlist) {
      let availablePromo = Array();
      let redeemedPromo = Array();
      let availablePromoCount = 0;
      if (
        PropsDt.promotionlist != "" &&
        PropsDt.promotionlist != undefined &&
        Object.keys(PropsDt.promotionlist).length > 0
      ) {
        availablePromo = PropsDt.promotionlist.my_promo;
        redeemedPromo = PropsDt.promotionlist.promo_history;
        availablePromoCount = Object.keys(
          PropsDt.promotionlist.my_promo
        ).length;
      }
      this.setState({
        promotionlist: PropsDt.promotionlist,
        available_promo_count: availablePromoCount,
        available_promo: availablePromo,
        redeemed_promo: redeemedPromo,
      });
    }
  }

  nevTabFun(tabTxt, event) {
    event.preventDefault();
    this.setState({ activetab: tabTxt });
  }

  allVouchersList() {
    let productList = this.state.productList;
    if (Object.keys(productList).length > 0) {
      const productListHtml = productList.map((product) => {
        let proImg =
          product.product_thumbnail != "" ? product.product_thumbnail : noImage;
        let proName =
          product.product_alias != ""
            ? product.product_alias
            : product.product_name;
        let productPrice =
          product.product_price != "" ? parseFloat(product.product_price) : 0;
        return (
          <li>
            <figure>
              <img src={proImg} />
            </figure>
            <figcaption>
              <h5>{proName}</h5>
              <p>Valid Till {product.product_voucher_expiry_datetxt}</p>
              <span>
                {productPrice} <img src={coin} />
              </span>
              <Link
                to={"/vouchers/" + product.product_slug}
                title="Vouchers View"
                className="button"
              >
                Redeem
              </Link>
            </figcaption>
          </li>
        );
      });

      return <ul>{productListHtml}</ul>;
    } else {
      return <div> No Voushers Found </div>;
    }
  }

  gotoMyVoucher(voucherData, event) {
    event.preventDefault();
    let voucherDataTxt =
      Object.keys(voucherData).length > 0 ? JSON.stringify(voucherData) : "";
    localStorage.setItem("voucherData", voucherDataTxt);
    this.props.history.push("/myvoucher");
  }

  availableVouchersList() {
    let availablePromoLst = this.state.available_promo;
    if (Object.keys(availablePromoLst).length > 0) {
      const availablePromoListHtml = availablePromoLst.map((availablePromo) => {
        let proImg =
          availablePromo.promotion_image != ""
            ? availablePromo.promotion_image
            : noImage;
        let proName =
          availablePromo.promotion_created_from == "Cron"
            ? availablePromo.promotion_desc
            : availablePromo.promo_code;
        let productPrice =
          availablePromo.promotion_max_amt != ""
            ? availablePromo.promotion_max_amt
            : 0;
        return (
          <li>
            <figure>
              <img src={proImg} />
            </figure>
            <figcaption>
              <h5>{proName}</h5>
              <p>Valid Till {availablePromo.promo_valid_till}</p>
              {availablePromo.promotion_created_from != "Cron" && (
                <span>
                  {productPrice} <img src={coin} />
                </span>
              )}
              <Link
                onClick={this.gotoMyVoucher.bind(this, availablePromo)}
                title="Vouchers View"
                className="button"
              >
                Redeem
              </Link>
            </figcaption>
          </li>
        );
      });

      return <ul>{availablePromoListHtml}</ul>;
    } else {
      return <div> No Voushers Found </div>;
    }
  }

  redeemedVouchersList() {
    let redeemedPromoLst = this.state.redeemed_promo;
    if (Object.keys(redeemedPromoLst).length > 0) {
      const redeemedPromoListHtml = redeemedPromoLst.map((redeemedPromo) => {
        let proImg =
          redeemedPromo.promotion_image != ""
            ? redeemedPromo.promotion_image
            : noImage;
        let proName =
          redeemedPromo.promotion_created_from == "Cron"
            ? redeemedPromo.promotion_desc
            : redeemedPromo.promo_code;
        let productPrice =
          redeemedPromo.promotion_max_amt != ""
            ? redeemedPromo.promotion_max_amt
            : 0;
        return (
          <li>
            <figure>
              <img src={proImg} />
            </figure>
            <figcaption>
              <h5>{proName}</h5>
              <p>Redeem On {redeemedPromo.promo_redeem_on}</p>
              {redeemedPromo.promotion_created_from != "Cron" && (
                <span>
                  {productPrice} <img src={coin} />
                </span>
              )}
            </figcaption>
          </li>
        );
      });

      return <ul>{redeemedPromoListHtml}</ul>;
    } else {
      return <div> No Voushers Found </div>;
    }
  }

  render() {
    let activetab = this.state.activetab;
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel">
          <div className="container">
            <div className="vouchers-list textcenter">
              <div className="vouchers-nav">
                <ul>
                  <li
                    className={activetab == "all" ? "active" : ""}
                    onClick={this.nevTabFun.bind(this, "all")}
                  >
                    <a href={void 0}>All</a>{" "}
                  </li>
                  <li
                    className={activetab == "available" ? "active" : ""}
                    onClick={this.nevTabFun.bind(this, "available")}
                  >
                    <a href={void 0}>
                      Available ({this.state.available_promo_count})
                    </a>{" "}
                  </li>
                  <li
                    className={activetab == "redeemed" ? "active" : ""}
                    onClick={this.nevTabFun.bind(this, "redeemed")}
                  >
                    <a href={void 0}>Redeemed</a>{" "}
                  </li>
                </ul>
              </div>
              <div className="vouchers-list-body">
                {activetab == "all" && this.allVouchersList()}
                {activetab == "available" && this.availableVouchersList()}
                {activetab == "redeemed" && this.redeemedVouchersList()}
              </div>
            </div>
          </div>
        </div>
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
  var promotionlistArr = Array();
  if (Object.keys(state.promotionlist).length > 0) {
    if (state.promotionlist[0].status === "ok") {
      promotionlistArr = state.promotionlist[0].result_set;
    }
  }

  return {
    productlist: productlistArr,
    promotionlist: promotionlistArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProductList: (params) => {
      dispatch({ type: GET_PRODUCT_LIST, params });
    },
    getPromotionList: (params) => {
      dispatch({ type: GET_PROMOTION_LIST, params });
    },
  };
};
export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(withRouter(Vouchers));
