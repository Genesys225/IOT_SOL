import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { Link } from 'react-router-dom';
import { Icon } from '../Icons/Icon-Library';
import { useSelector } from 'react-redux';

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

		<ListItemLink to="/scheduler">
			<ListItemIcon>
				<Icon icon="calendar" />
			</ListItemIcon>
			<ListItemText primary="Scheduler" />
		</ListItemLink>
	</>
);

export const SecondaryMenu = () => {
	// @ts-ignore
	const rooms = useSelector((state) => Object.keys(state.sensors));

	return (
		<>
			<ListSubheader inset>Secondary Menu</ListSubheader>
			{rooms.map((room, i) => (
				<ListItemLink to={`/rooms/${room}`} key={`${room}`}>
					<ListItemIcon>
						<Icon icon="room" />
					</ListItemIcon>
					<ListItemText primary={`${room}`} />
				</ListItemLink>
			))}
		</>
	);
};
