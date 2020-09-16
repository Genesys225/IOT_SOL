import React, { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSensors, getLastData } from '../../store/actions/sensorsActions';
import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import { Divider, Card } from '@material-ui/core';
import CenteredCircular from '../common/CenteredCircular';
import SensorListItem from './SensorListItem';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	},
}));

export default function SensorsList() {
	const sensors = useSelector(
		(state) =>
			// @ts-ignore
			state.sensors.All
	);
	console.log(sensors);

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
						<SensorListItem {...sensor} key={sensor.deviceId} />
					))}
				</List>
			</Card>
		</Suspense>
	);
}
