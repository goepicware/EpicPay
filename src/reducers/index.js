import customerdetails from "./customerdetails";
import missionslist from "./missionslist";
import rewardsettingslist from "./rewardsettingslist";
import staticblocks from "./staticblocks";
import topupplanlist from "./topupplanlist";
import storelist from "./storelist";
import storedetails from "./storedetails";
import categorylist from "./categorylist";
import productlist from "./productlist";
import productdetail from "./productdetail";
import promotionlist from "./promotionlist";

import listdata from "./listdata";
import detaildata from "./detaildata";
import formpost from "./formpost";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  customerdetails: customerdetails,
  missionslist: missionslist,
  rewardsettingslist: rewardsettingslist,
  staticblocks: staticblocks,
  topupplanlist: topupplanlist,
  storelist: storelist,
  storedetails: storedetails,
  categorylist: categorylist,
  productlist: productlist,
  productdetail: productdetail,
  promotionlist: promotionlist,
  listdata: listdata,
  detaildata: detaildata,
  formpost: formpost,
});

export default rootReducer;
