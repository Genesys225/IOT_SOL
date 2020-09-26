import { GET_SCHEDULE, UPDATE_ALERTS } from '../actions/alertsActions';

const initialState = {
	alerts: [],
	schedules: [],
	alertChannels: ['hook', 'telegram', 'sms', 'email'],
	allActionParticipants: [],
	assignedActionParticipants: [],
	alertsHistory: [],
};

export const alertsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case GET_SCHEDULE:
			return { ...state, alerts: payload };
		case UPDATE_ALERTS:
			const updatedState = { ...state };
			updatedState.alertsHistory.push(payload);
			return updatedState;

		default:
			return state;
	}
};
