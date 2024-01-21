import { SET_STORE_DETAILS } from "../actions";

const storedetails = (state = [], action) => {
  switch (action.type) {
    case SET_STORE_DETAILS:
      return [...action.value];
    default:
      return state;
  }
};

export default storedetails;
