import React, { useContext, useState } from 'react';
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
import { useDispatch } from 'react-redux';
import {
	deleteScheduleEvent,
	setScheduleEvent,
} from '../../store/actions/alertsActions';
import { useScheduleStyles } from './hooks/useScheduleStyles';
import { SchedulerCtx, SchedulerCtxProvider } from './hooks/useSchedulerState';
import { Appointment, AppointmentContent } from './AppointmentView';
import { MonthDayScaleCell, MonthTimeTableCell } from './MonthView';
import { FlexibleSpace, ToolbarWithLoading } from './ToolbarView';
import { WeekTimeTableCell, WeekDayScaleCell } from './WeekView';

const SchedulerContainer = () => {
	const thunkDispatch = useDispatch();
	const classes = useScheduleStyles();
	const { state, dispatch } = useContext(SchedulerCtx);
	const [currentView, setCurrentView] = useState('Week');
	const commitChanges = ({ added, changed, deleted }) => {
		if (added) {
			// @ts-ignore
			dispatch({ type: 'commitAddedAlert', payload: { added } });
			const { title, device, room, startDate, endDate } = added;
			thunkDispatch(
				setScheduleEvent({
					title,
					deviceId: device,
					roomId: room,
					startDate,
					endDate,
				})
			);
		}
		if (changed) {
			// @ts-ignore
			dispatch({ type: 'commitChangesToAlert', payload: { changed } });
			const { title, device, room, startDate, endDate, id } = changed;
			thunkDispatch(
				setScheduleEvent(
					{
						title,
						deviceId: device,
						roomId: room,
						startDate,
						endDate,
					},
					!!changed
				)
			);
		}
		if (deleted !== undefined) {
			// @ts-ignore
			dispatch({ type: 'deleteAlert', payload: { deleted } });

			thunkDispatch(
				deleteScheduleEvent(
					state.data.find((event) => event.id === deleted).title
				)
			);
		}
	};

	const currentViewChange = (currentViewName) => {
		setCurrentView(currentViewName);
	};

	const addedAppointmentChange = (addedAppointment) =>
		// @ts-ignore
		dispatch({
			type: 'addAlert',
			payload: addedAppointment,
		});

	const appointmentChangesChange = (appointmentChanges) =>
		// @ts-ignore
		dispatch({
			type: 'changeAlert',
			payload: appointmentChanges,
		});

	const editingAppointmentChange = (editingAppointment) =>
		// @ts-ignore
		dispatch({
			type: 'selectEditedAlert',
			payload: editingAppointment,
		});

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

const SchedulerComp = () => {
	return (
		<SchedulerCtxProvider>
			<SchedulerContainer />
		</SchedulerCtxProvider>
	);
};

export default SchedulerComp;
