import { AppointmentForm } from '@devexpress/dx-react-scheduler-material-ui';
import { Button, IconButton, TextField, makeStyles } from '@material-ui/core';
import React, { useContext, useState, } from 'react'
import { SchedulerCtx } from './hooks/useSchedulerState';
import LocationOn from '@material-ui/icons/LocationOn';
import Notes from '@material-ui/icons/Notes';
import Close from '@material-ui/icons/Close';
import CalendarToday from '@material-ui/icons/CalendarToday';
import Create from '@material-ui/icons/Create';
import MomentUtils from '@date-io/moment';
import {
	KeyboardDateTimePicker,
	MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
	container: {
		width: theme.spacing(68),
		padding: 0,
		paddingBottom: theme.spacing(2),
	},
	content: {
		padding: theme.spacing(2),
		paddingTop: 0,
	},
	header: {
		overflow: 'hidden',
		paddingTop: theme.spacing(0.5),
	},
	closeButton: {
		float: 'right',
	},
	buttonGroup: {
		display: 'flex',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 2),
	},
	button: {
		marginLeft: theme.spacing(2),
	},
	picker: {
		marginRight: theme.spacing(2),
		'&:last-child': {
			marginRight: 0,
		},
		width: '50%',
	},
	wrapper: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: theme.spacing(1, 0),
	},
	icon: {
		margin: theme.spacing(2, 0),
		marginRight: theme.spacing(2),
	},
	textField: {
		width: '100%',
	},
}));

const initialState = {
	appointmentChanges: {},
};

function AppointmentFormContainer(props) {
  const classes = useStyles();
	const { state: schedularState, dispatch } = useContext(SchedulerCtx);
	const thunkDispatch = useDispatch();
  const [state, setState] = useState(initialState)
  const {
		visible,
		visibleChange,
		appointmentData,
		cancelAppointment,
		target,
		onHide,
  } = schedularState;
	const { appointmentChanges } = state;

  const displayAppointmentData = {
		...appointmentData,
		...appointmentChanges,
	};
  const commitAppointment = (type) => {
    const { commitChanges } = props;
    const appointment = {
		...appointmentData,
		...appointmentChanges,
    };
    if (type === 'deleted') {
      commitChanges({ [type]: appointment.id });
    } else if (type === 'changed') {
      commitChanges({ [type]: { [appointment.id]: appointment } });
    } else {
      commitChanges({ [type]: appointment });
    }
     // @ts-ignore
     setState({
			appointmentChanges: {},
		});
  };

  const changeAppointment = ({ field, changes }) => {
    const nextChanges = {
      ...appointmentChanges,
      [field]: changes,
    };
    // @ts-ignore
    setState({
		appointmentChanges: nextChanges,
	});
  }

  const isNewAppointment = appointmentData.id === undefined;

  const applyChanges = isNewAppointment
		? () => commitAppointment('added')
		: () => commitAppointment('changed');

  const textEditorProps = (field) => ({
		variant: 'outlined',
		onChange: ({ target: change }) =>
			changeAppointment({
				field: [field],
				changes: change.value,
			}),
		value: displayAppointmentData[field] || '',
		label: field[0].toUpperCase() + field.slice(1),
		className: classes.textField,
  });

  const pickerEditorProps = (field) => ({
		className: classes.picker,
		// keyboard: true,
		ampm: false,
		value: displayAppointmentData[field],
		onChange: (date) =>
			changeAppointment({
				field: [field],
				changes: date
					? date.toDate()
					: new Date(displayAppointmentData[field]),
			}),
		inputVariant: 'outlined',
		format: 'DD/MM/YYYY HH:mm',
		onError: () => null,
  });

  const cancelChanges = () => {
		setState({
			appointmentChanges: {},
		});
		visibleChange();
		cancelAppointment();
  };
	return (
		<AppointmentForm.Overlay
			visible={visible}
			target={target}
			fullSize
			onHide={onHide}
		>
			<div>
				<div className={classes.header}>
					<IconButton
						className={classes.closeButton}
						onClick={cancelChanges}
					>
						<Close color="action" />
					</IconButton>
				</div>
				<div className={classes.content}>
					<div className={classes.wrapper}>
						<Create className={classes.icon} color="action" />
						<TextField {...textEditorProps('title')} />
					</div>
					<div className={classes.wrapper}>
						<CalendarToday
							className={classes.icon}
							color="action"
						/>
						<MuiPickersUtilsProvider utils={MomentUtils}>
							<KeyboardDateTimePicker
								label="Start Date"
								{...pickerEditorProps('startDate')}
							/>
							<KeyboardDateTimePicker
								label="End Date"
								{...pickerEditorProps('endDate')}
							/>
						</MuiPickersUtilsProvider>
					</div>
					<div className={classes.wrapper}>
						<LocationOn className={classes.icon} color="action" />
						<TextField {...textEditorProps('location')} />
					</div>
					<div className={classes.wrapper}>
						<Notes className={classes.icon} color="action" />
						<TextField
							{...textEditorProps('notes')}
							multiline
							rows="2"
						/>
					</div>
				</div>
				<div className={classes.buttonGroup}>
					{!isNewAppointment && (
						<Button
							variant="outlined"
							color="secondary"
							className={classes.button}
							onClick={() => {
								visibleChange();
								commitAppointment('deleted');
							}}
						>
							Delete
						</Button>
					)}
					<Button
						variant="outlined"
						color="primary"
						className={classes.button}
						onClick={() => {
							visibleChange();
							applyChanges();
						}}
					>
						{isNewAppointment ? 'Create' : 'Save'}
					</Button>
				</div>
			</div>
		</AppointmentForm.Overlay>
	);
}

export default AppointmentFormContainer
