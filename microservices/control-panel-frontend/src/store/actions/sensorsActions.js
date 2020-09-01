export const GET_SENSORS = 'GET_SENSORS';
export const LAST_SENSORS_DATA = 'LAST_SENSORS_DATA';

export const getSensors = () => {
	return async (dispatch) => {
		const res = await fetch('/getSensors');
		const allSensors = await res.json();
		dispatch({ type: GET_SENSORS, payload: allSensors });
	};
};

export const getLastData = () => {
	return async (dispatch) => {
		const res = await fetch('/getLastData');
		const allSensorsData = await res.json();
		console.log(allSensorsData);
		dispatch({ type: LAST_SENSORS_DATA, payload: allSensorsData });
	};
};
