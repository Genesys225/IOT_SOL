export const SEND_COMMAND = 'SEND_COMMAND';

export const sendCommand = ({ id, params = {} }) => {
	return async (dispatch) => {
		// const res = await fetch('/sendCommand');
		// const executionRes = await res.json();
		console.log(id, ' ', params);
		dispatch({ type: SEND_COMMAND, payload: { id, params } });
	};
};
