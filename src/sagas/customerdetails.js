/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_CUSTOMER_DETAILS, SET_CUSTOMER_DETAILS } from "../actions";
import { apiUrl, unquieID, headerconfig } from "../components/Settings/Config";
import Axios from "axios";

export const watchGetCustomerDetails = function* () {
  yield takeEvery(GET_CUSTOMER_DETAILS, workerGetCustomerDetails);
};

function* workerGetCustomerDetails(reqData) {
  try {
    const uri =
      apiUrl +
      "customer/customerdetail?app_id=" +
      unquieID +
      "" +
      reqData.params;
    const result = yield call(Axios.get, uri, headerconfig);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_CUSTOMER_DETAILS, value: resultArr });
  } catch {
    console.log("Get customer details failed");
  }
}
