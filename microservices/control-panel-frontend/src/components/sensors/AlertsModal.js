import React, { useEffect, useMemo, useReducer } from 'react';
import {
	Backdrop,
	makeStyles,
	Modal,
	Fade,
	Paper,
	Box,
	Typography,
	Select,
	MenuItem,
	TextField,
	FormControl,
	InputLabel,
	Button,
} from '@material-ui/core';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import { useDispatch, useSelector } from 'react-redux';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { updateAlerts } from '../../store/actions/alertsActions';
const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: '1px solid #fafafa',
		width: '410px',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		borderRadius: 'borderRadius',
	},
	formControl: {
		margin: theme.spacing(1),
		width: '100px',
	},
	button: {
		margin: theme.spacing(1),
	},
}));

const initialState = (props, sensors, alerts) => ({
	sensorId: props.deviceId,
	sensor: sensors.find((sensor) => sensor.deviceId === props.deviceId),
	alerts: [
		...alerts.alerts,
		{
			id: null,
			op: 'gt',
			threshold: props.threshold || '',
			actions: [],
		},
	],
	controlledParticipants: [],
	alertChannels: [],
	creating: false,
	updatedAlertsToCommit: [],
});

const COMMIT_ALERTS = 'COMMIT_ALERTS';
const COMMIT_FINISHED = 'COMMIT_FINISHED';
const INIT_ALERT_CREATION = 'INIT_ALERT_CREATION';
const UPDATE_NEW_ALERT = 'UPDATE_NEW_ALERT';
const UPDATE_EXISTING_ALERT = 'UPDATE_EXISTING_ALERT';

const reducer = (state, { type, payload }) => {
	switch (type) {
		case INIT_ALERT_CREATION:
			return { ...state, creating: true };

		case UPDATE_NEW_ALERT:
			const updatedAlerts = state.alerts.map((alert) =>
				alert.id === null ? { ...alert, ...payload } : alert
			);
			return { state, alerts: updatedAlerts };

		case UPDATE_EXISTING_ALERT: {
			const updatedAlerts = state.alerts.map((alert) =>
				alert.id === payload.id ? { ...payload, edited: true } : alert
			);
			return { state, alerts: updatedAlerts };
		}

		case COMMIT_ALERTS:
			const updatedAlertsToCommit = state.alerts.filter(
				(alert) => alert.edited || alert.id === null
			);
			return { ...state, updatedAlertsToCommit };

		case COMMIT_FINISHED:
			return {
				...state,
				creating: false,
				alerts: state.alerts.map((alert) => {
					if (alert.edited) delete alert.edited;
					return alert;
				}),
				updatedAlertsToCommit: [],
			};

		default:
			return state;
	}
};

function AlertsModal(props) {
	// @ts-ignore
	const { controls, alerts } = useSelector((state) => state);
	// @ts-ignore
	const sensors = useSelector((state) => state.sensors.All);
	const [state, dispatch] = useReducer(
		reducer,
		initialState(props, sensors, alerts)
	);
	const thunkDispatch = useDispatch();
	const alertsCount = useMemo(() => {
		const { alerts } = state;
		return alerts.length >= 1 && alerts[0].id !== null ? alerts.length : 0;
	}, [state]);
	const handleFirstRule = () => {
		// @ts-ignore
		dispatch({
			type: INIT_ALERT_CREATION,
			payload: { alertId: new Date() },
		});
	};
	const classes = useStyles();

	const handleClose = () => {
		if (state.creating) {
			// @ts-ignore
			dispatch({ type: COMMIT_ALERTS });
			props.onClose();
		}
	};
	const { updatedAlertsToCommit } = state;
	useEffect(() => {
		const sendUpdateAlerts = async (alerts) => {
			await thunkDispatch(updateAlerts(alerts, props.deviceId));
			// @ts-ignore
			dispatch({ type: COMMIT_FINISHED });
		};
		if (updatedAlertsToCommit.length > 0) {
			sendUpdateAlerts(updatedAlertsToCommit);
		}
	}, [updatedAlertsToCommit]);

	return (
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			className={classes.modal}
			open={props.in}
			onClose={handleClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={props.deviceId}>
				<Paper className={classes.paper}>
					<Box display="flex" flexDirection="row">
						<Typography id="transition-modal-title" variant="h5">
							Alerts{' '}
						</Typography>
						<NotificationsActiveIcon />
					</Box>

					<Typography id="transition-modal-title" variant="h6">
						if temperature is
					</Typography>
					<Box
						justifyContent="space-evenly"
						display="flex"
						flexDirection="row"
					>
						<Paper className={classes.paper}>
							<Box
								justifyContent="space-evenly"
								display="flex"
								alignItems="center"
								flexDirection="row"
							>
								{alertsCount === 0 && !state.creating ? (
									<Button
										variant="contained"
										color="primary"
										onClick={handleFirstRule}
										size="large"
										className={classes.button}
										startIcon={<AddCircleOutlineIcon />}
									>
										Add new alert
									</Button>
								) : (
									<>
										<FormControl
											className={classes.formControl}
										>
											<InputLabel id="zone-label">
												Operator
											</InputLabel>
											<Select
												labelId="zone-label"
												id="zone"
												value={
													state.alerts[0]
														.compareOperator
												}
												defaultValue="gt"
											>
												<MenuItem value="eq">
													Equals
												</MenuItem>
												<MenuItem value="gt">
													Above
												</MenuItem>
												<MenuItem value="lt">
													Less than
												</MenuItem>
												<MenuItem value="neq">
													Not equals
												</MenuItem>
											</Select>
										</FormControl>
										<FormControl
											className={classes.formControl}
										>
											<TextField
												id="filled-multiline-static"
												label="Limit"
												defaultValue=""
												variant="outlined"
												type="number"
											/>
										</FormControl>
									</>
								)}
							</Box>
						</Paper>
					</Box>
					<p id="transition-modal-description">
						react-transition-group animates me.
					</p>
				</Paper>
			</Fade>
		</Modal>
	);
}

export default AlertsModal;
