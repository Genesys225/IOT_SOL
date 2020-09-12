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
	useTheme,
} from '@material-ui/core';
import React, { useRef, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { sendCommand } from '../../store/actions/controls';
import { updateSensor } from '../../store/actions/sensorsActions';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Icon } from '../Icons/Icon-Library';
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
	const theme = useTheme()
	const [open, setOpen] = useState(false);
	const [showAlertsModal, setShowAlertModal] = useState(false);
	const [checked, setChecked] = useState([]);
	const [zone, setZone] = useState(props.meta.zone || '');
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
			updateSensor({ id: props.id, meta: { zone: event.target.value } })
		);
	};

	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];
		dispatch(
			sendCommand({
				id: props.id,
				params: { command: currentIndex === -1 ? 'ON' : 'OFF' },
			})
		);
		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	const handleClick = (event) => {
		console.log(event.target.tagName, this);
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
	
	const closeAlertsModal = useCallback( () => {
		setShowAlertModal(false)
	},[setShowAlertModal])

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
							<Icon icon={props.type} />
						</ListItemIcon>
						<Box display="flex" flexDirection="row-reverse">
							<ListItemIcon onClick={handleEdit}>
								<IconButton
									aria-label="alerts"
									color="secondary"
								>
									<NotificationsActiveIcon />
								</IconButton>
							</ListItemIcon>
							<ListItemIcon>
								<IconButton aria-label="edit" onClick={handleEdit}>
									<EditIcon color="action" />
								</IconButton>
							</ListItemIcon>
							<ListItemText
								id="zone-label"
								primary={props.type}
								secondary={props.id}
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
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									<MenuItem value="zone_1">Room 1</MenuItem>
									<MenuItem value="zone_2">Room 2</MenuItem>
									<MenuItem value="zone_3">Room 3</MenuItem>
								</Select>
							</FormControl>

							<FormControl
								className={classes.formControl}
								variant="filled"
							>
								<TextField
									id={props.id + '-value'}
									value={props.value || ''}
									label="Current value"
									InputProps={{
										endAdornment: (
											<>
												{props.value && (
													<InputAdornment position="end">
														{units[props.type]}
													</InputAdornment>
												)}
											</>
										),
									}}
								/>
							</FormControl>
							<Divider variant="fullWidth" />
							<FormControl className={classes.formControl}>
								<Switch
									edge="start"
									onChange={handleToggle(props.id)}
									checked={checked.indexOf(props.id) !== -1}
									inputProps={{
										'aria-labelledby':
											'switch-list-label-wifi',
									}}
								/>
							</FormControl>
						</Box>
					</ListItemSecondaryAction>
				</Box>
			</ListItem>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<Box display="flex" justifyContent="center">
					<Grow in={checked.indexOf(props.id) !== -1} unmountOnExit>
						<Paper elevation={2} className={classes.paper}>
							<h5>WOW!!!</h5>
						</Paper>
					</Grow>
					<SensorIframe id={props.id} listItemRef={listItemRef} />
				</Box>
			</Collapse>
			<Divider />
			<AlertsModal in={showAlertsModal} onClose={closeAlertsModal}/>
		</>
	);
};

export default SensorListItem;
