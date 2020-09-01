import { GET_SENSORS, LAST_SENSORS_DATA } from '../actions/sensorsActions';

const initialState = [];

export const sensorsReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_SENSORS: {
			let newSensorState = { ...state };
			newSensorState = action.payload.map((sensorData) =>
				Object.assign(
					sensorData,
					state.find((sensor) => sensor.id === sensorData.id)
				)
			);

			return newSensorState;
		}
		case LAST_SENSORS_DATA:
			let newSensorState = { ...state };
			newSensorState = action.payload.map((sensorData) => {
				delete sensorData.ts;
				const updatedSensor = Object.assign(
					state.find((sensor) => {
						const res = sensor.id === sensorData.sensor_id;
						return res;
					}),
					sensorData
				);
				delete updatedSensor.sensor_id;
				return updatedSensor;
			});

			return newSensorState;

		default:
			return state;
	}
};
