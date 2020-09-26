import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BarChartIcon from '@material-ui/icons/BarChart';
import { Link } from 'react-router-dom';
import { Icon } from '../Icons/Icon-Library';

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
				<BarChartIcon />
			</ListItemIcon>
			<ListItemText primary="Scheduler" />
		</ListItemLink>
	</>
);

export const SecondaryMenu = (
	<>
		<ListSubheader inset>Secondary Menu</ListSubheader>
	</>
);
