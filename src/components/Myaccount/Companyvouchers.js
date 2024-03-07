/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { IonFooter } from "@ionic/react";
import "@ionic/react/css/core.css";

import cookie from "react-cookies";
import {
  GET_CUSTOMER_DETAILS,
  GET_PRODUCT_LIST,
  GET_PROMOTION_LIST,
} from "../../actions";
import { apiUrl, unquieID, headerconfig } from "../Settings/Config";
import Header from "../Layout/Header";
import coin from "../../common/images/coin.svg";
import noImage from "../../common/images/no-image.jpg";
import gui from "../../common/images/guide.png";

class Vouchers extends Component {
  constructor(props) {
    super(props);

    var vouchersShow =
      cookie.load("vouchers_show") != "" &&
      cookie.load("vouchers_show") != undefined
        ? cookie.load("vouchers_show")
        : "all";

    var vouchersFrom =
      cookie.load("vouchers_from") != "" &&
      cookie.load("vouchers_from") != undefined
        ? cookie.load("vouchers_from")
        : "category";

    var selectedcompanyData =
      localStorage.getItem("selectedcompany_data") === null || unquieID == ""
        ? ""
        : localStorage.getItem("selectedcompany_data");
    selectedcompanyData =
      selectedcompanyData !== "" && selectedcompanyData !== undefined
        ? JSON.parse(selectedcompanyData)
        : [];

    var catApiStatus =
      localStorage.getItem("catApiStatus") === null || unquieID == ""
        ? ""
        : localStorage.getItem("catApiStatus");
    catApiStatus =
      catApiStatus !== "" && catApiStatus !== undefined
        ? JSON.parse(catApiStatus)
        : [];

    this.state = {
      current_page: "Vouchers",
      actionfrom: vouchersFrom,
      activetab: vouchersShow,
      selectedcompany_data: selectedcompanyData,
      category_list: [],
      selected_cate_id: "companycat",
      catapi_status: [],
      proapi_status: "inital",
      productList: [],
      promotionlist: [],
      available_promo_count: 0,
      available_promo: [],
      redeemed_promo: [],
      customerData: [],
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

    if (cookie.load("vouchers_from") !== undefined) {
      cookie.remove("vouchers_from", { path: "/" });
    }

    var customerId = cookie.load("UserId");
    this.props.getCustomerDetails("&customer_id=" + customerId);
    this.props.getProductList("app_id=" + unquieID + "&product_type=5");
    this.props.getPromotionList("&customer_id=" + cookie.load("UserId"));
    this.loadCategory();
  }
  componentDidMount() {
    //$("body").addClass("hide-overlay");
  }
  componentWillReceiveProps(PropsDt) {
    if (this.state.customerData !== PropsDt.customerdetails) {
      this.setState({ customerData: PropsDt.customerdetails });
    }
    if (this.state.productList !== PropsDt.productlist) {
      this.setState({
        productList: PropsDt.productlist,
        proapi_status: "done",
      });
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

  loadCategory() {
    axios
      .get(apiUrl + "companycategory/productcategories", headerconfig)
      .then((res) => {
        if (res.data.status === "ok") {
          let catApiStatusArr = Array();
          res.data.result_set.map((category) => {
            catApiStatusArr["cat_" + category.cate_id] = {
              apistatus: "initail",
              prodata: [],
            };
            return category;
          });
          this.setState(
            {
              category_list: res.data.result_set,
              catapi_status: catApiStatusArr,
            },
            function () {
              this.getCatProductData();
            }
          );
        }
      });
  }

  getCatProductData() {
    let categoryList = this.state.category_list;
    let catapiStatus = this.state.catapi_status;
    if (Object.keys(categoryList).length > 0) {
      const categoryHtml = categoryList.map((category, rwInt) => {
        let catapiData =
          catapiStatus["cat_" + category.cate_id] != undefined &&
          catapiStatus["cat_" + category.cate_id] != ""
            ? catapiStatus["cat_" + category.cate_id]
            : [];
        if (Object.keys(catapiData).length > 0) {
          this.getProductData(category.cate_id);
        }
        return category;
      });
    }
  }

  getProductData(cat_id) {
    let catapiStatus = this.state.catapi_status;
    let catapiData =
      catapiStatus["cat_" + cat_id] != undefined &&
      catapiStatus["cat_" + cat_id] != ""
        ? catapiStatus["cat_" + cat_id]
        : [];
    //showLoaderLst('trans-page-inner','class');
    axios
      .get(
        apiUrl +
          "products/products_list?company_category=" +
          cat_id +
          "&product_type=5",
        headerconfig
      )
      .then((res) => {
        //hideLoaderLst('trans-page-inner','class');
        if (res.data.status === "ok") {
          catapiStatus["cat_" + cat_id] = {
            apistatus: "done",
            prodata: res.data.result_set,
          };
          this.setState({ catapi_status: catapiStatus });
        } else {
          catapiStatus["cat_" + cat_id] = {
            apistatus: "done",
            prodata: Array(),
          };
          this.setState({ catapi_status: catapiStatus });
        }
      });
  }

  nevTabFun(tabTxt, event) {
    event.preventDefault();
    this.setState({ activetab: tabTxt });
  }

  allVouchersList() {
    let selectedCateId = this.state.selected_cate_id;
    if (this.state.proapi_status == "done") {
      let productList = this.state.productList;
      if (Object.keys(productList).length > 0) {
        const productListHtml = productList.map((product, rwInt) => {
          let msnCls = "";
          let proImg =
            product.product_thumbnail != ""
              ? product.product_thumbnail
              : noImage;
          let proName =
            product.product_alias != ""
              ? product.product_alias
              : product.product_name;
          let productPrice =
            product.product_price != "" ? parseFloat(product.product_price) : 0;
          return (
            <li key={rwInt}>
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

        return (
          <ul
            className={selectedCateId == "companycat" ? "" : "display-none-cls"}
          >
            {productListHtml}
          </ul>
        );
      } else {
        return (
          <div
            className={selectedCateId == "companycat" ? "" : "display-none-cls"}
          >
            {" "}
            No Voushers Found{" "}
          </div>
        );
      }
    } else {
      let ulclsNm =
        selectedCateId == "companycat"
          ? "intvl-catlst intvlcatid_companycat"
          : "intvl-catlst intvlcatid_companycat display-none-cls";
      return (
        <ul className={ulclsNm}>
          <li className="intvl-catlst-li loader-main-cls">
            <div className="spinner-border loader-sub-div" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </li>
        </ul>
      );
    }
  }

  catVouchersList() {
    let selectedCateId = this.state.selected_cate_id;
    let categoryList = this.state.category_list;
    let catapiStatus = this.state.catapi_status;
    if (Object.keys(categoryList).length > 0) {
      const categoryListHtml = categoryList.map((category, rwInt) => {
        let catapiData =
          catapiStatus["cat_" + category.cate_id] != undefined &&
          catapiStatus["cat_" + category.cate_id] != ""
            ? catapiStatus["cat_" + category.cate_id]
            : [];
        if (Object.keys(catapiData).length > 0) {
          if (catapiData.apistatus == "done") {
            let productList = catapiData.prodata;
            if (Object.keys(productList).length > 0) {
              const productListHtml = productList.map((product, rwInt3) => {
                let msnCls = "";
                let proImg =
                  product.product_thumbnail != ""
                    ? product.product_thumbnail
                    : noImage;
                let proName =
                  product.product_alias != ""
                    ? product.product_alias
                    : product.product_name;
                let productPrice =
                  product.product_price != ""
                    ? parseInt(product.product_price)
                    : 0;
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

              return (
                <ul
                  className={
                    selectedCateId == category.cate_id ? "" : "display-none-cls"
                  }
                >
                  {productListHtml}
                </ul>
              );
            } else {
              let ulclsNm =
                selectedCateId == category.cate_id
                  ? "intvl-catlst intvlcatid_" + category.cate_id
                  : "intvl-catlst intvlcatid_" +
                    category.cate_id +
                    " display-none-cls";
              return <div className={ulclsNm}> No Voushers Found </div>;
            }
          } else {
            let ulclsNm =
              selectedCateId == category.cate_id
                ? "intvl-catlst intvlcatid_" + category.cate_id
                : "intvl-catlst intvlcatid_" +
                  category.cate_id +
                  " display-none-cls";
            return (
              <ul className={ulclsNm}>
                <li className="intvl-catlst-li loader-main-cls">
                  <div className="spinner-border loader-sub-div" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </li>
              </ul>
            );
          }
        }
      });

      return categoryListHtml;
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
      const availablePromoListHtml = availablePromoLst.map(
        (availablePromo, rwInt) => {
          let msnCls = "";
          let proImg =
            availablePromo.promotion_image !== "" &&
            availablePromo.promotion_image !== null
              ? availablePromo.promotion_image
              : noImage;
          let proName =
            availablePromo.promotion_created_from === "Cron"
              ? availablePromo.promotion_desc
              : availablePromo.promo_code;
          let productPrice =
            availablePromo.promotion_max_amt !== ""
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
        }
      );

      return <ul>{availablePromoListHtml}</ul>;
    } else {
      return <div> No Voushers Found </div>;
    }
  }

  redeemedVouchersList() {
    let redeemedPromoLst = this.state.redeemed_promo;
    if (Object.keys(redeemedPromoLst).length > 0) {
      const redeemedPromoListHtml = redeemedPromoLst.map(
        (redeemedPromo, rwInt) => {
          let msnCls = "";
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
        }
      );

      return <ul>{redeemedPromoListHtml}</ul>;
    } else {
      return <div> No Voushers Found </div>;
    }
  }

  selectedCat(category, event) {
    event.preventDefault();
    let selected_cate_id =
      category == "companycat" ? category : category.cate_id;
    this.setState({ selected_cate_id: selected_cate_id });
  }

  catListing() {
    let categoryList = this.state.category_list;
    let selected_cate_id = this.state.selected_cate_id;
    let selectedcompany_data = this.state.selectedcompany_data;
    if (Object.keys(categoryList).length > 0) {
      let msnClsTxt = selected_cate_id == "companycat" ? "active" : "";
      return (
        <ul>
          {Object.keys(selectedcompany_data).length > 0 && (
            <li
              className={msnClsTxt}
              onClick={this.selectedCat.bind(this, "companycat")}
              key={"01"}
            >
              <a href={void 0}>{selectedcompany_data.company_name}</a>
            </li>
          )}
          {categoryList.map((category, rwInt) => {
            let msnCls = category.cate_id == selected_cate_id ? "active" : "";
            return (
              <li
                className={msnCls}
                onClick={this.selectedCat.bind(this, category)}
                key={rwInt}
              >
                <a href={void 0}>{category.cate_name}</a>
              </li>
            );
          })}
        </ul>
      );
    }
  }

  render() {
    let activetab = this.state.activetab;
    let myAvblPoints = 0;
    let customerData = this.state.customerData;
    if (Object.keys(customerData).length > 0) {
      myAvblPoints =
        customerData.customer_available_points != ""
          ? customerData.customer_available_points
          : 0;
    }
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel">
          <div className="container">
            <div className="vouchers-mypoints">
              <div className="overview">
                <h5>Available Points</h5>
                <h2>
                  {myAvblPoints} <img src={coin} alt="Coin" />
                </h2>
              </div>
              {/*  <span>
                <b>Avbl. Points: </b>
                {myAvblPoints + " "} <img src={coin} />
              </span> */}
            </div>
            <div className="vouchers-hwitw">
              <Link to={"/how-it-works"}>
                <img src={gui} /> <span>How it works</span>
              </Link>
            </div>
            <div className="vouchers-list textcenter">
              <div className="vouchers-nav">
                <ul>
                  <li
                    className={activetab == "all" ? "active" : ""}
                    onClick={this.nevTabFun.bind(this, "all")}
                  >
                    <a href={void 0}>All</a>
                  </li>
                  <li
                    className={activetab == "available" ? "active" : ""}
                    onClick={this.nevTabFun.bind(this, "available")}
                  >
                    <a href={void 0}>
                      Available ({this.state.available_promo_count})
                    </a>
                  </li>
                  <li
                    className={activetab == "redeemed" ? "active" : ""}
                    onClick={this.nevTabFun.bind(this, "redeemed")}
                  >
                    <a href={void 0}>Redeemed</a>
                  </li>
                </ul>
              </div>
              {activetab === "all" && (
                <div className="vouchers-category">
                  <div className="vouchers-cainner">
                    <ul>{this.catListing()}</ul>
                  </div>
                </div>
              )}
              <div className="vouchers-list-body">
                {activetab == "all" && this.allVouchersList()}
                {activetab == "all" && this.catVouchersList()}
                {activetab == "available" && this.availableVouchersList()}
                {activetab == "redeemed" && this.redeemedVouchersList()}
              </div>
            </div>
          </div>
        </div>
        <footer className="footer-main">
          <IonFooter collapse="fade">
            <div className="nav-full-two">
              <a href={void 0} className="active">
                Points Voucher
              </a>
              <a href={void 0}>Buy Voucher</a>
            </div>
          </IonFooter>
        </footer>
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  var customerdetailsArr = Array();
  if (Object.keys(state.customerdetails).length > 0) {
    if (state.customerdetails[0].status === "ok") {
      customerdetailsArr = state.customerdetails[0].result_set;
    }
  }
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
    customerdetails: customerdetailsArr,
    productlist: productlistArr,
    promotionlist: promotionlistArr,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomerDetails: (params) => {
      dispatch({ type: GET_CUSTOMER_DETAILS, params });
    },
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
