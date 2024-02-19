import customerdetails from "./customerdetails";
import missionslist from "./missionslist";
import rewardsettingslist from "./rewardsettingslist";
import staticblocks from "./staticblocks";
import topupplanlist from "./topupplanlist";
import productlist from "./productlist";
import promotionlist from "./promotionlist";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  customerdetails: customerdetails,
  missionslist: missionslist,
  rewardsettingslist: rewardsettingslist,
  staticblocks: staticblocks,
  topupplanlist: topupplanlist,
  productlist: productlist,
  promotionlist: promotionlist,
});

export default rootReducer;
