import {
	COMMIT_ALERTS,
	COMMIT_FINISHED,
	GET_ALERTS,
	UPDATE_ALERTS,
	UPDATE_EXISTING_ALERT,
	UPDATE_NEW_ALERT,
} from '../actions/alertsActions';

const initialState = {
	alerts: [],
	schedules: [],
	controlledParticipants: [],
	alertChannels: ['hook', 'telegram', 'sms', 'email'],
	allActionParticipants: [],
	assignedActionParticipants: [],
	alertsHistory: [],
	creating: false,
	updatedAlertsToCommit: [],
};

export const alertsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case UPDATE_NEW_ALERT:
			const { op, threshold, deviceId } = payload;
			let updatedAlerts = {};
			const currentDevice = state.alerts.find(
				(alert) => alert.deviceId === deviceId
			);
			if (op) {
				updatedAlerts = {
					params: currentDevice
						? currentDevice.conditions[0].evaluator.params
						: [],
					type: op,
				};
			} else if (threshold) {
				updatedAlerts = {
					type: currentDevice
						? currentDevice.conditions[0].evaluator.type
						: 'gt',
					params: [threshold],
				};
			}
			const alertIndex = state.alerts.findIndex(
				(alert) => alert.deviceId === deviceId
			);
			if (alertIndex) {
				const currentAlerts = [...state.alerts];
				currentAlerts[alertIndex] = {
					...state.alerts[alertIndex],
					conditions: [{ evaluator: updatedAlerts }],
				};
				return {
					...state,
					alerts: currentAlerts,
				};
			}
			return {
				...state,
				alerts: [
					...state.alerts,
					{
						conditions: [{ evaluator: updatedAlerts }],
						deviceId,
					},
				],
			};

		case UPDATE_EXISTING_ALERT: {
			const updatedAlerts = state.alerts.map((alert) =>
				alert.id === payload.id ? { ...payload, edited: true } : alert
			);
			return { ...state, alerts: updatedAlerts };
		}

		case COMMIT_ALERTS:
			const updatedAlertsToCommit = state.alerts;
			return { ...state, updatedAlertsToCommit };

		case COMMIT_FINISHED:
			return {
				...state,
				updatedAlertsToCommit: [],
			};
		case GET_ALERTS:
			if (payload.length > 0) {
				let updatedAlerts = [
					...state.alerts,
					...payload.map((alertDevice) => {
						const newAlertObj = alertDevice.alert;
						newAlertObj.deviceId = alertDevice.uid;
						newAlertObj.roomId = alertDevice.roomId;
						return newAlertObj;
					}),
				];
				const alertDevices = Array.from(
					new Set(
						updatedAlerts
							.filter((alert) => !!alert)
							.map((alertDevice) => alertDevice.deviceId)
					)
				);
				updatedAlerts = alertDevices.map((deviceId) =>
					updatedAlerts.find((device) => device.deviceId === deviceId)
				);
				return {
					...state,
					alerts: updatedAlerts,
				};
			} else return state;
		case UPDATE_ALERTS:
			const updatedState = { ...state };
			updatedState.alertsHistory.push(payload);
			return updatedState;

		default:
			return state;
	}
};
