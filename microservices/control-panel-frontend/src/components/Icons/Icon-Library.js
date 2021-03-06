import React from 'react';
import { Icon as Iconify, addIcon } from '@iconify/react';
// import thermometerHalf from '@iconify/icons-fa-solid/thermometer-half';
// import waterPercent from '@iconify/icons-mdi/water-percent';
// import sunIcon2 from '@iconify/icons-fa-regular/sun';
import moleculeCo2 from '@iconify/icons-mdi/molecule-co2';
import { makeStyles, SvgIcon } from '@material-ui/core';
import sunIcon from '@iconify/icons-twemoji/sun';
import codropsIcon from '@iconify/icons-logos/codrops';
// import thermometerIcon from '@iconify/icons-noto/thermometer';
import thermometerIcon from '@iconify/icons-fxemoji/thermometer';
import pulseOutline from '@iconify/icons-ion/pulse-outline';
import warehouseIcon from '@iconify/icons-mdi/warehouse';
import powerIcon from '@iconify/icons-mdi/power';
import calendarMultiselect from '@iconify/icons-mdi/calendar-multiselect';
import telegramIcon from '@iconify/icons-logos/telegram';
import emailIcon from '@iconify/icons-fxemoji/email';
import smsIcon from '@iconify/icons-fa-solid/sms';
import slackIcon from '@iconify/icons-logos/slack-icon';
import gearIcon from '@iconify/icons-noto/gear';

const useStyles = makeStyles((_theme) => ({
	// @ts-ignore
	centered: ({ size }) => ({
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: size,
		width: size,
	}),
}));

/** Menu (drawer) */
addIcon('calendar', calendarMultiselect);
addIcon('room', warehouseIcon);
addIcon('sensors', pulseOutline);
/** Sensors */
addIcon('temp', thermometerIcon);
addIcon('temperature', thermometerIcon);
addIcon('switch', powerIcon);
addIcon('humidity', codropsIcon);
addIcon('hum', codropsIcon);
addIcon('lux', sunIcon);
addIcon('light', sunIcon);
addIcon('co2', moleculeCo2);
/** notification channels */
addIcon('telegram', telegramIcon);
addIcon('email', emailIcon);
addIcon('sms', smsIcon);
addIcon('slack', slackIcon);
/** general UI */
addIcon('gear', gearIcon);

export function Icon(props) {
	const size = props.size || '24px';
	const classes = useStyles({ size });
	return (
		<SvgIcon
			component={'div'}
			color={
				props.icon === 'co2' || props.icon === 'switch'
					? 'primary'
					: 'inherit'
			}
			className={classes.centered}
		>
			<Iconify hAlign vAlign height={size} {...props} />
		</SvgIcon>
	);
}
