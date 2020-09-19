export const SEND_COMMAND = 'SEND_COMMAND';

export const sendCommand = ({ id, command = {} }) => {
	return async (dispatch) => {
		const res = await fetch('/sensorExecute', {
			method: 'POST',
			body: JSON.stringify({ id, command }),
			headers: { 'Content-Type': 'application/json' },
		});
		const executionRes = await res.json();
		console.log(id, ' ', command, executionRes);
		dispatch({ type: SEND_COMMAND, payload: { id, command } });
	};
};
