import { SEND_COMMAND, REGISTER_DEVICE } from '../actions/controls';

const initialState = {
	switchesAvailable: [],
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
		case REGISTER_DEVICE: {
			const updatedState = { ...state };
			if (
				updatedState.switchesAvailable.findIndex(
					(device) => device.uid === payload.uid
				) === -1
			) updatedState.switchesAvailable.push(payload)
				return updatedState;
		}
		default:
			return state;
	}
};
