/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_TOPUPPLAN_LIST, SET_TOPUPPLAN_LIST } from "../actions";
import { apiUrl, unquieID } from "../components/Settings/Config";
import Axios from "axios";

export const watchGetTopupplanList = function* () {
  yield takeEvery(GET_TOPUPPLAN_LIST, workerGetTopupplanList);
};

function* workerGetTopupplanList(reqData) {
  try {
    const uri =
      apiUrl + "topupplan/planlist?app_id=" + unquieID + "" + reqData.params;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_TOPUPPLAN_LIST, value: resultArr });
  } catch {
    console.log("Get data failed");
  }
}
