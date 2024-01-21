import { SET_STATICBLOCKS_LIST } from "../actions";

const staticblocks = (state = [], action) => {
  switch (action.type) {
    case SET_STATICBLOCKS_LIST:
      return [...action.value];
    default:
      return state;
  }
};

export default staticblocks;
