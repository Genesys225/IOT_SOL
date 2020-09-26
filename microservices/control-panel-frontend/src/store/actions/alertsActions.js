export const GET_ALERTS = 'GET_ALERTS';
export const GET_SCHEDULE = 'GET_SCHEDULE';
export const CREATE_EVENT = 'CREATE_EVENT';
export const UPDATE_ALERTS = 'UPDATE_ALERTS';
export const DELETE_SCHEDULE_EVENT = 'DELETE_SCHEDULE_EVENT';

export const getAlerts = () => {
	return async (dispatch) => {
		const res = await fetch('/getAlerts');
		const allAlerts = await res.json();
		dispatch({ type: GET_ALERTS, payload: allAlerts });
	};
};

export const updateAlerts = (updatedAlerts, deviceId) => {
	return async (dispatch) => {
		const newAlerts = updatedAlerts.map(async (alert) => {
			const res = await fetch('/addAlertThreshold', {
				method: 'POST',
				body: JSON.stringify({
					dashboardID: 'All',
					deviceId,
					threshold: alert.threshold,
					op: alert.op,
				}),
				headers: { 'Content-Type': 'application/json' },
			});
			console.log({
				dashboardID: 'All',
				deviceId,
				threshold: alert.threshold,
				op: alert.op,
			});
			return await res.json();
			// alert.id = Date.now();
			// return alert;
		});
		console.log(newAlerts);
		dispatch({ type: UPDATE_ALERTS, payload: newAlerts });
	};
};

export const getScheduleEvents = () => {
	return async (dispatch) => {
		const response = await fetch('/getAllEvents');
		if (response.status === 200) {
			try {
				const events = await response.json();
				events.length > 0 &&
					dispatch({ type: GET_SCHEDULE, payload: events });
			} catch (error) {
				console.log(error);
			}
		}
	};
};

export const deleteScheduleEvent = (title) => {
	return async (dispatch) => {
		const res = await fetch('/deleteScheduleEvent', {
			method: 'POST',
			body: JSON.stringify({
				title,
			}),
			headers: { 'Content-Type': 'application/json' },
		});
		console.log({ title });
		try {
			console.log(await res.json());
		} catch (error) {
			console.log(error);
		}

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
		const response = await fetch('/setTimingStartEnd', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				edit,
				title,
				deviceId,
				roomId,
				startDate,
				endDate,
			}),
		});
		if (response.status === 200) {
			try {
				const resJson = await response.json();
				console.log(resJson);
			} catch (error) {
				console.log(error);
			}
		}
	};
};
