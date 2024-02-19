/* eslint-disable */
import React, { Component } from "react";
import axios from "axios";
import Header from "../Layout/Header";
import cookie from "react-cookies";
import { apiUrl, unquieID, headerconfig } from "../Settings/Config";
import { showLoaderLst, hideLoaderLst } from "../Helpers/SettingHelper";
import coin from "../../common/images/coin.svg";
var qs = require("qs");
class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "History",
      activetab: "transaction",
      transactionList: [],
      toppupList: [],
      bannerList: [],
    };

    if (cookie.load("UserId") === undefined) {
      props.history.push("/");
    }

    if (unquieID == "") {
      props.history.push("/home");
    }

    this.getTransData();
    this.getToppupData();
  }

  getTransData() {
    var postObject = {
      app_id: unquieID,
      customer_id: cookie.load("UserId"),
    };
    showLoaderLst("trans-page-inner", "class");
    axios
      .post(
        apiUrl + "customer/cust_transaction",
        qs.stringify(postObject),
        headerconfig
      )
      .then((res) => {
        hideLoaderLst("trans-page-inner", "class");
        if (res.data.status === "ok") {
          this.setState({ transactionList: res.data.result });
        } else {
          this.setState({ transactionList: Array() });
        }
      });
  }

  getToppupData() {
    var postObject = {
      app_id: unquieID,
      customer_id: cookie.load("UserId"),
    };
    axios
      .post(
        apiUrl + "customer/topuphistory",
        qs.stringify(postObject),
        headerconfig
      )
      .then((res) => {
        if (res.data.status === "ok") {
          this.setState({ toppupList: res.data.result });
        } else {
          this.setState({ toppupList: Array() });
        }
      });
  }

  componentDidMount() {
    $("body").addClass("hide-overlay");
  }

  nevTabFun(tabTxt, event) {
    event.preventDefault();
    this.setState({ activetab: tabTxt });
  }

  transactionList() {
    let transactionList = this.state.transactionList;
    if (Object.keys(transactionList).length > 0) {
      const transactionListHtml = transactionList.map((transaction, rwInt) => {
        let msnCls = "";
        return (
          <li>
            <div className="hlm-lhs">
              {transaction.transaction_qr_type == "products" ? (
                <p>{transaction.transaction_product_name}</p>
              ) : (
                <p>Credits ( direct pay )</p>
              )}
              <span>{transaction.transaction_created_on}</span>
            </div>
            <div className="hlm-rhs">
              <strong>
                {transaction.transaction_qr_type == "products" ? (
                  <>
                    {transaction.transaction_qr_usered_amount}{" "}
                    <img src={coin} />
                  </>
                ) : (
                  <>${transaction.transaction_qr_usered_amount}</>
                )}
              </strong>
            </div>
          </li>
        );
      });

      return <ul>{transactionListHtml}</ul>;
    } else {
      return <div> No History Of Transactions </div>;
    }
  }

  walletToppupList() {
    let toppupList = this.state.toppupList;
    if (Object.keys(toppupList).length > 0) {
      const toppupListHtml = toppupList.map((toppup, rwInt) => {
        let msnCls = "";
        return (
          <li>
            <div className="hlm-lhs">
              <p>{toppup.wallettopup_display_name}</p>
              <span>{toppup.wallettopup_created_on}</span>
            </div>
            <div className="hlm-rhs">
              <strong>${toppup.wallettopup_total_amount}</strong>
              <span>{toppup.wallettopup_total_credits} credits</span>
            </div>
          </li>
        );
      });

      return <ul>{toppupListHtml}</ul>;
    } else {
      return <div> No History Of Wallet Toppup </div>;
    }
  }

  render() {
    let activetab = this.state.activetab;
    return (
      <div className="main-div trans-page-inner">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel">
          <div className="container">
            <div className="history-list">
              <div className="vouchers-nav">
                <ul>
                  <li
                    className={activetab == "transaction" ? "active" : ""}
                    onClick={this.nevTabFun.bind(this, "transaction")}
                  >
                    <a href="#">Transactions</a>{" "}
                  </li>
                  <li
                    className={activetab == "toppup" ? "active" : ""}
                    onClick={this.nevTabFun.bind(this, "toppup")}
                  >
                    <a href="#">Wallet Top up</a>{" "}
                  </li>
                </ul>
              </div>

              <div className="history-filter"></div>
              <div className="history-list-main">
                {activetab == "transaction" && this.transactionList()}
                {activetab == "toppup" && this.walletToppupList()}

                {/*<ul>
                  <li>
                    <div className="hlm-lhs" style={{textAlign:"center",width:"100%"}}>
                      <p>&nbsp;</p>
                      <span>No History Of Transactions</span>
                    </div>
                  </li>
                </ul>*/}
                {/*<ul>
                  <li>
                    <div className="hlm-lhs">
                      <p>Wallet Topup</p>
                      <span>23/10/2023</span>
                    </div>
                    <div className="hlm-rhs">
                      <strong>$150</strong>
                    </div>
                  </li>
                  <li>
                    <div className="hlm-lhs">
                      <p>Purchased $8 off cash voucher</p>
                      <span>23/10/2023</span>
                    </div>
                    <div className="hlm-rhs">
                      <strong>
                        1000 <img src={coin} />
                      </strong>
                    </div>
                  </li>
                  <li>
                    <div className="hlm-lhs">
                      <p>Wallet Topup</p>
                      <span>23/10/2023</span>
                    </div>
                    <div className="hlm-rhs">
                      <strong>$100</strong>
                    </div>
                  </li>
                  <li>
                    <div className="hlm-lhs">
                      <p>Purchased $10 off cash voucher</p>
                      <span>23/10/2023</span>
                    </div>
                    <div className="hlm-rhs">
                      <strong>
                        1500 <img src={coin} />
                      </strong>
                    </div>
                  </li>
                  <li>
                    <div className="hlm-lhs">
                      <p>Purchased Chicken Rice voucher</p>
                      <span>23/10/2023</span>
                    </div>
                    <div className="hlm-rhs">
                      <strong>
                        2000 <img src={coin} />
                      </strong>
                    </div>
                  </li>
                </ul>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default History;
