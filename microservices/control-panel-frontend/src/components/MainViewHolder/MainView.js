import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {
	Container,
	Grid,
	Paper,
	Box,
	Typography,
	Link,
} from '@material-ui/core';
import SensorsList from '../sensors/SensorsList';
import Chart from '../Dashboard/Chart';
import clsx from 'clsx';
import { useStyles } from '../hooks/useStyles';

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://material-ui.com/">
				Your Website
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const MainView = () => {
	const classes = useStyles();
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
	return (
		<main className={classes.content}>
			<div className={classes.appBarSpacer} />
			<Switch>
				<Route path="/sensors">
					<Container maxWidth="lg" className={classes.container}>
						<SensorsList />
					</Container>
				</Route>
				<Route path="/">
					<Container maxWidth="lg" className={classes.container}>
						<Grid container spacing={3}>
							{/* Chart */}
							<Grid item xs={12} md={8} lg={9}>
								<Paper className={fixedHeightPaper}>
									<Chart />
								</Paper>
							</Grid>
						</Grid>
						<Box pt={4}>
							<Copyright />
						</Box>
					</Container>
				</Route>
			</Switch>
		</main>
	);
};

export default MainView;
