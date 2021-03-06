import React, { Suspense, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	getSensors /* , getLastData */,
} from '../../store/actions/sensorsActions';
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
	GridList,
	GridListTile,
	useTheme,
} from '@material-ui/core';
import CenteredCircular from '../../components/common/CenteredCircular';
import SensorListItem from './SensorListItem';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
	root: {
		width: '100%',
	},
	roomTileBar: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	formControl: {
		margin: spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: spacing(2),
	},
	roomSelect: {
		marginTop: spacing(2),
		width: 150,
	},
	gridList: {
		justifyContent: 'center',
	},
}));

export default function SensorsList() {
	const [fetched, setFetched] = useState(false)
	// const {
	// 	breakpoints: { up },
	// } = useTheme();
	// const cols = up('xl') ? 2 : 1;
	const [room, setRoom] = React.useState('MainRoom');
	// @ts-ignore
	const availableRooms = useSelector((state) => [
		'MainRoom',
		// @ts-ignore
		...Object.keys(state.sensors.availableRooms).filter(
			// @ts-ignore
			(roomId) => state.sensors.availableRooms[roomId].length > 0
		),
	]);
	const sensors = useSelector((state) =>
		room === 'MainRoom'
			? // @ts-ignore
			  state.sensors.devices.filter(
					(device) => !device.title.includes('Gauge')
			  )
			: // @ts-ignore
			  state.sensors.devices.filter((device) => device.roomId === room)
	);
	const handleChange = useCallback((event) => setRoom(event.target.value), [
		setRoom,
	]);

	const classes = useStyles();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchSensors = async () => {
			await dispatch(getSensors());
		};
		// const fetchLastData = async () => {
		// 	await dispatch(getLastData());
		// };
		if (!fetched) fetchSensors();
		setFetched(true)
		// const timeout = setTimeout(async () => {
		// 	await fetchLastData();
		// }, 5000);
		// return () => clearTimeout(timeout);
	}, [dispatch, fetched]);

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
									defaultValue="MainRoom"
								>
									{availableRooms.map((room, i) => (
										<MenuItem value={room} key={i}>
											{room}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
					}
					className={classes.root}
				>
					<Divider key="0" />
				</List>
				<GridList
					cellHeight={200}
					cols={{xl: 2, lg:1}}
					className={classes.gridList}
				>
					{sensors.map((sensor, index) => (
						<GridListTile key={index} cols={1} component="div">
							<SensorListItem {...sensor} key={sensor.deviceId} />
						</GridListTile>
					))}
				</GridList>
			</Card>
		</Suspense>
	);
}
