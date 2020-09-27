import {
	GET_SENSORS,
	LAST_SENSORS_DATA,
	UPDATE_ROOM,
	UPDATE_SENSOR,
} from '../actions/sensorsActions';

const initialState = {
	All: [],
};

export const sensorsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case GET_SENSORS: {
			let newSensorState = { ...state };
			newSensorState = payload
				.filter(
					(room) =>
						room.room === 'All' || room.room.substr(0, 4) === 'room'
				)
				.reduce((result, room) => {
					return {
						...result,
						[room.room]: room.devices.map((device) => ({
							...device,
							deviceType: device.title.split('/')[1],
							deviceId: device.title,
							room: room.room,
						})),
					};
				}, {});
			Object.keys(newSensorState).forEach((room) => {
				if (room !== 'All')
					newSensorState[room].forEach((device) => {
						const hasIndexInAll = newSensorState.All.findIndex(
							(allsDevice) => allsDevice.title === device.title
						);
						if (hasIndexInAll !== -1) {
							newSensorState.All[hasIndexInAll].room =
								device.room;
						}
					});
			});
			return newSensorState;
		}

		case LAST_SENSORS_DATA:
			let newSensorState = { ...state };
			payload.forEach((sensorData) => {
				const sensorStateIndex = newSensorState.All.findIndex(
					(sensor) => sensor.deviceId === sensorData.id
				);
				if (sensorStateIndex !== -1) {
					const sensorState = newSensorState.All[sensorStateIndex];
					sensorState.currentValue = sensorData.value;
					newSensorState[sensorState.room] = newSensorState[
						sensorState.room
					].map((sensor) => {
						if (sensor.deviceId === sensorData.id) {
							return {
								...sensor,
								currentValue: sensorData.value,
							};
						}
						return sensor;
					});
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
			const newSensorState = { ...state };
			Object.keys(newSensorState).forEach((room) => {
				newSensorState[room] = newSensorState[room].map((device) => {
					if (device.deviceId === payload.deviceId) {
						return { ...device, room: payload.room };
					}
					return device;
				});
			});
			return newSensorState;
		}

		default:
			return state;
	}
};
