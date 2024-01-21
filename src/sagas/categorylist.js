/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_CATEGORY_LIST, SET_CATEGORY_LIST } from "../actions";
import { apiUrl, unquieID } from "../components/Settings/Config";
import Axios from "axios";

export const watchGetCategoryList = function* () {
  yield takeEvery(GET_CATEGORY_LIST, workerGetCategoryList);
};

function* workerGetCategoryList(reqData) {
  try {
    const uri =
      apiUrl + "catalogs/listcategory?unquieid=" + unquieID + reqData.params;
    const result = yield call(Axios.get, uri);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_CATEGORY_LIST, value: resultArr });
  } catch {
    console.log("Get category failed");
  }
}
