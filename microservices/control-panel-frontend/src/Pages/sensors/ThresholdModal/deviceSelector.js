import { Box, FormControl, IconButton, InputLabel, ListItemIcon, MenuItem, Select } from '@material-ui/core';
import React from 'react';
import { Icon } from '../../../components/Icons/Icon-Library';

const DeviceSelector = ({ selectDevice, classes, circle }) => {
  if (selectDevice) return (
    (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="row"
      >
        <FormControl className={classes.selectFormControl}>
          <InputLabel id="demo-simple-select-label">
            Select device
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
          >
            <MenuItem value={10}>
              <ListItemIcon>{circle}</ListItemIcon>Ten
            </MenuItem>
            <MenuItem value={20}>
              <ListItemIcon>{circle}</ListItemIcon>
              Twenty
            </MenuItem>
            <MenuItem value={30}>
              <ListItemIcon>{circle}</ListItemIcon>
              Thirty
            </MenuItem>
          </Select>
        </FormControl>
        <IconButton>
          <Icon icon="gear" />
        </IconButton>
      </Box>
    )
  );
  return null;
};

export default DeviceSelector;
