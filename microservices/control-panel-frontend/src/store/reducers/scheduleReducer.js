import { DELETE_SCHEDULE_EVENT, GET_SCHEDULE } from '../actions/schedule';

const initialState = {
	data: [],
	roomsFilter: ['room1', 'room2', 'room3'],
	currentDate: new Date(),
	addedAppointment: {},
	appointmentChanges: {},
	editingAppointment: undefined,
	mainResourceName: 'room',
	currentFilter: '',
	resources: [
		{
			fieldName: 'room',
			title: 'Room',
			instances: [
				{ id: 'room1', text: 'Room 1' },
				{ id: 'room2', text: 'Room 2' },
				{ id: 'room3', text: 'Room 3' },
				{ id: 'MainRoom', text: 'MainRoom' },
			],
		},
		{
			fieldName: 'device',
			title: 'Device',
			instances: [],
		},
	],
	loading: true,
};

export const schedulerReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case GET_SCHEDULE:
			return {
				...state,
				data: payload.map((event) => ({
					...event,
					device: event.deviceId,
				})),
				loading: false,
			};
		case 'addAlert':
			return {
				...state,
				addedAppointment: payload,
			};
		case 'changeAlert':
			return {
				...state,
				appointmentChanges: payload,
			};
		case 'selectEditedAlert':
			return { ...state, editingAppointment: payload };

		case 'commitAddedAlert':
			let data = [...state.data];
			data = [...data, { id: new Date(), ...payload.added }];
			return { ...state, data };

		case 'commitChangesToAlert': {
			const data = state.data.map((appointment) => {
				return payload.changes[appointment.id]
					? { ...appointment, ...payload.changes[appointment.id] }
					: appointment;
			});
			return { ...state, data, editingAppointment: undefined };
		}
		case 'changeMainResourceName':
			const { mainResourceName } = payload;
			return { ...state, mainResourceName };

		case 'deleteAlert': {
			const data = state.data.filter(
				(appointment) => appointment.id !== payload
			);
			return { ...state, data };
		}

		case 'rooms': {
			return { ...state, rooms: payload };
		}

		case 'currentFilter': {
			return { ...state, currentFilter: payload };
		}

		case 'setSwitchesList': {
			let resources = [...state.resources];
			resources[1].instances = payload;
			return { ...state, resources };
		}

		case DELETE_SCHEDULE_EVENT:
			return {
				...state,
				alerts: {
					...state.alerts.filter(
						(alert) => alert.title === payload.title
					),
				},
			};

		default:
			return state;
	}
};
