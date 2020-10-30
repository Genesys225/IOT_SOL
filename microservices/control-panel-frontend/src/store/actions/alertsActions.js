import { rest } from '../../restClient/fetchWrapper';
export const COMMIT_ALERTS = 'COMMIT_ALERTS';
export const COMMIT_FINISHED = 'COMMIT_FINISHED';
export const INIT_ALERT_CREATION = 'INIT_ALERT_CREATION';
export const UPDATE_NEW_ALERT = 'UPDATE_NEW_ALERT';
export const UPDATE_EXISTING_ALERT = 'UPDATE_EXISTING_ALERT';
export const GET_ALERTS = 'GET_ALERTS';
export const UPDATE_ALERTS = 'UPDATE_ALERTS';

export const fetchRoomAlerts = (roomId) => {
	return async (dispatch) => {
		const roomObj = await rest.get(`/getRoom/${roomId}`);
		const allAlerts = roomObj.dashboard.panels.filter((device) => {
			if (device.alert) device.roomId = roomId;
			return !!device.alert;
		});
		dispatch({ type: GET_ALERTS, payload: allAlerts });
	};
};

export const updateAlerts = (updatedAlerts, deviceId, roomId) => {
	return async (dispatch) => {
		const newAlerts = updatedAlerts.map(async (alert) => {
			const { params, type } = alert.conditions[0].evaluator;
			const res = await rest.post('/addAlertThreshold', {
				dashboardID: roomId,
				deviceId,
				threshold: parseInt(params[0]),
				op: type,
			});
			console.log({
				dashboardID: roomId,
				deviceId,
				threshold: parseInt(params[0]),
				op: type,
			});
			return res;
			// alert.id = Date.now();
			// return alert;
		});
		dispatch({ type: UPDATE_ALERTS, payload: newAlerts });
	};
};
