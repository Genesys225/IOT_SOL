import { blue, indigo, teal } from '@material-ui/core/colors';
import { fade, makeStyles } from '@material-ui/core/styles';

export const useScheduleStyles = makeStyles((theme) => {
	const { palette } = theme;
	return {
		container: {
			display: 'flex',
			// @ts-ignore
			marginBottom: theme.spacing(2),
			justifyContent: 'flex-start',
			alignItems: 'center',
			width: '50%',
			margin: '5px',
		},
		text: {
			// @ts-ignore
			...theme.typography.subtitle1,
			// @ts-ignore
			margin: `0 ${theme.spacing(2)}`,
		},
		floatLeft: {
			float: 'left',
		},
		paper: {
			height: '2600px',
		},
		appointment: {
			borderRadius: 0,
			borderBottom: 0,
		},
		highPriorityAppointment: {
			borderLeft: `4px solid ${teal[500]}`,
		},
		mediumPriorityAppointment: {
			borderLeft: `4px solid ${blue[500]}`,
		},
		lowPriorityAppointment: {
			borderLeft: `4px solid ${indigo[500]}`,
		},
		weekEndCell: {
			backgroundColor: fade(palette.action.disabledBackground, 0.04),
			'&:hover': {
				backgroundColor: fade(palette.action.disabledBackground, 0.04),
			},
			'&:focus': {
				backgroundColor: fade(palette.action.disabledBackground, 0.04),
			},
		},
		weekEndDayScaleCell: {
			backgroundColor: fade(palette.action.disabledBackground, 0.06),
		},
		appointmentText: {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
		},
		content: {
			opacity: 0.7,
		},
		appointmentContainer: {
			width: '100%',
			lineHeight: 1.2,
			height: '100%',
		},
		toolbarRoot: {
			position: 'relative',
		},
		progress: {
			position: 'absolute',
			width: '100%',
			bottom: 0,
			left: 0,
		},
	};
});
