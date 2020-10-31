import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Badge,
	Box,
	CssBaseline,
	Button,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useStyles } from '../components/hooks/useStyles';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import { MuiCtx, setPaletteType } from '../components/hooks/muiState';
import { useAuth0 } from '@auth0/auth0-react';
import { rest } from '../restClient/fetchWrapper';

const TopBar = (props) => {
	const {
		loginWithRedirect,
		logout,
		isAuthenticated,
		getAccessTokenSilently,
	} = useAuth0();
	const { dispatch } = useContext(MuiCtx);
	const [token, setToken] = useState(null);
	const [darkTheme, setDarkTheme] = useState(false);
	const handleSwitchPalette = () => {
		setDarkTheme(!darkTheme);
		dispatch(
			// @ts-ignore
			setPaletteType(darkTheme ? 'dark' : 'light')
		);
	};
	const classes = useStyles();
	useEffect(() => {
		const getUserMetadata = async () => {
			const domain = 'iot-sol.eu.auth0.com';

			try {
				const accessToken = await getAccessTokenSilently({
					audience: `https://${domain}/api/v2/`,
					scope: 'read:current_user',
				});
				setToken(accessToken);
				rest.setAuthToken(`Bearer ${accessToken}`);
			} catch (e) {
				console.log(e.message);
			}
		};
		if (!token && isAuthenticated) getUserMetadata();
	}, [token, isAuthenticated, getAccessTokenSilently]);
	return (
		<>
			<CssBaseline />
			<AppBar position="absolute" className={clsx(classes.appBar)}>
				<Toolbar className={classes.toolbar}>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="open drawer"
						onClick={props.handleDrawerToggle}
						className={clsx(classes.menuButton)}
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
						{!isAuthenticated ? (
							<Button
								onClick={() => loginWithRedirect()}
								color="inherit"
							>
								Log In
							</Button>
						) : (
							<Button
								color="inherit"
								onClick={() =>
									logout({ returnTo: window.location.origin })
								}
							>
								Log Out
							</Button>
						)}
						<IconButton color="inherit">
							<Badge badgeContent={4} color="secondary">
								<NotificationsIcon />
							</Badge>
						</IconButton>
						<IconButton
							color="inherit"
							onClick={handleSwitchPalette}
						>
							<Brightness4Icon />
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>
		</>
	);
};

export default TopBar;
