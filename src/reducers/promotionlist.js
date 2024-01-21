import { SET_PROMOTION_LIST } from "../actions";

const promotionlist = (state = [], action) => {
  switch (action.type) {
    case SET_PROMOTION_LIST:
      return [...action.value];
    default:
      return state;
  }
};

export default promotionlist;
