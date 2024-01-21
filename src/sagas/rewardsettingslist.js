/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_REWARDSETTING_LIST, SET_REWARDSETTING_LIST } from "../actions";
import { apiUrl, unquieID } from "../components/Settings/Config";
import Axios from "axios";

export const watchGetRewardSettingList = function* () {
  yield takeEvery(GET_REWARDSETTING_LIST, workerGetRewardSettingList);
};

function* workerGetRewardSettingList(reqData) {
  try {
    const uri =
      apiUrl + "rewardsettings/rewardslist?app_id=" + unquieID + "" + reqData.params;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_REWARDSETTING_LIST, value: resultArr });
  } catch {
    console.log("Get data failed");
  }
}
