/* eslint-disable */
import { push } from "react-router-redux";
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_PRODUCT_DETAIL, SET_PRODUCT_DETAIL } from "../actions";
import { unquieID, apiUrl } from "../components/Settings/Config";
import Axios from "axios";
import cookie from "react-cookies";
import { format } from "date-fns";

export const watchGetProductDetail = function* () {
  yield takeEvery(GET_PRODUCT_DETAIL, workerGetProductDetail);
};

function* workerGetProductDetail({ proSlug }) {
  try {
    var availabilityId =
      cookie.load("defaultAvilablityId") === undefined ||
      cookie.load("defaultAvilablityId") == ""
        ? ""
        : cookie.load("defaultAvilablityId");
    var outlet =
      cookie.load("orderOutletId") !== undefined &&
      cookie.load("orderOutletId") !== "undefined" &&
      cookie.load("orderOutletId") !== ""
        ? cookie.load("orderOutletId")
        : "";
    var userID =
      cookie.load("UserId") !== "" &&
      typeof cookie.load("UserId") !== undefined &&
      typeof cookie.load("UserId") !== "undefined"
        ? "&fav_cust_id=" + cookie.load("UserId")
        : "";
    var deliveryDate =
      cookie.load("deliveryDate") == undefined ||
      cookie.load("deliveryDate") == ""
        ? ""
        : cookie.load("deliveryDate").split("/");
    var delivery_Date = "";
    if (deliveryDate !== "") {
      delivery_Date =
        deliveryDate[2] + "-" + deliveryDate[1] + "-" + deliveryDate[0];
    } else {
      delivery_Date = format(new Date(), "yyyy-MM-dd");
    }
    var spicelPride =
      "&specialprice_applicable=orderdate&order_datetxt=" + delivery_Date;
    const uri =
      apiUrl +
      "catalogs/productdetails?unquieid=" +
      unquieID +
      "&product_slug=" +
      proSlug +
      "&availability=" +
      availabilityId +
      "&outlet=" +
      outlet +
      userID +
      spicelPride;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_PRODUCT_DETAIL, value: resultArr });
  } catch {
    console.log("Get Products Failed");
  }
}
