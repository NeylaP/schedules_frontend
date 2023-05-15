import { createStore, combineReducers } from "redux";

function loginReducer(state = {}, action) {
    switch (action.type) {
      case 'LOGIN':
        return {
          ...state,
          isLoggedIn: true,
          user: action.payload,
        };
      case 'LOGOUT':
        return {
          ...state,
          isLoggedIn: false,
          user: null,
        };
      default:
        return state;
    }
  }
  
  function SchedulesReducer(state = [], action) {
    switch (action.type) {
      case 'ADD_ROW':
        return [...state, action.payload];
      case 'REMOVE_ROW':
        return state.filter((row) => row.id !== action.payload.id);
      default:
        return state;
    }
  }

const reducer = combineReducers({
    loginReducer,
    SchedulesReducer,
});

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;