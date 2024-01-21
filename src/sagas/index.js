/* eslint-disable */
import { all } from "redux-saga/effects";
import { watchGetCustomerDetails } from "./customerdetails";
import { watchGetMissionsList } from "./missionslist";
import { watchGetRewardSettingList } from "./rewardsettingslist";
import { watchGetStaticblocksList } from "./staticblocks";
import { watchGetTopupplanList } from "./topupplanlist";
import { watchGetPromotionList } from "./promotionlist";
import { watchGetStoreList } from "./storelist";
import { watchGetStoreDetails } from "./storedetails";
import { watchGetCategoryList } from "./categorylist";
import { watchGetProductList } from "./productlist";
import { watchGetProductDetail } from "./productdetail";
import { watchGetListData } from "./listdata";
import { watchGetDetailData } from "./detaildata";
import { watchGetFormPost } from "./formpost";

export default function* () {
  yield all([
    watchGetCustomerDetails(),
    watchGetMissionsList(),
    watchGetRewardSettingList(),
    watchGetStaticblocksList(),
    watchGetTopupplanList(),
    watchGetPromotionList(),
    watchGetStoreList(),
    watchGetStoreDetails(),
    watchGetCategoryList(),
    watchGetProductList(),
    watchGetProductDetail(),
    watchGetListData(),
    watchGetDetailData(),
    watchGetFormPost(),
  ]);
}
