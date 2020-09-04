export const GET_SENSORS = 'GET_SENSORS';
export const LAST_SENSORS_DATA = 'LAST_SENSORS_DATA';
export const UPDATE_SENSOR = 'UPDATE_SENSOR';

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
		dispatch({ type: LAST_SENSORS_DATA, payload: allSensorsData });
	};
};

export const updateSensor = ({id, meta}) => {
	return async (dispatch) => {
		const res = await fetch('/updateSensor',{ method: 'POST', body: {id, meta}});
		const resObj = await res.json()
		console.log({id, meta})
		console.log(resObj)
		if (res.status === 'OK')
		dispatch({ type: UPDATE_SENSOR, payload: {id, meta} });
	};
};
