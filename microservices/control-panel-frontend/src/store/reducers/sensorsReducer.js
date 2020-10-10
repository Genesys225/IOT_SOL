import {
	GET_SENSORS,
	LAST_SENSORS_DATA,
	UPDATE_ROOM,
	UPDATE_SENSOR,
} from '../actions/sensorsActions';

const initialState = [];

export const sensorsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case GET_SENSORS: {
			return payload.dashboard.panels.map((device) => ({
				...device,
				deviceId: device.uid,
				deviceType: device.uid.split('/')[1],
			}));
		}

		case LAST_SENSORS_DATA:
			let newSensorState = [...state];
			payload.forEach((sensorData) => {
				const sensorStateIndex = state.findIndex(
					(sensor) => sensor.deviceId === sensorData.id
				);
				if (sensorStateIndex !== -1) {
					const sensorState = newSensorState[sensorStateIndex];
					sensorState.currentValue = sensorData.value;
				}
			});

			return newSensorState;

		case UPDATE_SENSOR: {
			const newSensorState = state.map((sensorState) => {
				if (payload.id === sensorState.id)
					return Object.assign({}, sensorState, {
						meta: payload.meta,
					});
				return sensorState;
			});

			return newSensorState;
		}
		case UPDATE_ROOM: {
			const newSensorState = [...state];
			const sensorStateIndex = state.findIndex(
				(sensor) => sensor.deviceId === payload.deviceId
			);
			newSensorState[sensorStateIndex].roomId = payload.room;
			return newSensorState;
		}

		default:
			return state;
	}
};
