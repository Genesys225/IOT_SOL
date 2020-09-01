import { GET_SENSORS, LAST_SENSORS_DATA } from '../actions/sensorsActions';

const initialState = [];

export const sensorsReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_SENSORS:
			return action.payload;
		case LAST_SENSORS_DATA:
			return state;

		default:
			return state;
	}
};
