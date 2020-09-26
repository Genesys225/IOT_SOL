import React from 'react';
import { WeekView } from '@devexpress/dx-react-scheduler-material-ui';
import { makeStyles, fade } from '@material-ui/core/styles';
import clsx from 'clsx';

const isRestTime = (date) =>
	date.getDay() === 0 ||
	date.getDay() === 6 ||
	date.getHours() < 9 ||
	date.getHours() >= 18;

const useStyles = makeStyles(({ spacing, palette }) => ({
	flexibleSpace: {
		margin: '0 auto 0 0',
		display: 'flex',
		alignItems: 'center',
	},
	textField: {
		width: '75px',
		marginLeft: spacing(1),
		marginTop: 0,
		marginBottom: 0,
		height: spacing(4.875),
	},
	locationSelector: {
		marginLeft: spacing(1),
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

export const WeekTimeTableCell = ({ ...restProps }) => {
	const classes = useStyles();
	const { startDate } = restProps;
	return (
		<WeekView.TimeTableCell
			className={clsx(isRestTime(startDate) && classes.weekendCell)}
			{...restProps}
		/>
	);
};

export const WeekDayScaleCell = ({ startDate, formatDate, ...restProps }) => {
	const classes = useStyles();
	return (
		<WeekView.DayScaleCell
			className={clsx(
				startDate.getDay() === 0 ||
					(startDate.getDay() === 6 && classes.weekEnd)
			)}
			formatDate={formatDate}
			startDate={startDate}
			{...restProps}
		/>
	);
};
