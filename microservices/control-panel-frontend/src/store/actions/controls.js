import { rest } from "../../restClient/fetchWrapper";

export const SEND_COMMAND = 'SEND_COMMAND';

export const sendCommand = ({ id, command = {} }) => {
	return async (dispatch) => {
		const executionRes = await rest.post('/sensorExecute', { id, command });
		console.log(id, ' ', command, executionRes);
		dispatch({ type: SEND_COMMAND, payload: { id, command } });
	};
};
