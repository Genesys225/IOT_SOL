
export const SEND_COMMAND = 'SEND_COMMAND';
export const REGISTER_DEVICE = 'REGISTER_DEVICE';


export const registerDevice = (device) => ({ type: REGISTER_DEVICE, payload: device });

export const sendCommand = ({ id, command = {} }) => {
	return async (dispatch, _, rest) => {
		const executionRes = await rest.post('/sensorExecute', { id, command });
		console.log(id, ' ', command, executionRes);
		dispatch({ type: SEND_COMMAND, payload: { id, command } });
	};
};
