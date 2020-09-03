export const SEND_COMMAND = 'SEND_COMMAND';

export const sendCommand = ({ command, params = {} }) => {
	return async (dispatch) => {
		const res = await fetch('/sendCommand');
		const executionRes = await res.json();
		console.log(executionRes);
		dispatch({ type: SEND_COMMAND, payload: { command, params } });
	};
};
