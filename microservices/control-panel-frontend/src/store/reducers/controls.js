import { SEND_COMMAND } from '../actions/controls';

const initialState = {
	switched: [],
};

export const controlsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case SEND_COMMAND:
			const updatedState = { ...state };
			if (payload.command === 'on')
				updatedState.switched.push(payload.id);
			else
				updatedState.switched = updatedState.switched.filter(
					(deviceId) => deviceId !== payload.id
				);

			return updatedState;

		default:
			return state;
	}
};
