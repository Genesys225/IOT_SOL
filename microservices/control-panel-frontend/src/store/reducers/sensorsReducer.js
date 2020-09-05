import {
	GET_SENSORS,
	LAST_SENSORS_DATA,
	UPDATE_SENSOR,
} from '../actions/sensorsActions';

const initialState = [];

export const sensorsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case GET_SENSORS: {
			let newSensorState = { ...state };
			newSensorState = payload.map((sensorData) =>
				Object.assign(
					state.find((sensor) => sensor.id === sensorData.id) || {},
					sensorData
				)
			);

			return newSensorState;
		}

		case LAST_SENSORS_DATA:
			let newSensorState = { ...state };
			newSensorState = payload.map((sensorData) => {
				const updatedSensor = Object.assign(
					state.find((sensor) => {
						const res = sensor.id === sensorData.id;
						return res;
					}),
					sensorData
				);
				return updatedSensor;
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

		default:
			return state;
	}
};
