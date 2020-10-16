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
		maxWidth: 120,
	},
	rotateSwitch: {
		transform: 'rotate(270deg)',
	},
	zoneSelect: {
		marginTop: theme.spacing(2),
		width: 120,
	},
	listItem: {
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
		minWidth: '795px',
		width: '100%',
	},
	listItemSecondary: {
		display: 'flex',
		width: '100%',
		alignItems: 'center',
	},
	listItemData: {
		height: 180,
		justifyContent: 'space-evenly',
		flexDirection: 'column',
		display: 'flex',
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
	const [zone, setZone] = useState(props.roomId || '');
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
				idFrom: props.roomId,
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
			<ListItem ref={listItemRef}>
				<Paper className={classes.listItem}>
					<Box className={classes.listItemData}>
						<Box
							display="flex"
							flexDirection="row-reverse"
							justifyContent="start"
						>
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
							<ListItemIcon className={classes.formControl}>
								<Icon icon={props.deviceType} size="40px" />
							</ListItemIcon>
						</Box>
						<Box className={classes.listItemSecondary}>
							<Box
								display="flex"
								width="100%"
								justifyContent="space-between"
								alignItems="center"
							>
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
										<MenuItem value="MainRoom">
											<em>MainRoom</em>
										</MenuItem>
										<MenuItem value="room1">
											Room 1
										</MenuItem>
										<MenuItem value="room2">
											Room 2
										</MenuItem>
										<MenuItem value="room3">
											Room 3
										</MenuItem>
									</Select>
								</FormControl>
								<SensorIframe
									id={props.deviceId + 'Gauge'}
									height={100}
									width={100}
								/>
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
						</Box>
					</Box>

					<Box display="flex" justifyContent="center">
						<SensorIframe
							id={props.deviceId}
							height={180}
							width={600}
						/>
					</Box>
				</Paper>
			</ListItem>
			<AlertsModal
				in={showAlertsModal}
				onClose={closeAlertsModal}
				{...props}
			/>
		</>
	);
};

export default SensorListItem;
