import React from 'react';
import { useScheduleStyles } from './hooks/useScheduleStyles';
import classNames from 'classnames';
import { MonthView } from '@devexpress/dx-react-scheduler-material-ui';

const isWeekEnd = (date) => date.getDay() === 0 || date.getDay() === 6;

export const MonthDayScaleCell = ({ startDate, formatDate }) => {
	const classes = useScheduleStyles();
	return (
		<MonthView.DayScaleCell
			className={classNames({
				[classes.weekEndDayScaleCell]: isWeekEnd(startDate),
			})}
			startDate={startDate}
			formatDate={formatDate}
		/>
	);
};

export const MonthTimeTableCell = ({ startDate, ...restProps }) => {
	const classes = useScheduleStyles();
	return (
		<MonthView.TimeTableCell
			className={classNames({
				[classes.weekEndCell]: isWeekEnd(startDate),
			})}
			startDate={startDate}
			{...restProps}
		/>
	);
};
