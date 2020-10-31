import {
	GET_SENSORS,
	LAST_SENSORS_DATA,
	UPDATE_ROOM,
	UPDATE_SENSOR,
} from '../actions/sensorsActions';

const initialState = {
	devices: [],
	deviceGauges: [],
	availableRooms: {},
};

export const sensorsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case GET_SENSORS: {
			let availableRooms = {};
			const devices = payload.dashboard.panels.filter((device) => {
				return device.type === 'graph';
			});
			const deviceGauges = payload.dashboard.panels.filter(
				(device) => device.type === 'gauge'
			);
			const transformDevice = (device) => {
				if (
					device.type === 'graph' &&
					device.roomId &&
					device.roomId !== 'MainRoom'
				) {
					availableRooms[device.roomId]
						? availableRooms[device.roomId].push(device.uid)
						: (availableRooms[device.roomId] = [device.uid]);
				}
				return {
					...device,
					deviceId: device.uid,
					deviceType: device.uid.split('/')[1],
				};
			};
			return {
				availableRooms,
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
			const sensorStateIndex = state.devices.findIndex(
				(sensor) => sensor.deviceId === payload.deviceId
			);
			newSensorState[sensorStateIndex].roomId = payload.room;
			let newAvailableRooms = { ...state.availableRooms };
			if (payload.room === 'MainRoom')
				newAvailableRooms[payload.room].filter(
					(deviceId) => deviceId === payload.deviceId
				);
			else if (newAvailableRooms[payload.room])
				newAvailableRooms[payload.room].push(payload.deviceId);
			else newAvailableRooms[payload.room] = [payload.deviceId];
			return {
				...state,
				devices: newSensorState,
				availableRooms: newAvailableRooms,
			};
		}

		default:
			return state;
	}
};
