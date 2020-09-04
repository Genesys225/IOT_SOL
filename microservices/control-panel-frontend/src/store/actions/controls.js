export const SEND_COMMAND = 'SEND_COMMAND';

export const sendCommand = ({ switch_id, params = {} }) => {
	return async (dispatch) => {
		const res = await fetch('/sendCommand');
		const executionRes = await res.json();
		console.log(executionRes);
		dispatch({ type: SEND_COMMAND, payload: { switch_id, params } });
	};
};
