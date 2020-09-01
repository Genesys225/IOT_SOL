import React from 'react';
import clsx from 'clsx';
import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Badge,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useStyles } from '../hooks/useStyles';

const TopBar = (props) => {
	const classes = useStyles();
	return (
		<AppBar
			position="absolute"
			className={clsx(classes.appBar, props.open && classes.appBarShift)}
		>
			<Toolbar className={classes.toolbar}>
				<IconButton
					edge="start"
					color="inherit"
					aria-label="open drawer"
					onClick={props.handleDrawerOpen}
					className={clsx(
						classes.menuButton,
						props.open && classes.menuButtonHidden
					)}
				>
					<MenuIcon />
				</IconButton>
				<Typography
					component="h1"
					variant="h6"
					color="inherit"
					noWrap
					className={classes.title}
				>
					Dashboard
				</Typography>
				<IconButton color="inherit">
					<Badge badgeContent={4} color="secondary">
						<NotificationsIcon />
					</Badge>
				</IconButton>
			</Toolbar>
		</AppBar>
	);
};

export default TopBar;
