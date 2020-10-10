import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Container, Grid, CssBaseline } from '@material-ui/core';
import SensorsList from '../Pages/sensors/SensorsList';
import Dashboard from '../Pages/Dashboard/Dashboard';
import clsx from 'clsx';
import { useStyles } from '../components/hooks/useStyles';
import Scheduler from '../Pages/Scheduler/Scheduler';
import RoomSummery from '../Pages/room/RoomSummery';

const MainView = () => {
	const classes = useStyles();
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
	return (
		<>
			<CssBaseline />
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<Switch>
					<Route path="/scheduler">
						<Container maxWidth="xl" className={classes.container}>
							<Scheduler />
						</Container>
					</Route>
					<Route path="/sensors">
						<Container maxWidth="xl" className={classes.container}>
							<SensorsList />
						</Container>
					</Route>
					<Route path="/rooms/:room">
						<Container maxWidth="xl" className={classes.container}>
							<RoomSummery />
						</Container>
					</Route>
					<Route path="/">
						<Container maxWidth="lg" className={classes.container}>
							<Grid container spacing={3}>
								{/* Dashboard */}
								<Grid item xs={12} md={8} lg={9}>
									<Dashboard />
								</Grid>
							</Grid>
						</Container>
					</Route>
				</Switch>
			</main>
		</>
	);
};

export default MainView;
