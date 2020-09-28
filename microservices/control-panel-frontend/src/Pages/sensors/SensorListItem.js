import {
	Box,
	Collapse,
	Divider,
	FormControl,
	Grow,
	Paper,
	IconButton,
	InputAdornment,
	InputLabel,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	makeStyles,
	MenuItem,
	Select,
	Switch,
	TextField,
} from '@material-ui/core';
import clsx from 'clsx';
import React, { useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendCommand } from '../../store/actions/controls';
import { updateDeviceZone } from '../../store/actions/sensorsActions';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Icon } from '../../components/Icons/Icon-Library';
import SensorIframe from './SensorIframe';
import EditIcon from '@material-ui/icons/Edit';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import AlertsModal from './AlertsModal';

const useStyles = makeStyles((theme) => ({
	paper: {
		margin: theme.spacing(1),
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 30,
		maxWidth: 110,
	},
	rotateSwitch: {
		transform: 'rotate(270deg)',
	},
	zoneSelect: {
		marginTop: theme.spacing(2),
		width: 100,
	},
	listItem: {
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'column',
		alignItems: 'center',
		width: '100%',
	},
	listItemSecondary: {
		display: 'flex',
		width: '100%',
		flexWrap: 'wrap',
		alignItems: 'center',
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
}));

const SensorListItem = (props) => {
	const switched = useSelector((state) =>
		// @ts-ignore
		state.controls.switched.includes(props.deviceId)
	);
	const [open, setOpen] = useState(false);
	const [showAlertsModal, setShowAlertModal] = useState(false);
	const [zone, setZone] = useState(props.room || '');
	const listItemRef = useRef(null);
	const classes = useStyles();
	const dispatch = useDispatch();

	const units = {
		temp: 'C°',
		humidity: 'R/H%',
		hum: 'R/H%',
		co2: 'PPM',
		lux: 'Lux',
		light: 'Lux',
	};

	const handleChange = (event) => {
		setZone(event.target.value);
		dispatch(
			updateDeviceZone({
				idFrom: props.room,
				idTo: event.target.value,
				deviceId: props.deviceId,
			})
		);
	};

	const handleToggle = () => {
		dispatch(
			sendCommand({
				id: props.deviceId,
				command: !switched ? 'on' : 'off',
			})
		);
	};

	const handleClick = (event) => {
		const tagName = (event.target.tagName || '').toLowerCase();
		if (
			tagName &&
			tagName !== 'li' &&
			tagName !== 'path' &&
			tagName !== 'svg' &&
			tagName !== 'button' &&
			tagName !== 'input'
		)
			setOpen(!open);
	};

	const handleEdit = (event) => {
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();
		event.preventDefault();
		setShowAlertModal(true);
	};

	const closeAlertsModal = useCallback(() => {
		setShowAlertModal(false);
	}, [setShowAlertModal]);

	return (
		<>
			<ListItem ref={listItemRef} onClick={handleClick} button>
				<Box className={classes.listItem}>
					<Box className={classes.listItemSecondary}>
						<FormControl className={classes.formControl}>
							{open ? <ExpandLess /> : <ExpandMore />}
						</FormControl>
						<Divider
							orientation="vertical"
							style={{
								height: '100%',
							}}
						/>
						<ListItemIcon className={classes.formControl}>
							<Icon icon={props.deviceType} size="40px" />
						</ListItemIcon>
						<Box display="flex" flexDirection="row-reverse">
							{props.deviceType !== 'switch' && (
								<ListItemIcon onClick={handleEdit}>
									<IconButton
										aria-label="alerts"
										color="secondary"
									>
										<NotificationsActiveIcon />
									</IconButton>
								</ListItemIcon>
							)}
							<ListItemIcon>
								<IconButton
									aria-label="edit"
									color="primary"
									onClick={handleEdit}
								>
									<EditIcon />
								</IconButton>
							</ListItemIcon>
							<ListItemText
								id="zone-label"
								primary={props.deviceType}
								secondary={props.deviceId}
							/>
						</Box>
					</Box>

					<ListItemSecondaryAction>
						<Box className={classes.listItemSecondary}>
							<FormControl className={classes.formControl}>
								<InputLabel shrink id="zone-label">
									Room
								</InputLabel>
								<Select
									labelId="zone-label"
									id="zone"
									value={zone}
									onChange={handleChange}
									className={classes.zoneSelect}
								>
									<MenuItem value="All">
										<em>All</em>
									</MenuItem>
									<MenuItem value="room1">Room 1</MenuItem>
									<MenuItem value="room2">Room 2</MenuItem>
									<MenuItem value="room3">Room 3</MenuItem>
								</Select>
							</FormControl>

							<FormControl
								className={classes.formControl}
								variant="filled"
							>
								<TextField
									id={props.deviceId + '-value'}
									value={props.currentValue || ''}
									label="Current value"
									InputProps={{
										endAdornment:
											props.deviceType !== 'switch' ? (
												<>
													{props.deviceId && (
														<InputAdornment position="end">
															{
																units[
																	props
																		.deviceType
																]
															}
														</InputAdornment>
													)}
												</>
											) : null,
									}}
								/>
							</FormControl>
							<Divider variant="fullWidth" />
							{props.deviceType === 'switch' && (
								<FormControl
									className={clsx(
										classes.formControl,
										classes.rotateSwitch
									)}
								>
									<Switch
										edge="start"
										onChange={handleToggle}
										checked={switched}
										inputProps={{
											'aria-labelledby':
												'switch-list-label-wifi',
										}}
									/>
								</FormControl>
							)}
						</Box>
					</ListItemSecondaryAction>
				</Box>
			</ListItem>
			<Collapse ref={listItemRef} in={open} timeout="auto" unmountOnExit>
				<Box display="flex" justifyContent="center">
					<Grow in={switched} unmountOnExit>
						<Paper elevation={2} className={classes.paper}>
							<h5>WOW!!!</h5>
						</Paper>
					</Grow>
					<SensorIframe
						id={props.deviceId}
						listItemRef={listItemRef}
					/>
				</Box>
			</Collapse>
			<Divider />
			<AlertsModal
				in={showAlertsModal}
				onClose={closeAlertsModal}
				{...props}
			/>
		</>
	);
};

export default SensorListItem;
