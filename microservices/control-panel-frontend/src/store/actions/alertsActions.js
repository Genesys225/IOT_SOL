export const GET_ALERTS = 'GET_ALERTS';
export const UPDATE_ALERTS = 'GET_ALERTS';

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
			// return await res.json();
			// alert.id = Date.now();
			// return alert;
		});
		// console.log(await newAlerts);
		dispatch({ type: GET_ALERTS, payload: newAlerts });
	};
};
