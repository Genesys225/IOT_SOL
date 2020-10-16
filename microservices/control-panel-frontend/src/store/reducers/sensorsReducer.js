import {
	GET_SENSORS,
	LAST_SENSORS_DATA,
	UPDATE_ROOM,
	UPDATE_SENSOR,
} from '../actions/sensorsActions';

const initialState = {
	devices: [],
	deviceGauges: [],
};

export const sensorsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case GET_SENSORS: {
			console.log(payload);
			const devices = payload.dashboard.panels.filter(
				(device) => device.type === 'graph'
			);
			const deviceGauges = payload.dashboard.panels.filter(
				(device) => device.type === 'gauge'
			);
			const transformDevice = (device) => ({
				...device,
				deviceId: device.uid,
				deviceType: device.uid.split('/')[1],
			});
			return {
				devices: devices.map(transformDevice),
				deviceGauges: deviceGauges.map(transformDevice),
			};
		}

		case LAST_SENSORS_DATA:
			let newSensorState = [...state.devices];
			payload.forEach((sensorData) => {
				const sensorStateIndex = state.devices.findIndex(
					(sensor) => sensor.deviceId === sensorData.id
				);
				if (sensorStateIndex !== -1) {
					const sensorState = newSensorState[sensorStateIndex];
					sensorState.currentValue = sensorData.value;
				}
			});

			return {
				...state,
				devices: newSensorState,
			};

		case UPDATE_SENSOR: {
			const newSensorState = state.devices.map((sensorState) => {
				if (payload.id === sensorState.id)
					return Object.assign({}, sensorState, {
						meta: payload.meta,
					});
				return sensorState;
			});

			return {
				...state,
				devices: newSensorState,
			};
		}
		case UPDATE_ROOM: {
			const newSensorState = [...state.devices];
			const sensorStateIndex = state.findIndex(
				(sensor) => sensor.deviceId === payload.deviceId
			);
			newSensorState[sensorStateIndex].roomId = payload.room;
			return {
				...state,
				devices: newSensorState,
			};
		}

		default:
			return state;
	}
};
