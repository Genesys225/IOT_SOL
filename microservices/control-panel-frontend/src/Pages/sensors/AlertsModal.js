import React, { useEffect, useMemo, useReducer, useRef } from 'react';
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
import Alert from '@material-ui/lab/Alert';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import { useDispatch, useSelector } from 'react-redux';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {
	COMMIT_ALERTS,
	COMMIT_FINISHED,
	updateAlerts,
	UPDATE_NEW_ALERT,
} from '../../store/actions/alertsActions';
import SaveIcon from '@material-ui/icons/Save';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
	alert: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2),
		},
	},
	modal: {
		display: 'flex',
		alignItems: (props) => (props.showAlert ? 'flex-end' : 'center'),
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
	actionGroup: {
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'row',
		marginTop: '10px',
	},
}));

function AlertsModal(props) {
	// @ts-ignore
	const [deviceAlert, setDeviceAlert] = useState([]);
	const { controls } = useSelector((state) => state);
	const [updatedAlertsToCommit, setUpdatedAlertsToCommit] = useState([]);
	// @ts-ignore
	const devices = useSelector((state) => state.sensors);
	const availableDevices = Object.values(devices.availableRooms).reduce(
		(roomDevices, availableDevices) => {
			return [...availableDevices, ...roomDevices];
		},
		[]
	);
	const alerts = useSelector(
		(state) =>
			// @ts-ignore
			state.alerts
	);

	const dispatch = useDispatch();

	const showAlert = !availableDevices.includes(props.deviceId);
	const classes = useStyles({ showAlert });

	const handleClose = () => {
		// @ts-ignore
		props.onClose();
	};

	const handleSave = () => {
		// @ts-ignore
		setUpdatedAlertsToCommit(deviceAlert);
	};
	useEffect(() => {
		let timeout = 0;
		const sendUpdateAlerts = async (alerts) => {
			await setUpdatedAlertsToCommit([]);
			await dispatch(updateAlerts(alerts, props.deviceId, props.roomId));
			// @ts-ignore
			props.onClose();
		};
		if (updatedAlertsToCommit.length > 0) {
			sendUpdateAlerts(updatedAlertsToCommit);
		}
		if (props.in && showAlert)
			timeout = setTimeout(() => {
				props.onClose();
			}, 2500);
		if (alerts && alerts.alerts.length > 0) {
			setDeviceAlert(
				alerts.alerts.filter(
					(alert) => alert.deviceId === props.deviceId
				)
			);
		}
		return () => timeout && clearTimeout(timeout);
	}, [updatedAlertsToCommit, dispatch, alerts]);

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
				invisible: showAlert,
				onClick: props.onClose,
			}}
		>
			<Fade in={props.in}>
				{showAlert ? (
					<div className={classes.alert}>
						<Alert severity="info">
							This is an info alert — check it out!
						</Alert>
					</div>
				) : (
					<Paper className={classes.paper}>
						<Box display="flex" flexDirection="row">
							<Typography
								id="transition-modal-title"
								variant="h5"
							>
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
							mb="3"
						>
							<Paper className={classes.paper}>
								<Box
									justifyContent="space-evenly"
									display="flex"
									alignItems="center"
									flexDirection="row"
								>
									{false ? (
										<Button
											variant="contained"
											color="primary"
											onClick={() => {}}
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
												<InputLabel id="operator-label">
													Operator
												</InputLabel>
												<Select
													labelId="operator-label"
													id="operator"
													value={
														deviceAlert.length > 0
															? deviceAlert[0]
																	.conditions[0]
																	.evaluator
																	.type
															: 'gt'
													}
													onChange={(event) => {
														// @ts-ignore
														dispatch({
															type: UPDATE_NEW_ALERT,
															payload: {
																op:
																	event.target
																		.value,
																deviceId:
																	props.deviceId,
															},
														});
													}}
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
													value={
														deviceAlert.length > 0
															? deviceAlert[0]
																	.conditions[0]
																	.evaluator
																	.params[0]
															: ''
													}
													variant="outlined"
													type="number"
													onChange={(event) =>
														// @ts-ignore
														dispatch({
															type: UPDATE_NEW_ALERT,
															payload: {
																threshold:
																	event.target
																		.value,
																deviceId:
																	props.deviceId,
															},
														})
													}
												/>
											</FormControl>
										</>
									)}
								</Box>
							</Paper>
						</Box>
						<Box className={classes.actionGroup}>
							<Button
								variant="contained"
								// @ts-ignore
								color="secondary"
								onClick={() => props.onClose()}
							>
								Cancel
							</Button>
							<Button
								variant="contained"
								color="primary"
								startIcon={<SaveIcon />}
								onClick={handleSave}
							>
								Save
							</Button>
						</Box>
					</Paper>
				)}
			</Fade>
		</Modal>
	);
}

export default AlertsModal;
