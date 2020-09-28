import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MainView from './MainView';
import TopBar from './TopBar';
import { useStyles } from '../components/hooks/useStyles';
import { MainMenu, SecondaryMenu } from './AppDrawer';
import { getScheduleEvents } from '../store/actions/alertsActions';
import { getSensors } from '../store/actions/sensorsActions';
import { useDispatch, useSelector } from 'react-redux';
export default function Dashboard() {
	// @ts-ignore
	const sensors = useSelector((state) => state.sensors.All);
	const thunkDispatch = useDispatch();
	const classes = useStyles();
	const [open, setOpen] = useState(true);
	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};
	useEffect(() => {
		const fetchSensors = async () => {
			await thunkDispatch(getScheduleEvents());
			await thunkDispatch(getSensors());
		};
		if (sensors.length <= 0) fetchSensors();
	}, [thunkDispatch, sensors]);

	return (
		<div className={classes.root}>
			<TopBar handleDrawerOpen={handleDrawerOpen} open={open} />
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
				<div className={classes.toolbarIcon}>
					<IconButton onClick={handleDrawerClose}>
						<ChevronLeftIcon />
					</IconButton>
				</div>
				<Divider />
				<List>{MainMenu}</List>
				<Divider />
				<List>
					<SecondaryMenu />
				</List>
			</Drawer>
			<MainView />
		</div>
	);
}
