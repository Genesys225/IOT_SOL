import React from 'react';
import { Icon as Iconify, addIcon } from '@iconify/react';
import thermometerHalf from '@iconify/icons-fa-solid/thermometer-half';
import waterPercent from '@iconify/icons-mdi/water-percent';
import sunIcon from '@iconify/icons-fa-regular/sun';
import moleculeCo2 from '@iconify/icons-mdi/molecule-co2';
import { Box } from '@material-ui/core';

addIcon('temp', thermometerHalf);
addIcon('humidity', waterPercent);
addIcon('hum', waterPercent);
addIcon('lux', sunIcon);
addIcon('light', sunIcon);
addIcon('co2', moleculeCo2);

export function Icon(props) {
	return (
		<Box justifyContent="center" alignItems="center">
			<Iconify hAlign vAlign height="28px" {...props} />
		</Box>
	);
}
