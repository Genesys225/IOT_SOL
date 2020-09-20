import React, { useReducer, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
	Scheduler,
	Resources,
	Appointments,
	AppointmentForm,
	AppointmentTooltip,
	WeekView,
	EditRecurrenceMenu,
	AllDayPanel,
	ConfirmationDialog,
	MonthView,
	DayView,
	ViewSwitcher,
	Toolbar,
	DateNavigator,
	TodayButton,
	DragDropProvider,
} from '@devexpress/dx-react-scheduler-material-ui';
import { appointments } from './demo-data/appointments';
import { Select, MenuItem, useTheme, Divider } from '@material-ui/core';
import { createStyles, makeStyles, withStyles } from '@material-ui/styles';
import { indigo, blue, teal } from '@material-ui/core/colors';
import { fade } from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';

const useStyles = makeStyles({
	container: {
		display: 'flex',
		// @ts-ignore
		marginBottom: (theme) => theme.spacing(2),
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '50%',
		margin: '5px',
	},
	text: (theme) => ({
		// @ts-ignore
		...theme.typography.h6,
		// @ts-ignore
		marginRight: theme.spacing(2),
	}),
	floatLeft: {
		float: 'left',
	},
	paper: {
		height: '2600px',
		width: '95%',
		margin: '15px auto',
	},
});

const ResourceSwitcher = ({ mainResourceName, onChange, resources }) => {
	const theme = useTheme();

	const classes = useStyles(theme);
	return (
		<div className={classes.container}>
			<div className={classes.text}>Main resource name:</div>
			<Select
				value={mainResourceName}
				onChange={(e) => onChange(e.target.value)}
				variant="outlined"
			>
				{resources.map((resource) => (
					<MenuItem
						key={resource.fieldName}
						value={resource.fieldName}
					>
						{resource.title}
					</MenuItem>
				))}
			</Select>
		</div>
	);
};

const reducer = (state, { type, payload }) => {
	console.log({ state, type, payload });
	switch (type) {
		case 'addAlert':
			return {
				...state,
				addedAppointment: payload,
			};
		case 'changeAlert':
			return { ...state, appointmentChanges: payload };
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

		default:
			throw new Error(JSON.stringify({ type, payload }));
	}
};

const isWeekEnd = (date) => date.getDay() === 0 || date.getDay() === 6;

const initialState = {
	data: appointments,
	currentDate: '2018-06-27',
	addedAppointment: {},
	appointmentChanges: {},
	editingAppointment: undefined,
	mainResourceName: 'members',
	resources: [
		{
			fieldName: 'location',
			title: 'Location',
			instances: [
				{ id: 'Room 1', text: 'Room 1' },
				{ id: 'Room 2', text: 'Room 2' },
				{ id: 'Room 3', text: 'Room 3' },
				{ id: 'Room 4', text: 'Room 4' },
				{ id: 'Room 5', text: 'Room 5' },
			],
		},
		{
			fieldName: 'members',
			title: 'Members',
			allowMultiple: true,
			instances: [
				{ id: 1, text: 'Andrew Glover' },
				{ id: 2, text: 'Arnie Schwartz' },
				{ id: 3, text: 'John Heart' },
				{ id: 4, text: 'Taylor Riley' },
				{ id: 5, text: 'Brad Farkus' },
			],
		},
	],
};

const useStyles1 = makeStyles({
	appointment: {
		borderRadius: 0,
		borderBottom: 0,
	},
	highPriorityAppointment: {
		borderLeft: `4px solid ${teal[500]}`,
	},
	mediumPriorityAppointment: {
		borderLeft: `4px solid ${blue[500]}`,
	},
	lowPriorityAppointment: {
		borderLeft: `4px solid ${indigo[500]}`,
	},
	weekEndCell: {
		backgroundColor: ({ palette }) =>
			fade(palette.action.disabledBackground, 0.04),
		'&:hover': {
			backgroundColor: ({ palette }) =>
				fade(palette.action.disabledBackground, 0.04),
		},
		'&:focus': {
			backgroundColor: ({ palette }) =>
				fade(palette.action.disabledBackground, 0.04),
		},
	},
	weekEndDayScaleCell: {
		backgroundColor: ({ palette }) =>
			fade(palette.action.disabledBackground, 0.06),
	},
	text: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	content: {
		opacity: 0.7,
	},
	container: {
		width: '100%',
		lineHeight: 1.2,
		height: '100%',
	},
});

