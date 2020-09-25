import { GET_ALERTS, UPDATE_ALERTS } from '../actions/alertsActions';

const initialState = {
	alerts: [],
	schedules: [],
	alertChannels: ['hook', 'telegram', 'sms', 'email'],
	allActionParticipants: [],
	assignedActionParticipants: [],
	alertsHistory: [],
};

export const alertsReducer = (state = initialState, { action, payload }) => {
	switch (action) {
		case GET_ALERTS:
			return { ...state, alerts: payload };
		case UPDATE_ALERTS:
			const updatedState = { ...state };
			updatedState.alertsHistory.push(payload);
			return updatedState;

		default:
			return state;
	}
};
