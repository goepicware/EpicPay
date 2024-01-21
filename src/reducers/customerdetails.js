import { SET_CUSTOMER_DETAILS } from "../actions";

const customerdetails = (state = [], action) => {
  switch (action.type) {
    case SET_CUSTOMER_DETAILS:
      return [...action.value];
    default:
      return state;
  }
};

export default customerdetails;
