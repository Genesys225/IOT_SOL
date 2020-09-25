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
import powerIcon from '@iconify/icons-mdi/power';
const useStyles = makeStyles({
	centered: (props) => ({
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: props.size || '24px',
		width: props.size || '24px',
	}),
});

addIcon('temp', thermometerIcon);
addIcon('switch', powerIcon);
addIcon('sensors', pulseOutline);
addIcon('humidity', codropsIcon);
addIcon('hum', codropsIcon);
addIcon('lux', sunIcon);
addIcon('light', sunIcon);
addIcon('co2', moleculeCo2);

export function Icon(props) {
	const classes = useStyles(props);
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
			<Iconify hAlign vAlign height={props.size || '24px'} {...props} />
		</SvgIcon>
	);
}
