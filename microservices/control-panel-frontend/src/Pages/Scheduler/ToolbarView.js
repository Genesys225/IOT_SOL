// @ts-ignore
import { Toolbar } from '@devexpress/dx-react-scheduler-material-ui';
import {
	Button,
	ButtonGroup,
	fade,
	LinearProgress,
	makeStyles,
	MenuItem,
	Select,
	TextField,
} from '@material-ui/core';
import React, { useContext } from 'react';
import clsx from 'clsx';
import { useScheduleStyles } from './hooks/useScheduleStyles';
import { SchedulerCtx } from './hooks/useSchedulerState';

const useStyles = makeStyles(({ spacing, palette }) => ({
	flexibleSpace: {
		margin: '0 auto 0 0',
		display: 'flex',
		alignItems: 'center',
	},
	textField: {
		width: '120px',
		marginLeft: spacing(1),
		marginTop: 0,
		marginBottom: 0,
		height: spacing(4.875),
	},
	locationSelector: {
		margin: `0 ${spacing(2)}`,
		height: spacing(4.875),
	},
	button: {
		paddingLeft: spacing(1),
		paddingRight: spacing(1),
		width: spacing(10),
		'@media (max-width: 800px)': {
			width: spacing(2),
			fontSize: '0.75rem',
		},
	},
	selectedButton: {
		background: palette.primary[400],
		color: palette.primary[50],
		'&:hover': {
			backgroundColor: palette.primary[500],
		},
		border: `1px solid ${palette.primary[400]}!important`,
		borderLeft: `1px solid ${palette.primary[50]}!important`,
		'&:first-child': {
			borderLeft: `1px solid ${palette.primary[50]}!important`,
		},
	},
	longButtonText: {
		'@media (max-width: 800px)': {
			display: 'none',
		},
	},
	shortButtonText: {
		'@media (min-width: 800px)': {
			display: 'none',
		},
	},
	title: {
		fontWeight: 'bold',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	textContainer: {
		lineHeight: 1,
		whiteSpace: 'pre-wrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		width: '100%',
	},
	time: {
		display: 'inline-block',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	text: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	container: {
		width: '100%',
	},
	weekendCell: {
		backgroundColor: fade(palette.action.disabledBackground, 0.04),
		'&:hover': {
			backgroundColor: fade(palette.action.disabledBackground, 0.04),
		},
		'&:focus': {
			backgroundColor: fade(palette.action.disabledBackground, 0.04),
		},
	},
	weekEnd: {
		backgroundColor: fade(palette.action.disabledBackground, 0.06),
	},
}));

export const ResourceSwitcher = ({ mainResourceName, onChange, resources }) => {
	const classes = useScheduleStyles();
	return (
		<div className={classes.container}>
			<div className={classes.text}>Main resource name:</div>
			<Select
				value={mainResourceName}
				onChange={(e) => onChange(e.target.value)}
				variant="outlined"
			>
				{resources.map((resource) => (
					<MenuItem
						key={resource.fieldName}
						value={resource.fieldName}
					>
						{resource.deviceId}
					</MenuItem>
				))}
			</Select>
		</div>
	);
};

export const ToolbarWithLoading = ({ children, ...restProps }) => {
	const classes = useScheduleStyles();
	return (
		<div className={classes.toolbarRoot}>
			<Toolbar.Root {...restProps}>{children}</Toolbar.Root>
			<LinearProgress className={classes.progress} />
		</div>
	);
};

const Filter = () => {
	const classes = useStyles();
	const { state, dispatch } = useContext(SchedulerCtx);
	// @ts-ignore
	const onCurrentFilterChange = (currentFilter) =>
		// @ts-ignore
		dispatch({ type: 'currentFilter', payload: currentFilter });
	const { currentFilter } = state;
	return (
		<TextField
			placeholder="Filter"
			className={classes.textField}
			value={currentFilter}
			onChange={({ target }) => onCurrentFilterChange(target.value)}
			variant="outlined"
			hiddenLabel
			margin="dense"
		/>
	);
};

const getButtonClass = (rooms, classes, room) =>
	rooms.indexOf(room) > -1 && classes.selectedButton;

export const LocationSelector = () => {
	const { state, dispatch } = useContext(SchedulerCtx);
	const { rooms } = state;
	const onLocationsChange = (rooms) =>
		// @ts-ignore
		dispatch({ type: 'rooms', payload: rooms });
	const classes = useStyles();
	const handleButtonClick = (roomId, rooms) => {
		if (rooms.indexOf(roomId) > -1) {
			return rooms.filter((rooms) => rooms !== roomId);
		}
		const nextLocations = [...rooms];
		nextLocations.push(roomId);
		return nextLocations;
	};
	return (
		<ButtonGroup className={classes.locationSelector}>
			{rooms.map((room, index) => (
				<Button
					className={clsx(
						classes.button,
						getButtonClass(rooms, classes, room)
					)}
					onClick={() =>
						onLocationsChange(handleButtonClick(room, rooms))
					}
					key={room}
				>
					<React.Fragment>
						<span className={classes.shortButtonText}>
							{rooms[index]}
						</span>
						<span className={classes.longButtonText}>{room}</span>
					</React.Fragment>
				</Button>
			))}
		</ButtonGroup>
	);
};

export const FlexibleSpace = ({ ...restProps }) => {
	const { state, dispatch } = useContext(SchedulerCtx);
	const changeMainResource = (mainResourceName) => {
		// @ts-ignore
		dispatch({
			type: 'changeMainResourceName',
			payload: { mainResourceName },
		});
	};

	const classes = useStyles();
	return (
		<Toolbar.FlexibleSpace {...restProps} className={classes.flexibleSpace}>
			<Filter />
			<LocationSelector />
			<ResourceSwitcher
				resources={state.resources}
				mainResourceName={state.mainResourceName}
				onChange={changeMainResource}
			/>
		</Toolbar.FlexibleSpace>
	);
};
