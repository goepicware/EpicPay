/* eslint-disable */
import { all } from "redux-saga/effects";
import { watchGetCustomerDetails } from "./customerdetails";
import { watchGetMissionsList } from "./missionslist";
import { watchGetRewardSettingList } from "./rewardsettingslist";
import { watchGetStaticblocksList } from "./staticblocks";
import { watchGetTopupplanList } from "./topupplanlist";
import { watchGetPromotionList } from "./promotionlist";
import { watchGetProductList } from "./productlist";

export default function* () {
  yield all([
    watchGetCustomerDetails(),
    watchGetMissionsList(),
    watchGetRewardSettingList(),
    watchGetStaticblocksList(),
    watchGetTopupplanList(),
    watchGetPromotionList(),
    watchGetProductList(),
  ]);
}
