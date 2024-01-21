import { SET_REWARDSETTING_LIST } from "../actions";

const rewardsettingslist = (state = [], action) => {
  switch (action.type) {
    case SET_REWARDSETTING_LIST:
      return [...action.value];
    default:
      return state;
  }
};

export default rewardsettingslist;
