import { SET_TOPUPPLAN_LIST } from "../actions";

const topupplanlist = (state = [], action) => {
  switch (action.type) {
    case SET_TOPUPPLAN_LIST:
      return [...action.value];
    default:
      return state;
  }
};

export default topupplanlist;
