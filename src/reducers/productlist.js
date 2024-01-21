import { SET_PRODUCT_LIST } from "../actions";

const productlist = (state = [], action) => {
  switch (action.type) {
    case SET_PRODUCT_LIST:
      return [...action.value];
    default:
      return state;
  }
};

export default productlist;
