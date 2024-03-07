/* eslint-disable */
import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { BulletList } from "react-content-loader";
import Header from "../Layout/Header";
import { GET_SETTINGS } from "../../actions";
import cookie from "react-cookies";
import { showPriceValue } from "../Helpers/SettingHelper";
class TierBenefits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: "Subscription",
      settings: "",
      settingStatus: "",
      enableStoreSubscribe: false,
      showCycleList: false,
      displayCycleList: "",
    };
    if (cookie.load("UserId") === undefined) {
      props.history.push("/");
    }
  }
  componentDidMount() {
    this.props.getSettings();
  }
  componentWillReceiveProps(PropsDt) {
    if (this.state.settings !== PropsDt.settings) {
      this.setState({ settings: PropsDt.settings }, function () {
        this.showStoreSubscription();
      });
    }
    if (this.state.settingStatus !== PropsDt.settingStatus) {
      this.setState({ settingStatus: PropsDt.settingStatus });
    }
  }

  showStoreSubscription() {
    var store_subscription = this.state.settings?.store_subscription
      ? JSON.parse(this.state.settings?.store_subscription)
      : "";
    var subscriptionTypes = [
      "Weekly",
      "Monthly",
      "Quarterly",
      "Biannually",
      "Annually",
    ];
    var displayCycleList = "";
    var enableStoreSubscribe = 0;
    if (subscriptionTypes.length > 0) {
      displayCycleList = subscriptionTypes.map((item) => {
        var subscribe = store_subscription[item.toLowerCase()];
        if (subscribe?.amount !== "") {
          enableStoreSubscribe++;
          return (
            <li>
              <a hre={void 0} onClick={this.selectCycle.bind(this, item)}>
                {item} - {showPriceValue(subscribe?.amount)}
              </a>
            </li>
          );
        }
      });
    }
    this.setState({
      displayCycleList: displayCycleList,
      enableStoreSubscribe: enableStoreSubscribe > 0 ? true : false,
    });
  }
  showCycleList() {
    this.setState({ showCycleList: true });
  }
  selectCycle(cycle) {
    var details = {
      productID: "",
      subscription_cycle: cycle,
      subscribeType: "store",
    };
    this.props.history.push({
      pathname: "/subscription/checkout",
      state: details,
    });
  }

  render() {
    return (
      <div className="main-div">
        <Header mainpagestate={this.state} prntPagePrps={this.props} />

        <div className="rel">
          <div className="container">
            <div className="s-calender-list">
              {this.state.settingStatus === "" ? (
                <BulletList
                  backgroundColor={"#c7c7c7"}
                  foregroundColor={"#c7c7c7"}
                />
              ) : this.state.settings?.enable_subscription === true ? (
                this.state.showCycleList === true ? (
                  <ul>{this.state.displayCycleList}</ul>
                ) : (
                  <ul>
                    <li>
                      <Link to={"/subscription/product"}>
                        Product Subscription
                      </Link>
                    </li>
                    {this.state.enableStoreSubscribe && (
                      <li>
                        <a hre={void 0} onClick={this.showCycleList.bind(this)}>
                          Store Subscription
                        </a>
                      </li>
                    )}
                  </ul>
                )
              ) : (
                <p>No Apicable for Subscription this store</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateTopProps = (state) => {
  var settingsArr = Array();
  var settingStatus = "";
  if (Object.keys(state.settings).length > 0) {
    settingStatus = state.settings[0].status;
    if (state.settings[0].status === "ok") {
      settingsArr = state.settings[0].result;
    }
  }

  return {
    settings: settingsArr,
    settingStatus: settingStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSettings: () => {
      dispatch({ type: GET_SETTINGS });
    },
  };
};
export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(withRouter(TierBenefits));
