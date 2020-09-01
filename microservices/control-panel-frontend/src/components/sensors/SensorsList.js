import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSensors } from '../../store/actions/sensorsActions';
import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import WifiIcon from '@material-ui/icons/Wifi';
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

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		backgroundColor: theme.palette.background.paper,
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

export default function SensorsList() {
	// @ts-ignore
	const sensors = useSelector((state) => state.sensors);
	const classes = useStyles();
	const dispatch = useDispatch();

	const fetchSensors = async () => {
		await dispatch(getSensors());
	};

	useEffect(() => {
		if (sensors.length <= 0) fetchSensors();
		/** @todo dispatch get sensor data */
		// const interval = setInterval(() => {
		// 	console.log('This will run every second!');
		// }, 1000);
		// return () => clearInterval(interval);
	}, [dispatch, sensors]);

	if (sensors.length <= 0) return null;

	return (
		<Card>
			<List
				subheader={<ListSubheader>Settings</ListSubheader>}
				className={classes.root}
			>
				<Divider />

				{sensors.map((sensor) => (
					<RenderSensorListItem {...sensor} />
				))}
			</List>
		</Card>
	);
}

const RenderSensorListItem = (props) => {
	const classes = useStyles();
	const [checked, setChecked] = React.useState(['wifi']);
	const [zone, setZone] = React.useState('');
	const [value, setValue] = React.useState('');

	const handleChange = (event) => {
		setZone(event.target.value);
	};
	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};
	return (
		<div key={props.id}>
			<ListItem key={props.id}>
				<ListItemIcon>
					<WifiIcon />
				</ListItemIcon>
				<ListItemText
					id="switch-list-label-wifi"
					primary={props.type}
					secondary={props.id}
				/>

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
							<MenuItem value={10}>Ten</MenuItem>
							<MenuItem value={20}>Twenty</MenuItem>
							<MenuItem value={30}>Thirty</MenuItem>
						</Select>
					</FormControl>

					<FormControl className={classes.formControl}>
						<TextField
							id="value"
							label="Current value"
							value={value}
							defaultValue="waiting..."
						/>
					</FormControl>
				</Box>
				<ListItemSecondaryAction>
					<Switch
						edge="end"
						onChange={handleToggle(props.id)}
						checked={checked.indexOf(props.id) !== -1}
						inputProps={{
							'aria-labelledby': 'switch-list-label-wifi',
						}}
					/>
				</ListItemSecondaryAction>
			</ListItem>
			<Divider />
		</div>
	);
};
