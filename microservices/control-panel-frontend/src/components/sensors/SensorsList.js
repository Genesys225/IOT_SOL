import React, { Suspense, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	getSensors,
	getLastData,
	updateSensor,
} from '../../store/actions/sensorsActions';
import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {
	Divider,
	Card,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Box,
	Collapse,
} from '@material-ui/core';
import CenteredCircular from '../common/CenteredCircular';
import { Icon } from '../Icons/Icon-Library';
import { sendCommand } from '../../store/actions/controls';
import SensorIframe from './SensorIframe';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		backgroundColor: 'dark',
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 30,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
}));

export default function SensorsList() {
	const sensors = useSelector(
		(state) =>
			// @ts-ignore
			state.sensors
	);
	const classes = useStyles();
	const dispatch = useDispatch();

	useEffect(() => {
		let interval;
		const fetchSensors = async () => {
			await dispatch(getSensors());
		};
		const fetchSensorsData = async () => {
			await dispatch(getLastData());
		};
		if (sensors.length <= 0) fetchSensors();
		else
			interval = setInterval(() => {
				fetchSensorsData();
			}, 5000);
		return () => clearInterval(interval);
	}, [dispatch, sensors]);

	if (sensors.length <= 0) {
		return <CenteredCircular />;
	}
	return (
		<Suspense fallback={<CenteredCircular />}>
			<Card>
				<List
					subheader={<ListSubheader>Settings</ListSubheader>}
					className={classes.root}
				>
					<Divider key="0" />

					{sensors.map((sensor) => (
						<RenderSensorListItem {...sensor} key={sensor.id} />
					))}
				</List>
			</Card>
		</Suspense>
	);
}

const RenderSensorListItem = (props) => {
	const [open, setOpen] = useState(false);
	const listItemRef = useRef(null);
	const classes = useStyles();
	const dispatch = useDispatch();
	const [checked, setChecked] = useState([]);
	const [zone, setZone] = useState(props.meta.zone || '');
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

	const handleClick = () => {
		setOpen(!open);
	};

	return (
		<>
			<ListItem ref={listItemRef} onClick={handleClick} button>
				<Box
					display="flex"
					justifyContent="between"
					alignItems="stretch"
					width="100%"
					flexWrap="wrap"
				>
					<Box
						display="flex"
						width="100%"
						minWidth="400px"
						flexWrap="wrap"
						mr="50%"
						alignItems="center"
					>
						<ListItemIcon>
							<Icon icon={props.type} />
						</ListItemIcon>
						<ListItemText
							id="zone-label"
							primary={props.type}
							secondary={props.id}
						/>
					</Box>

					<Box
						display="flex"
						justifyContent="between"
						minWidth="400px"
						width="100%"
						alignItems="center"
						flexWrap="wrap"
						ml="50%"
					>
						<ListItemSecondaryAction>
							<FormControl className={classes.formControl}>
								<InputLabel shrink id="zone-label">
									Zone
								</InputLabel>
								<Select
									labelId="zone-label"
									id="zone"
									value={zone}
									onChange={handleChange}
									displayEmpty
									className={classes.selectEmpty}
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									<MenuItem value="zone_1">Zone 1</MenuItem>
									<MenuItem value="zone_2">Zone 2</MenuItem>
									<MenuItem value="zone_3">Zone 3</MenuItem>
								</Select>
							</FormControl>

							<FormControl className={classes.formControl}>
								<TextField
									id={props.id + '-value'}
									label="Current value"
									value={props.value || ''}
									InputProps={{
										readOnly: true,
									}}
								/>
							</FormControl>
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
							<FormControl className={classes.formControl}>
								<Box
									display="flex"
									alignItems="center"
									justifyContent="center"
								>
									{open ? <ExpandLess /> : <ExpandMore />}
								</Box>
							</FormControl>
						</ListItemSecondaryAction>
					</Box>
				</Box>
			</ListItem>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<Box display="flex" justifyContent="center">
					<SensorIframe id={props.id} listItemRef={listItemRef} />
				</Box>
			</Collapse>
			<Divider />
		</>
	);
};
