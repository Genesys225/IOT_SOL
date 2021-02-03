import React, { useEffect, useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { Icon } from '../components/Icons/Icon-Library';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Link as MuiLink } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { getSensors } from '../store/actions/sensorsActions';

function ListItemLink(props) {
	return <ListItem button component={Link} {...props} />;
}

export const MainMenu = (
	<>
		<ListItemLink to="/">
			<ListItemIcon>
				<DashboardIcon />
			</ListItemIcon>
			<ListItemText primary="Dashboard" />
		</ListItemLink>
		<ListItemLink to="/sensors">
			<ListItemIcon>
				<Icon icon="sensors" />
			</ListItemIcon>
			<ListItemText primary="Sensors" />
		</ListItemLink>
		<ListItemLink to="/ag-grid">
			<ListItemIcon>
				<Icon icon="ag-grid" />
			</ListItemIcon>
			<ListItemText primary="ag-grid" />
		</ListItemLink>

		<ListItemLink to="/scheduler">
			<ListItemIcon>
				<Icon icon="calendar" />
			</ListItemIcon>
			<ListItemText primary="Scheduler" />
		</ListItemLink>
	</>
);

export const SecondaryMenu = (props) => {
	const dispatch = useDispatch();
	const [fetched, setFetched] = useState(false);
	useEffect(() => {
		const fetchSensors = async () => {
			await dispatch(getSensors());
		};
		if (!fetched) fetchSensors();
		setFetched(true);
	}, [dispatch, fetched]);
	const rooms = useSelector((state) => [
		'MainRoom',
		// @ts-ignore
		...Object.keys(state.sensors.availableRooms).filter(
			// @ts-ignore
			(roomId) => state.sensors.availableRooms[roomId].length > 0
		),
	]);

	return (
		<>
			<ListSubheader inset>Secondary Menu</ListSubheader>
			<Box
				justifyContent="space-between"
				display="flex"
				flexDirection="column"
				height="calc(100vh - 300px)"
			>
				<Box>
					{rooms.map((room, i) => (
						<ListItemLink to={`/rooms/${room}`} key={`${room}`}>
							<ListItemIcon>
								<Icon icon="room" />
							</ListItemIcon>
							<ListItemText primary={`${room}`} />
						</ListItemLink>
					))}
				</Box>
				{props.open && <Copyright />}
			</Box>
		</>
	);
};

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<MuiLink color="inherit" href="https://material-ui.com/">
				Your Website
			</MuiLink>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}
