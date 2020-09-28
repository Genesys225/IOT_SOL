import React, { useContext, useState } from 'react';
import clsx from 'clsx';
import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Badge,
	Box,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useStyles } from '../components/hooks/useStyles';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import { MuiCtx, setPaletteType } from '../components/hooks/muiState';
import { useTheme } from '@material-ui/styles';

const TopBar = (props) => {
	const { theme, dispatch } = useContext(MuiCtx);
	const [darkTheme, setDarkTheme] = useState(false);
	const handleSwitchPalette = () => {
		setDarkTheme(!darkTheme);
		dispatch(
			// @ts-ignore
			setPaletteType(darkTheme ? 'dark' : 'light')
		);
	};
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
				<Box>
					<IconButton color="inherit">
						<Badge badgeContent={4} color="secondary">
							<NotificationsIcon />
						</Badge>
					</IconButton>
					<IconButton color="inherit" onClick={handleSwitchPalette}>
						<Brightness4Icon />
					</IconButton>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default TopBar;
