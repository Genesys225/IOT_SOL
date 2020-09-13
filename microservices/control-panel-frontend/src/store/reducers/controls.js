import { SEND_COMMAND } from '../actions/controls';

const initialState = {
	allActionParticipants: [
		{
			switchId: 'SOL-14:11:16:11:11:11/switch-0',
			currentState: 'OFF',
		},
		{
			switchId: 'SOL-14:11:16:11:11:11/switch-1',
			currentState: 'OFF',
		},
		{
			switchId: 'SOL-14:11:16:11:11:11/switch-2',
			currentState: 'OFF',
		},
	],
	assignedActionParticipants: [],
	alertsHistory: [],
};

export const controlsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case SEND_COMMAND:
			const updatedState = { ...state };
			updatedState.alertsHistory.push(payload);
			return updatedState;

		default:
			return state;
	}
};
