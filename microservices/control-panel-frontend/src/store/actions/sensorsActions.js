export const GET_SENSORS = 'GET_SENSORS';
export const LAST_SENSORS_DATA = 'LAST_SENSORS_DATA';
export const UPDATE_SENSOR = 'UPDATE_SENSOR';
export const UPDATE_ROOM = 'UPDATE_ROOM';

export const getSensors = () => {
	return async (dispatch) => {
		const res = await fetch('/getAllPanels');
		const allPanels = await res.json();
		dispatch({ type: GET_SENSORS, payload: allPanels });
	};
};

export const getLastData = () => {
	return async (dispatch) => {
		const res = await fetch('/getLastData');
		const allSensorsData = await res.json();
		if (allSensorsData.length > 0)
			dispatch({ type: LAST_SENSORS_DATA, payload: allSensorsData });
		return 'SUCCESS';
	};
};

export const updateSensor = ({ id, meta }) => {
	return async (dispatch) => {
		const res = await fetch('/updateSensor', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id, meta }),
		});
		const resObj = await res.json();
		console.log(JSON.stringify({ id, meta }));
		console.log(resObj);
		if (res.status === 200)
			dispatch({ type: UPDATE_SENSOR, payload: { id, meta } });
	};
};

export const updateDeviceZone = ({ idFrom, idTo, deviceId }) => {
	return async (dispatch) => {
		const res = await fetch('/addDeviceFromDashboardToDashboard', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				idFrom,
				idTo,
				deviceId,
			}),
		});

		if (res.status !== 200) return false;

		console.log(
			JSON.stringify({
				idFrom,
				idTo,
				deviceId,
			})
		);
		if (res.status === 200)
			dispatch({
				type: UPDATE_ROOM,
				payload: { id: deviceId, room: idTo },
			});
	};
};
