import React, { createContext, useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getScheduleEvents } from '../../../store/actions/alertsActions';
import { getSensors } from '../../../store/actions/sensorsActions';

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

const init = (switches, events) => ({
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
				{ id: 'All', text: 'All' },
			],
		},
		{
			fieldName: 'device',
			title: 'Device',
			instances: switches,
		},
	],
	loading: switches.length <= 0,
});

const reducer = (state, { type, payload }) => {
	console.log({ state, type, payload });
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
			const startingAddedId =
				data.length > 0 ? data[data.length - 1].id + 1 : 0;
			data = [...data, { id: startingAddedId, ...payload.added }];
			return { ...state, data };
		case 'commitChangesToAlert': {
			let { data } = state;
			data = data.map((appointment) =>
				payload.changed[appointment.id]
					? { ...appointment, ...payload.changed[appointment.id] }
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
			const { switches, alerts } = payload;
			if (switches && alerts) return init(switches, alerts);
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
		state.sensors.All.filter(
			(device) => device.deviceType === 'switch'
		).map((switchInst) => ({
			...switchInst,
			id: switchInst.title,
			text: switchInst.title,
		}))
	);
	const alerts = useSelector((state) =>
		// @ts-ignore
		state.alerts.alerts.map((event) => ({
			...event,
			device: event.deviceId,
			room: event.roomId,
		}))
	);
	const thunkDispatch = useDispatch();
	const [state, dispatch] = useReducer(reducer, switches, init);

	useEffect(() => {
		const fetchSensors = async () => {
			await thunkDispatch(getSensors());
			await thunkDispatch(getScheduleEvents());
		};
		if (switches.length <= 0) fetchSensors();
		else if (state.resources[1].instances.length <= 0) {
			// @ts-ignore
			dispatch({ type: 'lazyInit', payload: { switches, alerts } });
		}
	}, [thunkDispatch, switches, alerts, state]);

	return (
		<SchedulerCtx.Provider value={{ state, dispatch }}>
			{props.children}
		</SchedulerCtx.Provider>
	);
}

export { SchedulerCtxProvider, SchedulerCtx };
