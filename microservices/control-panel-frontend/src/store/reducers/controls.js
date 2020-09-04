import { SEND_COMMAND } from '../actions/controls';

const initialState = [];

export const controlsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case SEND_COMMAND:
			return [...state, payload];

		default:
			return state;
	}
};
