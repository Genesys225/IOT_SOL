import { GET_ALERTS } from '../actions/alertsActions';

const initialState = {
	alerts: [],
	alertChannels: ['hook', 'telegram', 'sms', 'email'],
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

export const alertsReducer = (state = initialState, { action, payload }) => {
	switch (action) {
		case GET_ALERTS:
			return { ...state, alerts: payload };
		case GET_ALERTS:
			const updatedState = { ...state };
			updatedState.alertsHistory.push(payload);
			return updatedState;

		default:
			return state;
	}
};
