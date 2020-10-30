import React, { useEffect } from 'react';
import {
	Backdrop,
	makeStyles,
	Modal,
	Fade,
	Paper,
	Box,
	Typography,
	Button,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import { useDispatch, useSelector } from 'react-redux';
import { updateAlerts } from '../../../store/actions/alertsActions';
import SaveIcon from '@material-ui/icons/Save';
import { useState } from 'react';
import ThresholdConditionsInput from './thresholdConditionsInput';

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

						<ThresholdConditionsInput
							deviceAlert={deviceAlert}
							deviceId={props.deviceId}
						/>
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
