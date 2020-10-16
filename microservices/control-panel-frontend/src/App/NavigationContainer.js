import React, { useCallback, useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import MainView from './MainView';
import TopBar from './TopBar';
import { useStyles } from '../components/hooks/useStyles';
import { MainMenu, SecondaryMenu } from './AppDrawer';
import { getSensors } from '../store/actions/sensorsActions';
import { useDispatch, useSelector } from 'react-redux';
import { MuiCtx } from '../components/hooks/muiState';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
function DashboardContainer() {
	// @ts-ignore
	const sensors = useSelector((state) => state.sensors.devices);
	const thunkDispatch = useDispatch();
	const classes = useStyles();
	const [open, setOpen] = useState(true);
	const handleDrawerToggle = useCallback(() => {
		setOpen(!open);
	}, [open]);
	useEffect(() => {
		const fetchSensors = async () => {
			await thunkDispatch(getSensors());
		};
		if (sensors.length <= 0) fetchSensors();
	}, [thunkDispatch, sensors]);

	return (
		<div className={classes.root}>
			<TopBar handleDrawerToggle={handleDrawerToggle} open={open} />
			<Drawer
				variant="permanent"
				classes={{
					paper: clsx(
						classes.drawerPaper,
						!open && classes.drawerPaperClose
					),
				}}
				color="primary"
				open={open}
			>
				<div className={classes.toolbarIcon}></div>
				<Divider />
				<List>{MainMenu}</List>
				<Divider />
				<List>
					<SecondaryMenu open={open} />
				</List>
			</Drawer>
			<MainView />
		</div>
	);
}

export default function Dashboard() {
	const { theme } = useContext(MuiCtx);
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<DashboardContainer />
		</ThemeProvider>
	);
}
