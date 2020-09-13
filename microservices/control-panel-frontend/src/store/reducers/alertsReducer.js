import { GET_ALERTS } from '../actions/alertsActions';

const initialState = {
	alerts: [],
	alertChannels: ['hook', 'telegram', 'sms', 'email'],
};

export const alertsReducer = (state = initialState, { action, payload }) => {
	switch (action) {
		case GET_ALERTS:
			return state;

		default:
			return state;
	}
};
