/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_STATICBLOCKS_LIST, SET_STATICBLOCKS_LIST } from "../actions";
import { apiUrl, unquieID } from "../components/Settings/Config";
import Axios from "axios";

export const watchGetStaticblocksList = function* () {
  yield takeEvery(GET_STATICBLOCKS_LIST, workerGetStaticblocksList);
};

function* workerGetStaticblocksList(reqData) {
  try {
    const uri =
      apiUrl + "cms/staticblocks?app_id=" + unquieID + "" + reqData.params;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_STATICBLOCKS_LIST, value: resultArr });
  } catch {
    console.log("Get data failed");
  }
}
