import React, { useCallback, useEffect, useState } from 'react';
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
	// @ts-ignore
} from '@devexpress/dx-react-scheduler-material-ui';
import { useDispatch, useSelector } from 'react-redux';
import {
	changeAddedAppointment,
	changeAppointmentChanges,
	getScheduleEvents,
} from '../../store/actions/schedule';
import { useScheduleStyles } from './hooks/useScheduleStyles';
import { Appointment, AppointmentContent } from './AppointmentView';
import { MonthDayScaleCell, MonthTimeTableCell } from './MonthView';
import { FlexibleSpace, ToolbarWithLoading } from './ToolbarView';
import { WeekTimeTableCell, WeekDayScaleCell } from './WeekView';
import {
	addScheduleEvent,
	changeScheduleEvent,
	deleteScheduleEvent,
	selectEditedAppointment,
} from '../../store/actions/schedule';

const SchedulerContainer = () => {
	const dispatch = useDispatch();
	const switches = useSelector((state) =>
		// @ts-ignore
		state.sensors.filter(
			(device) => device.deviceType === 'switch'
		).map((switchInst) => ({
			...switchInst,
			id: switchInst.deviceId,
			text: switchInst.deviceId,
		}))
	);
	// @ts-ignore
	const state = useSelector((state) => state.schedule);
	const classes = useScheduleStyles();
	const [currentView, setCurrentView] = useState('Week');
	const commitChanges = ({ added, changed, deleted }) => {
		console.log(added);
		if (added) {
			dispatch(addScheduleEvent(added));
		}
		if (changed) {
			dispatch(changeScheduleEvent(changed));
		}
		if (deleted !== undefined) {
			dispatch(deleteScheduleEvent(deleted));
		}
	};

	const currentViewChange = (currentViewName) => {
		setCurrentView(currentViewName);
	};

	const addedAppointmentChange = (addedAppointment) =>
		dispatch(changeAddedAppointment(addedAppointment));

	const appointmentChangesChange = (appointmentChanges) =>
		dispatch(changeAppointmentChanges(appointmentChanges));

	const editingAppointmentChange = (editingAppointment) =>
		dispatch(selectEditedAppointment(editingAppointment));

	useEffect(() => {
		const fetchSchedule = async () => {
			await dispatch(getScheduleEvents());
		};
		const fetchSensors = async () => {
			await dispatch({ type: 'setSwitchesList', payload: switches });
		};
		if (switches.length !== state.resources[1].instances.length)
			fetchSensors();
		if (
			state.data.length <= 0 &&
			switches.length === state.resources[1].instances.length
		)
			fetchSchedule();
	}, [dispatch, state, switches]);

	return (
		<Paper className={classes.paper}>
			<Scheduler data={state.data} height="auto">
				<ViewState
					defaultCurrentDate={state.currentDate}
					currentViewName={currentView}
					onCurrentViewNameChange={currentViewChange}
				/>
				<EditingState
					onCommitChanges={commitChanges}
					addedAppointment={state.addedAppointment}
					onAddedAppointmentChange={addedAppointmentChange}
					appointmentChanges={state.appointmentChanges}
					onAppointmentChangesChange={appointmentChangesChange}
					editingAppointment={state.editingAppointment}
					onEditingAppointmentChange={editingAppointmentChange}
				/>
				<WeekView
					dayScaleCellComponent={WeekDayScaleCell}
					timeTableCellComponent={WeekTimeTableCell}
				/>
				<MonthView
					dayScaleCellComponent={MonthDayScaleCell}
					timeTableCellComponent={MonthTimeTableCell}
				/>
				<DayView />
				<Toolbar
					flexibleSpaceComponent={FlexibleSpace}
					{...(state.loading
						? { rootComponent: ToolbarWithLoading }
						: null)}
				/>
				<ViewSwitcher />
				<DateNavigator />
				<TodayButton />
				<AllDayPanel />
				<EditRecurrenceMenu />
				<ConfirmationDialog />
				<Appointments
				// appointmentComponent={Appointment}
				// appointmentContentComponent={AppointmentContent}
				/>
				<AppointmentTooltip showOpenButton showDeleteButton />
				<AppointmentForm />
				<Resources
					data={state.resources}
					mainResourceName={state.mainResourceName}
				/>
				<DragDropProvider />
			</Scheduler>
		</Paper>
	);
};

export default SchedulerContainer;
