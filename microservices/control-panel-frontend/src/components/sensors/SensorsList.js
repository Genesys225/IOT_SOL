import React, { Suspense, useState } from 'react';
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
import {
	Divider,
	Card,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Box,
} from '@material-ui/core';
import CenteredCircular from '../common/CenteredCircular';
import { Icon } from '../Icons/Icon-Library';
import { sendCommand } from '../../store/actions/controls';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		backgroundColor: theme.palette.background.paper,
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 30,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
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
	return (
		<div>
			<ListItem>
				<ListItemIcon>
					<Icon icon={props.type} />
				</ListItemIcon>
				<ListItemText
					id="switch-list-label-wifi"
					primary={props.type}
					secondary={props.id}
				/>
				<ListItemSecondaryAction>
					<Box flexDirection="row" justifyContent="end">
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
								edge="end"
								onChange={handleToggle(props.id)}
								checked={checked.indexOf(props.id) !== -1}
								inputProps={{
									'aria-labelledby': 'switch-list-label-wifi',
								}}
							/>
						</FormControl>
					</Box>
				</ListItemSecondaryAction>
			</ListItem>
			<Divider />
		</div>
	);
};
