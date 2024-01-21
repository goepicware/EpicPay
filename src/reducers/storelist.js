import { SET_STORE_LIST } from "../actions";

const storelist = (state = [], action) => {
  switch (action.type) {
    case SET_STORE_LIST:
      return [...action.value];
    default:
      return state;
  }
};

export default storelist;
