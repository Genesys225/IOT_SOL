import { Box } from '@material-ui/core';
import React, { useState } from 'react';

function SensorIframe(props) {
  const parentBoundingRect = props.listItemRef.current.getBoundingClientRect();

  return (
    <Box display="flex" justifyContent="center">
      <SensorIframe id={props.id} listItemRef={parentBoundingRect} />
    </Box>
  );
}

export default SensorIframe;
