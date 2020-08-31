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
const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		backgroundColor: theme.palette.background.paper,
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

	const [checked, setChecked] = React.useState(['wifi']);

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
	const RenderSensorListItem = (props) => {
		return (
			<ListItem key={props.id}>
				<ListItemIcon>
					<WifiIcon />
				</ListItemIcon>
				<ListItemText
					id="switch-list-label-wifi"
					primary={props.type}
					secondary={props.id}
				/>
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
		);
	};

	useEffect(() => {
		if (Object.keys(sensors).length <= 0) fetchSensors();
		/** @todo dispatch get sensor data */
		// const interval = setInterval(() => {
		// 	console.log('This will run every second!');
		// }, 1000);
		// return () => clearInterval(interval);
	}, [dispatch, sensors]);

	if (sensors.length <= 0) return null;

	return (
		<List
			subheader={<ListSubheader>Settings</ListSubheader>}
			className={classes.root}
		>
			<ListItem>
				<ListItemIcon>
					<WifiIcon />
				</ListItemIcon>
				<ListItemText id="switch-list-label-wifi" primary="Wi-Fi" />
				<ListItemSecondaryAction>
					<Switch
						edge="end"
						onChange={handleToggle('wifi')}
						checked={checked.indexOf('wifi') !== -1}
						inputProps={{
							'aria-labelledby': 'switch-list-label-wifi',
						}}
					/>
				</ListItemSecondaryAction>
			</ListItem>
			{sensors.map((sensor) => (
				<RenderSensorListItem {...sensor} />
			))}
		</List>
	);
}
