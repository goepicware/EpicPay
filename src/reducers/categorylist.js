import { SET_CATEGORY_LIST } from "../actions";

const categorylist = (state = [], action) => {
  switch (action.type) {
    case SET_CATEGORY_LIST:
      return [...action.value];
    default:
      return state;
  }
};

export default categorylist;
