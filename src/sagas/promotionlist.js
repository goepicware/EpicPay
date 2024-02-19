/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_PROMOTION_LIST, SET_PROMOTION_LIST } from "../actions";
import { apiUrl, unquieID, headerconfig } from "../components/Settings/Config";
import Axios from "axios";

export const watchGetPromotionList = function* () {
  yield takeEvery(GET_PROMOTION_LIST, workerGetPromotionList);
};

function* workerGetPromotionList(reqData) {
  try {
    const uri =
      apiUrl +
      "promotion/promotionlist?app_id=" +
      unquieID +
      "" +
      reqData.params;
    const result = yield call(Axios.get, uri, headerconfig);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_PROMOTION_LIST, value: resultArr });
  } catch {
    console.log("Get data failed");
  }
}
