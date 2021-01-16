import { Box, Chip, FormControl, IconButton, Input, InputLabel, ListItemIcon, MenuItem, Select } from '@material-ui/core';
import React, { useState } from 'react';
import { Icon } from '../../../components/Icons/Icon-Library';

const NotificationsChannelSelector = ({ selectNotify, classes, circle }) => {
  const [ personName, setPersonName ] = useState([]);
  const handleChange = (event) => {
    setPersonName(event.target.value);
  };
  if (selectNotify) return (
    (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <FormControl className={classes.selectFormControl}>
          <InputLabel id="demo-simple-select-label">
            Select notification channel
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            multiple
            input={<Input />}
            value={personName}
            onChange={handleChange}
            renderValue={(selected) => (
              <div className={classes.chips}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    icon={<Icon icon={value} />}
                    className={classes.chip}
                  />
                ))}
              </div>
            )}
          >
            <MenuItem value="sms">
              <ListItemIcon>{circle}</ListItemIcon>
              Sms
            </MenuItem>
            <MenuItem value="email">
              <ListItemIcon>{circle}</ListItemIcon>
              E-mail
            </MenuItem>
            <MenuItem value="telegram">
              <ListItemIcon>{circle}</ListItemIcon>
              Telegram
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

export default NotificationsChannelSelector;
