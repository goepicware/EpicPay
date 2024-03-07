/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_SETTINGS, SET_SETTINGS } from "../actions";
import { apiUrl, unquieID, headerconfig } from "../components/Settings/Config";
import Axios from "axios";

export const watchGetSetting = function* () {
  yield takeEvery(GET_SETTINGS, workerGetSetting);
};

function* workerGetSetting() {
  try {
    const uri = apiUrl + "settings/getSettings?unquieID=" + unquieID;
    const result = yield call(Axios.get, uri, headerconfig);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_SETTINGS, value: resultArr });
  } catch {
    console.log("Get data failed");
  }
}
