import {
	Box,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormLabel,
	InputLabel,
	makeStyles,
	MenuItem,
	Paper,
	Select,
} from '@material-ui/core';
import React from 'react';
const useStyles = makeStyles((theme) => ({
	root: {
		justifyContent: 'space-evenly',
		display: 'flex',
		flexDirection: 'row',
		marginBottom: theme.spacing(2),
		width: '100%',
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
		margin: theme.spacing(2),
		display: 'block',
		width: '100%',
	},
	selectFormControl: {
		margin: theme.spacing(2, 3, 2, 0),
		width: '80%',
	},
	checkboxLabel: {
		marginRight: theme.spacing(3),
	},
	button: {
		margin: theme.spacing(1),
	},
}));
function ActionsInput() {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<FormControl
					component="fieldset"
					className={classes.formControl}
				>
					<FormLabel component="legend">Assign actions</FormLabel>
					<FormControlLabel
						control={<Checkbox checked={true} />}
						label="notify"
						className={classes.checkboxLabel}
					/>
					<FormControlLabel
						control={<Checkbox checked={true} />}
						label="trigger device"
						className={classes.checkboxLabel}
					/>
					<FormControl className={classes.selectFormControl}>
						<InputLabel id="demo-simple-select-label">
							Select device
						</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
						>
							<MenuItem value={10}>Ten</MenuItem>
							<MenuItem value={20}>Twenty</MenuItem>
							<MenuItem value={30}>Thirty</MenuItem>
						</Select>
					</FormControl>
					<FormControl className={classes.selectFormControl}>
						<InputLabel id="demo-simple-select-label">
							Select notification channel
						</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
						>
							<MenuItem value={10}>Ten</MenuItem>
							<MenuItem value={20}>Twenty</MenuItem>
							<MenuItem value={30}>Thirty</MenuItem>
						</Select>
					</FormControl>
				</FormControl>
			</Paper>
		</div>
	);
}

export default ActionsInput;
