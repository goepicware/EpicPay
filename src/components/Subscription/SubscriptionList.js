/* eslint-disable */
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import cookie from "react-cookies";
import { Facebook } from "react-content-loader";
import { GET_PRODUCT_LIST } from "../../actions";
import Header from "../Layout/Header";
import noImage from "../../common/images/no-image.jpg";

class SubscriptionList extends Component {
  constructor(props) {
    super(props);
    console.log(this.props, "this.props");
    this.state = {
      current_page: "Subscription",
      proapi_status: "inital",
      productList: [],
    };
    if (cookie.load("UserId") === undefined) {
      props.history.push("/");
    }
    this.props.getProductList("product_type=6");
  }

  componentWillReceiveProps(PropsDt) {
    if (this.state.productList !== PropsDt.productlist) {
      this.setState({
        productList: PropsDt.productlist,
        proapi_status: "done",
      });
    }
  }

  allSubscribeList() {
    if (this.state.proapi_status == "done") {
      let productList = this.state.productList;
      if (Object.keys(productList).length > 0) {
        const productListHtml = productList.map((product, rwInt) => {
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
                <Link
                  to={
                    "/subscription/" +
                    this.props.match?.params?.subscribeType +
                    "/" +
                    product.product_slug
                  }
                  title="Subscription View"
                  className="button"
                >
                  Subscribe
                </Link>
              </figcaption>
            </li>
          );
        });

        return <ul>{productListHtml}</ul>;
      } else {
        return <div> No Voushers Found </div>;
      }
    } else {
      return (
        <div>
          <Facebook backgroundColor={"#c7c7c7"} foregroundColor={"#c7c7c7"} />
          <Facebook backgroundColor={"#c7c7c7"} foregroundColor={"#c7c7c7"} />
        </div>
      );
    }
  }

  render() {
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />
        <div className="rel">
          <div className="container">
            <div className="vouchers-list textcenter">
              <div className="vouchers-list-body subscribe-item">
                {this.allSubscribeList()}
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
)(withRouter(SubscriptionList));
