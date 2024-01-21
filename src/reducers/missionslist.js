import { SET_MISSIONS_LIST } from "../actions";

const missionslist = (state = [], action) => {
  switch (action.type) {
    case SET_MISSIONS_LIST:
      return [...action.value];
    default:
      return state;
  }
};

export default missionslist;
