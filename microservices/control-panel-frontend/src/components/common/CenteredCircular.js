import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';

function CenteredCircular(props = {}) {
	return (
		<Box
			flex={true}
			width="100%"
			height="100%"
			justifyContent="center"
			alignItems="center"
		>
			<CircularProgress {...props} />
		</Box>
	);
}

export default CenteredCircular;
