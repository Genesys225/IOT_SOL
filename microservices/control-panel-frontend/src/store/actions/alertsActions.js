import { rest } from '../../restClient/fetchWrapper';

export const GET_ALERTS = 'GET_ALERTS';
export const GET_SCHEDULE = 'GET_SCHEDULE';
export const CREATE_EVENT = 'CREATE_EVENT';
export const UPDATE_ALERTS = 'UPDATE_ALERTS';
export const DELETE_SCHEDULE_EVENT = 'DELETE_SCHEDULE_EVENT';

export const getAlerts = () => {
	return async (dispatch) => {
		const allAlerts = await rest.get('/getAlerts');
		dispatch({ type: GET_ALERTS, payload: allAlerts });
	};
};

export const updateAlerts = (updatedAlerts, deviceId) => {
	return async (dispatch) => {
		const newAlerts = updatedAlerts.map(async (alert) => {
			const res = await rest.post('/addAlertThreshold', {
				dashboardID: 'All',
				deviceId,
				threshold: alert.threshold,
				op: alert.op,
			});
			console.log({
				dashboardID: 'All',
				deviceId,
				threshold: alert.threshold,
				op: alert.op,
			});
			return res;
			// alert.id = Date.now();
			// return alert;
		});
		console.log(newAlerts);
		dispatch({ type: UPDATE_ALERTS, payload: newAlerts });
	};
};

export const getScheduleEvents = () => {
	return async (dispatch) => {
		const events = await rest.get('/getAllEvents');
		await dispatch({ type: GET_SCHEDULE, payload: events });
		console.log(events);
	};
};

export const deleteScheduleEvent = (title) => {
	return async (dispatch) => {
		const res = await rest.post('/deleteScheduleEvent', {
			title,
		});
		console.log(res);
		dispatch({ type: DELETE_SCHEDULE_EVENT, payload: title });
	};
};

export const setScheduleEvent = (
	{ title, deviceId, roomId, startDate, endDate },
	edit = false
) => {
	return async (dispatch) => {
		console.log({
			title,
			deviceId,
			roomId,
			startDate,
			endDate,
			edit,
		});
		const response = await rest.post('/setTimingStartEnd', {
			edit,
			title,
			deviceId,
			roomId,
			startDate,
			endDate,
		});
		console.log(response);
		dispatch({ type: 'non' });
	};
};
