/* eslint-disable */
import { takeEvery, call, put } from "redux-saga/effects";
import { GET_PRODUCT_LIST, SET_PRODUCT_LIST } from "../actions";
import { apiUrl, headerconfig } from "../components/Settings/Config";
import Axios from "axios";

export const watchGetProductList = function* () {
  yield takeEvery(GET_PRODUCT_LIST, workerGetProductList);
};

function* workerGetProductList(reqData) {
  try {
    const uri = apiUrl + "products/products_list?" + reqData.params;
    const result = yield call(Axios.get, uri, headerconfig);
    var resultArr = [];
    resultArr.push(result.data);
    yield put({ type: SET_PRODUCT_LIST, value: resultArr });
  } catch {
    console.log("Get Product failed");
  }
}
