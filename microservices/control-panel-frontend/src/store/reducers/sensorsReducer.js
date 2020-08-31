import { GET_SENSORS } from '../actions/sensorsActions';

const initialState = {
};

export const sensorsReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_SENSORS:
        return action.payload                
    
      default:
        return state;
    }
}