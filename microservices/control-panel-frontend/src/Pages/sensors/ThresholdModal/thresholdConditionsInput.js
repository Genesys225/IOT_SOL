import {
	Box,
	Button,
	FormControl,
	InputLabel,
	makeStyles,
	MenuItem,
	Paper,
	Select,
	TextField,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import React from 'react';
import { useDispatch } from 'react-redux';
import { UPDATE_NEW_ALERT } from '../../../store/actions/alertsActions';
const useStyles = makeStyles((theme) => ({
	root: {
		justifyContent: 'space-evenly',
		display: 'flex',
		flexDirection: 'row',
		marginBottom: theme.spacing(2),
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: '1px solid #fafafa',
		width: '410px',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 2, 3),
		borderRadius: 'borderRadius',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
	},
	formControl: {
		margin: theme.spacing(1),
		width: '100px',
	},
	button: {
		margin: theme.spacing(1),
	},
}));

function ThresholdConditionsInput({ deviceId, deviceAlert }) {
	const dispatch = useDispatch();

	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				{false ? (
					<Button
						variant="contained"
						color="primary"
						onClick={() => {}}
						size="large"
						className={classes.button}
						startIcon={<AddCircleOutlineIcon />}
					>
						Add new alert
					</Button>
				) : (
					<>
						<FormControl className={classes.formControl}>
							<InputLabel id="operator-label">
								Operator
							</InputLabel>
							<Select
								labelId="operator-label"
								id="operator"
								value={
									deviceAlert.length > 0
										? deviceAlert[0].conditions[0].evaluator
												.type
										: 'gt'
								}
								onChange={(event) => {
									// @ts-ignore
									dispatch({
										type: UPDATE_NEW_ALERT,
										payload: {
											op: event.target.value,
											deviceId: deviceId,
										},
									});
								}}
							>
								<MenuItem value="eq">Equals</MenuItem>
								<MenuItem value="gt">Above</MenuItem>
								<MenuItem value="lt">Less than</MenuItem>
								<MenuItem value="neq">Not equals</MenuItem>
							</Select>
						</FormControl>
						<FormControl className={classes.formControl}>
							<TextField
								id="filled-multiline-static"
								label="Limit"
								value={
									deviceAlert.length > 0
										? deviceAlert[0].conditions[0].evaluator
												.params[0]
										: ''
								}
								variant="outlined"
								type="number"
								onChange={(event) =>
									// @ts-ignore
									dispatch({
										type: UPDATE_NEW_ALERT,
										payload: {
											threshold: event.target.value,
											deviceId: deviceId,
										},
									})
								}
							/>
						</FormControl>
					</>
				)}
			</Paper>
		</div>
	);
}

export default ThresholdConditionsInput;
