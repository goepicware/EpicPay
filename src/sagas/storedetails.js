/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_STORE_DETAILS, SET_STORE_DETAILS } from "../actions";
import { apiUrl, unquieID } from "../components/Settings/Config";
import Axios from "axios";

export const watchGetStoreDetails = function* () {
  yield takeEvery(GET_STORE_DETAILS, workerGetStoreDetails);
};

function* workerGetStoreDetails(reqData) {
  try {
    const uri =
      apiUrl + "store/storeDetails?unquieid=" + unquieID + "" + reqData.params;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_STORE_DETAILS, value: resultArr });
  } catch {
    console.log("Get store details failed");
  }
}
