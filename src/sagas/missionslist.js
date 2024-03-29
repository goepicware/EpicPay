/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_MISSIONS_LIST, SET_MISSIONS_LIST } from "../actions";
import { apiUrl, headerconfig } from "../components/Settings/Config";
import Axios from "axios";

export const watchGetMissionsList = function* () {
  yield takeEvery(GET_MISSIONS_LIST, workerGetMissionsList);
};

function* workerGetMissionsList(reqData) {
  try {
    const uri = apiUrl + "missions/missionslist?" + reqData.params;
    const result = yield call(Axios.get, uri, headerconfig);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_MISSIONS_LIST, value: resultArr });
  } catch {
    console.log("Get data failed");
  }
}
