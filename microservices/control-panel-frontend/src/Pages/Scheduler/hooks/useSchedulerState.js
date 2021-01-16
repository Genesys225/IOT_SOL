import React, { createContext, useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { rest } from '../../../restClient';

export function commitChangesToAlert(changes) {
	return {
		type: 'commitChangesToAlert',
		payload: { changes },
	};
}

const initialState = {
	data: [],
	rooms: ['room1', 'room2', 'room3'],
	currentDate: new Date(),
	addedAppointment: {},
	appointmentChanges: {},
	editingAppointment: undefined,
	mainResourceName: 'room',
	currentFilter: '',
	resources: [],
	loading: true,
};

const init = ({ switches, events }) => ({
	...initialState,
	data: events,
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
			instances: switches,
		},
	],
	loading: false,
});

const reducer = (state, { type, payload }) => {
	switch (type) {
		case 'addAlert':
			return {
				...state,
				addedAppointment: {
					...payload,
					room:
						(payload.device &&
							state.resources[1].instances[0].room) ||
						'',
				},
			};
		case 'changeAlert':
			return {
				...state,
				appointmentChanges: payload,
			};
		case 'selectEditedAlert':
			return { ...state, editingAppointment: payload };
		case 'commitAddedAlert':
			let { data } = state;
			data = [...data, { id: new Date(), ...payload.added }];
			return { ...state, data };
		case 'commitChangesToAlert': {
			const data = state.data.map((appointment) =>
				payload.changes[appointment.id]
					? { ...appointment, ...payload.changes[appointment.id] }
					: appointment
			);
			return { ...state, data };
		}
		case 'changeMainResourceName':
			const { mainResourceName } = payload;
			return { ...state, mainResourceName };

		case 'deleteAlert': {
			let { data } = state;
			data = data.filter(
				(appointment) => appointment.id !== payload.deleted
			);
			return { ...state, data };
		}

		case 'rooms': {
			return { ...state, rooms: payload };
		}

		case 'currentFilter': {
			return { ...state, currentFilter: payload };
		}
		case 'lazyInit': {
			const { switches, events } = payload;

			if (switches && events) return init({ switches, events });
			else return state;
		}

		default:
			throw new Error(JSON.stringify({ type, payload }, null, 2));
	}
};
const SchedulerCtx = createContext({
	state: initialState,
	dispatch: () => null,
});

function SchedulerCtxProvider(props) {
	const switches = useSelector((state) =>
		// @ts-ignore
		state.sensors.devices
			.filter((device) => device.deviceType === 'switch')
			.map((switchInst) => ({
				...switchInst,
				id: switchInst.title,
				text: switchInst.title,
			}))
	);
	const [state, dispatch] = useReducer(
		reducer,
		{ switches, events: [] },
		init
	);
	useEffect(() => {
		const fetchSensors = async () => {
			const events = await rest.get('/getAllEvents');
			// @ts-ignore
			dispatch({
				type: 'lazyInit',
				payload: { switches, events },
			});
		};
		if (switches.length !== state.resources[1].instances.length)
			fetchSensors();
	}, [switches, state]);

	return (
		<SchedulerCtx.Provider value={{ state, dispatch }}>
			{props.children}
		</SchedulerCtx.Provider>
	);
}

export { SchedulerCtxProvider, SchedulerCtx };
