
export const GET_SCHEDULE = 'GET_SCHEDULE';
export const CREATE_EVENT = 'CREATE_EVENT';
export const DELETE_SCHEDULE_EVENT = 'DELETE_SCHEDULE_EVENT';

export const getScheduleEvents = () => {
	return async (dispatch) => {
		const events = await rest.get('/getAllEvents');
		await dispatch({ type: GET_SCHEDULE, payload: events });
		console.log(events);
	};
};

export const deleteScheduleEvent = (title) => {
	return async (dispatch, _, rest) => {
		const res = await rest.post('/deleteScheduleEvent', {
			title,
		});
		console.log(res);
		dispatch({ type: 'deleteAlert', payload: title });
	};
};

export const addScheduleEvent = ({
	title,
	device,
	room,
	startDate,
	endDate,
}) => {
	return async (dispatch, _, rest) => {
		console.log({
			title,
			deviceId: device,
			roomId: room,
			startDate,
			endDate,
		});
		dispatch({
			type: 'commitAddedAlert',
			payload: { added: { title, device, room, startDate, endDate } },
		});
		const response = await rest.post('/setTimingStartEnd', {
			title,
			deviceId: device,
			roomId: room,
			startDate,
			endDate,
		});
		console.log(response);
	};
};

export const changeScheduleEvent = (changes) => {
	return async (dispatch) => {
		console.log({
			changes,
		});
		// const response = await rest.post('/setTimingStartEnd', {
		// 	changes,
		// 	edit: true,
		// });
		// console.log(response);
		dispatch({
			type: 'commitChangesToAlert',
			payload: { changes: changes },
		});
	};
};

export const changeAddedAppointment = (addedAppointment) => {
	// @ts-ignore
	return async (dispatch) =>
		dispatch({
			type: 'addAlert',
			payload: addedAppointment,
		});
};
export const changeAppointmentChanges = (appointmentChanges) => {
	// @ts-ignore
	return async (dispatch) =>
		dispatch({
			type: 'changeAlert',
			payload: appointmentChanges,
		});
};
export const selectEditedAppointment = (editingAppointment) => {
	// @ts-ignore
	return async (dispatch) =>
		dispatch({
			type: 'selectEditedAlert',
			payload: editingAppointment,
		});
};
