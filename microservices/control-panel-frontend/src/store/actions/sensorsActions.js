import { rest } from '../../restClient/fetchWrapper';
import { fetchRoomAlerts } from './alertsActions';

export const GET_SENSORS = 'GET_SENSORS';
export const LAST_SENSORS_DATA = 'LAST_SENSORS_DATA';
export const UPDATE_SENSOR = 'UPDATE_SENSOR';
export const UPDATE_ROOM = 'UPDATE_ROOM';

export const getSensors = () => {
	return async (dispatch) => {
		const allPanels = await rest.get('/getRoom');
		dispatch({ type: GET_SENSORS, payload: allPanels });
		const scannedRooms = [];
		allPanels.dashboard &&
			allPanels.dashboard.panels.forEach((device) => {
				if (
					device.type === 'graph' &&
					device.roomId &&
					device.roomId !== 'MainRoom' &&
					!scannedRooms.includes(device.roomId)
				) {
					scannedRooms.push(device.roomId);
					dispatch(fetchRoomAlerts(device.roomId));
				}
			});
	};
};

export const getLastData = () => {
	return async (dispatch) => {
		const allSensorsData = await rest.get('/getLastData');
		if (allSensorsData.length > 0)
			// dispatch({ type: LAST_SENSORS_DATA, payload: allSensorsData });
			return 'SUCCESS';
	};
};

export const updateSensor = ({ id, meta }) => {
	return async (dispatch) => {
		const resObj = await rest.post('/updateSensor', { id, meta });
		console.log(JSON.stringify({ id, meta }, null, 2));
		console.log(resObj);
		if (resObj) dispatch({ type: UPDATE_SENSOR, payload: { id, meta } });
	};
};

export const updateDeviceZone = ({ idFrom, idTo, deviceId }) => {
	return async (dispatch) => {
		const res = await rest.post('/addDeviceFromDashboardToDashboard', {
			idFrom,
			idTo,
			deviceId,
		});

		console.log(
			JSON.stringify(
				{
					idFrom,
					idTo,
					deviceId,
					res,
				},
				null,
				2
			)
		);
		if (res)
			dispatch({
				type: UPDATE_ROOM,
				payload: { deviceId, room: idTo },
			});
	};
};
