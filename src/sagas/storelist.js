/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_STORE_LIST, SET_STORE_LIST } from "../actions";
import { apiUrl, unquieID } from "../components/Settings/Config";
import Axios from "axios";

export const watchGetStoreList = function* () {
  yield takeEvery(GET_STORE_LIST, workerGetStoreList);
};

function* workerGetStoreList(reqData) {
  try {
    const uri =
      apiUrl + "store/listStore?unquieid=" + unquieID + "" + reqData.params;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_STORE_LIST, value: resultArr });
  } catch {
    console.log("Get data failed");
  }
}
