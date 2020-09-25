import React, { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSensors, getLastData } from '../../store/actions/sensorsActions';
import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import {
	Divider,
	Card,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@material-ui/core';
import CenteredCircular from '../common/CenteredCircular';
import SensorListItem from './SensorListItem';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	},
	roomTileBar: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	roomSelect: {
		marginTop: theme.spacing(2),
		width: 100,
	},
}));

export default function SensorsList() {
	const [room, setRoom] = React.useState('All');
	// @ts-ignore
	const availableRooms = useSelector((state) => Object.keys(state.sensors));
	const sensors = useSelector((state) =>
		room === 'All'
			? // @ts-ignore

			  state.sensors.All.filter(
					(device) => !device.title.includes('Gauge')
			  )
			: // @ts-ignore
			  state.sensors.All.filter((device) => device.room === room)
	);
	const handleChange = (event) => setRoom(event.target.value);

	const classes = useStyles();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchSensors = async () => {
			await dispatch(getSensors());
		};
		if (sensors.length <= 0) fetchSensors();
	}, [dispatch, sensors]);

	if (sensors.length <= 0) {
		return <CenteredCircular />;
	}
	return (
		<Suspense fallback={<CenteredCircular />}>
			<Card>
				<List
					subheader={
						<Box className={classes.roomTileBar}>
							<ListSubheader>Settings</ListSubheader>
							<FormControl className={classes.formControl}>
								<InputLabel htmlFor="room-filter">
									Room
								</InputLabel>
								<Select
									labelId="room-filter"
									value={room}
									id="room"
									displayEmpty
									onChange={handleChange}
									className={classes.roomSelect}
									defaultValue="All"
								>
									{availableRooms.map((room, i) => (
										<MenuItem value={room}>
											{i > 0 ? `Room ${i}` : <em>All</em>}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
					}
					className={classes.root}
				>
					<Divider key="0" />
					{sensors.map((sensor) => (
						<SensorListItem {...sensor} key={sensor.deviceId} />
					))}
				</List>
			</Card>
		</Suspense>
	);
}
