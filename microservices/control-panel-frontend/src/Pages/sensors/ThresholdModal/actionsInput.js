import {
	Badge,
	Box,
	Checkbox,
	Chip,
	FormControl,
	FormControlLabel,
	FormLabel,
	IconButton,
	Input,
	InputLabel,
	ListItemIcon,
	makeStyles,
	MenuItem,
	Paper,
	Select,
} from '@material-ui/core';
import clsx from 'clsx';
import React, { useState } from 'react';
import { Icon } from '../../../components/Icons/Icon-Library';
import DeviceSelector from './deviceSelector';
import NotificationsChannelSelector from './notificationsSelector';
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
		boxShadow: theme.shadows[ 5 ],
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
		margin: theme.spacing(2, 1, 2, 0),
		width: '80%',
	},
	checkboxLabel: {
		marginRight: theme.spacing(3),
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	chip: {
		margin: 2,
	},
	shape: {
		backgroundColor: theme.palette.primary.main,
		width: 24,
		height: 24,
		color: (props) => (props.deviceType ? props.deviceType : 'inherit'),
	},
	shapeCircle: {
		borderRadius: '50%',
	},
}));

function ActionsInput() {
	const classes = useStyles();
	const [ selectNotify, setSelectNotify ] = useState(false);
	const [ selectDevice, setSelectDevice ] = useState(false);
	const circle = <div className={clsx(classes.shape, classes.shapeCircle)} />;

	return (
		<Badge
			color="secondary"
			badgeContent=" "
			invisible={false}
			className={classes.root}
		>
			<Paper className={classes.paper}>
				<FormControl
					component="fieldset"
					className={classes.formControl}
				>
					<FormLabel component="legend">Assign actions</FormLabel>
					<FormControlLabel
						control={
							<Checkbox
								onChange={() => setSelectNotify(!selectNotify)}
								checked={selectNotify}
							/>
						}
						label="notify"
						className={classes.checkboxLabel}
					/>
					<FormControlLabel
						control={
							<Checkbox
								onChange={() => setSelectDevice(!selectDevice)}
								checked={selectDevice}
							/>
						}
						label="trigger device"
						className={classes.checkboxLabel}
					/>
					<DeviceSelector selectDevice={selectDevice} classes={classes} circle={circle} />
					<NotificationsChannelSelector selectNotify={selectNotify} classes={classes} circle={circle} />
				</FormControl>
			</Paper>
		</Badge>
	);
}

export default ActionsInput;
