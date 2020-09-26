import { Appointments } from '@devexpress/dx-react-scheduler-material-ui';
import classNames from 'classnames';
import React from 'react';
import { useScheduleStyles } from './hooks/useScheduleStyles';

export const Appointment = ({ data, children, draggable, resources }) => {
	const classes = useScheduleStyles();
	return (
		<Appointments.Appointment
			children={children}
			draggable={draggable}
			resources={resources}
			className={classNames({
				[classes.highPriorityAppointment]: data.priority === 1,
				[classes.mediumPriorityAppointment]: data.priority === 2,
				[classes.lowPriorityAppointment]: data.priority === 3,
				[classes.appointment]: true,
			})}
			data={data}
		/>
	);
};

export const AppointmentContent = ({
	data,
	recurringIconComponent,
	type,
	formatDate,
	durationType,
	resources,
}) => {
	const classes = useScheduleStyles();
	return (
		<Appointments.AppointmentContent
			type={type}
			formatDate={formatDate}
			durationType={durationType}
			resources={resources}
			recurringIconComponent={recurringIconComponent}
			data={data}
		>
			<div className={classes.appointmentContainer}>
				<div className={classes.appointmentText}>{data.title}</div>
				<div
					className={classNames(
						classes.appointmentText,
						classes.content
					)}
				>
					{`Room: ${data.room}`}
				</div>
			</div>
		</Appointments.AppointmentContent>
	);
};