const DayScaleCell = ({ startDate, ...restProps }) => {
	const theme = useTheme();
	const classes = useStyles1(theme);
	return (
		<MonthView.DayScaleCell
			className={classNames({
				[classes.weekEndDayScaleCell]: isWeekEnd(startDate),
			})}
			startDate={startDate}
			{...restProps}
		/>
	);
};
const TimeTableCell = ({ startDate, ...restProps }) => {
	const theme = useTheme();
	const classes = useStyles1(theme);
	return (
		<MonthView.TimeTableCell
			className={classNames({
				[classes.weekEndCell]: isWeekEnd(startDate),
			})}
			startDate={startDate}
			{...restProps}
		/>
	);
};
const Appointment = ({ data, ...restProps }) => {
	const theme = useTheme();
	const classes = useStyles1(theme);
	return (
		<Appointments.Appointment
			{...restProps}
			className={classNames({
				[classes.highPriorityAppointment]: data.priority === 1,
				[classes.mediumPriorityAppointment]: data.priority === 2,
				[classes.lowPriorityAppointment]: data.priority === 3,
				[classes.appointment]: true,
			})}
			data={data}
		/>
	);
};

const AppointmentContent = ({ data, ...restProps }) => {
	const theme = useTheme();
	const classes = useStyles1(theme);
	return (
		<Appointments.AppointmentContent {...restProps} data={data}>
			<div className={classes.container}>
				<div className={classes.text}>{data.title}</div>
				<div className={classNames(classes.text, classes.content)}>
					{`Location: ${data.location}`}
				</div>
			</div>
		</Appointments.AppointmentContent>
	);
};

// @ts-ignore
const SchedulerComp = (props) => {
	const theme = useTheme();
	const classes = useStyles(theme);
	const [state, dispatch] = useReducer(reducer, initialState);
	const [currentView, setCurrentView] = useState('Week');
	const commitChanges = ({ added, changed, deleted }) => {
		if (added) {
			// @ts-ignore
			dispatch({ type: 'commitAddedAlert', payload: { added } });
		}
		if (changed) {
			// @ts-ignore
			dispatch({ type: 'commitChangesToAlert', payload: { changed } });
		}
		if (deleted !== undefined) {
			// @ts-ignore
			dispatch({ type: 'deleteAlert', payload: { deleted } });
		}
	};

	const changeMainResource = (mainResourceName) => {
		// @ts-ignore
		dispatch({
			type: 'changeMainResourceName',
			payload: { mainResourceName },
		});
	};

	const currentViewChange = (currentViewName) => {
		setCurrentView(currentViewName);
	};

	const {
		currentDate,
		data,
		addedAppointment,
		appointmentChanges,
		editingAppointment,
		resources,
		mainResourceName,
	} = state;
	return (
		<Paper className={classes.paper}>
			<Scheduler data={data} height="auto">
				<ViewState
					defaultCurrentDate={currentDate}
					currentViewName={currentView}
					onCurrentViewNameChange={currentViewChange}
				/>
				<EditingState
					onCommitChanges={commitChanges}
					addedAppointment={addedAppointment}
					onAddedAppointmentChange={(addedAppointment) =>
						// @ts-ignore
						dispatch({
							type: 'addAlert',
							payload: addedAppointment,
						})
					}
					appointmentChanges={appointmentChanges}
					onAppointmentChangesChange={(appointmentChanges) =>
						// @ts-ignore
						dispatch({
							type: 'changeAlert',
							payload: appointmentChanges,
						})
					}
					editingAppointment={editingAppointment}
					onEditingAppointmentChange={(editingAppointment) =>
						// @ts-ignore
						dispatch({
							type: 'selectEditedAlert',
							payload: editingAppointment,
						})
					}
				/>
				<WeekView />
				<MonthView
					dayScaleCellComponent={DayScaleCell}
					timeTableCellComponent={TimeTableCell}
				/>
				<DayView />
				<Toolbar />
				<ViewSwitcher />
				<DateNavigator />
				<TodayButton />
				<ResourceSwitcher
					resources={resources}
					mainResourceName={mainResourceName}
					onChange={changeMainResource}
				/>
				<Divider />
				<AllDayPanel />
				<EditRecurrenceMenu />
				<ConfirmationDialog />
				<Appointments
					appointmentComponent={Appointment}
					appointmentContentComponent={AppointmentContent}
				/>
				<AppointmentTooltip showOpenButton showDeleteButton />
				<AppointmentForm />
				<Resources
					data={resources}
					mainResourceName={mainResourceName}
				/>
				<DragDropProvider />
			</Scheduler>
		</Paper>
	);
};

export default SchedulerComp;
