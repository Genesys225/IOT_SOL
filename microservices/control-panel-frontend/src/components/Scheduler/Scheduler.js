import React, { useReducer } from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler, Resources,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  WeekView,
  EditRecurrenceMenu,
  AllDayPanel,
  ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';
// import { appointments } from './demo-data/appointments';
import { useStyles } from '../hooks/useStyles';
import { Select, MenuItem } from '@material-ui/core';

const appointments = [{
  title: 'Website Re-Design Plan',
  startDate: new Date(2018, 5, 25, 12, 35),
  endDate: new Date(2018, 5, 25, 15, 0),
  id: 0,
  members: [1, 3, 5],
  location: 'Room 1',
}, {
  title: 'Book Flights to San Fran for Sales Trip',
  startDate: new Date(2018, 5, 26, 12, 35),
  endDate: new Date(2018, 5, 26, 15, 0),
  id: 1,
  members: [2, 4],
  location: 'Room 2',
}, {
  title: 'Install New Router in Dev Room',
  startDate: new Date(2018, 5, 27, 12, 35),
  endDate: new Date(2018, 5, 27, 15, 0),
  id: 2,
  members: [3],
  location: 'Room 3',
}, {
  title: 'Approve Personal Computer Upgrade Plan',
  startDate: new Date(2018, 5, 28, 12, 35),
  endDate: new Date(2018, 5, 28, 15, 0),
  id: 3,
  members: [4, 1],
  location: 'Room 4',
}, {
  title: 'Final Budget Review',
  startDate: new Date(2018, 5, 29, 12, 35),
  endDate: new Date(2018, 5, 29, 15, 0),
  id: 4,
  members: [5, 1, 3],
  location: 'Room 5',
}];

const ResourceSwitcher = ({ mainResourceName, onChange, resources }) => {
  const classes = useStyles(theme => ({
    container: {
      display: 'flex',
      marginBottom: theme.spacing(2),
      justifyContent: 'flex-end',
    },
    text: {
      ...theme.typography.h6,
      marginRight: theme.spacing(2),
    },
  }))
  return (
    <div className={classes.container}>
      <div className={classes.text}>
        Main resource name:
      </div>
      <Select
        value={mainResourceName}
        onChange={e => onChange(e.target.value)}
      >
        {resources.map(resource => (
          <MenuItem key={resource.fieldName} value={resource.fieldName}>
            {resource.title}
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}

const reducer = (state, { type, payload = {} }) => {
  switch (type) {
    case 'addAlert':
      const { addedAppointment } = payload
      return { ...state, addedAppointment }
    case 'changeAlert':
      const { appointmentChanges } = payload
      return { ...state, appointmentChanges }
    case 'selectEditedAler':
      const { editingAppointment } = payload
      return { ...state, editingAppointment }
    case 'commitAddedAlert':
      let { data } = state
      const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
      data = [...data, { id: startingAddedId, ...payload.added }]
      return { ...state, data }
    case 'commitChangesToAlert': {
      let { data } = state
      data = data.map(appointment => (
        payload.changed[appointment.id] ? { ...appointment, ...payload.changed[appointment.id] } : appointment));
      return { ...state, data }
    }
    case 'changeMainResourceName':
      const { mainResourceName } = payload
      return { ...state, mainResourceName }


    case 'deleteAlert': {
      let { data } = state
      data = data.filter(appointment => appointment.id !== payload.deleted);
      return { ...state, data }
    }

    default:
      return state;
  }
}

const initialState = {
  data: appointments,
  currentDate: '2018-06-27',

  addedAppointment: {},
  appointmentChanges: {},
  editingAppointment: undefined,
  mainResourceName: 'members',
  resources: [
    {
      fieldName: 'location',
      title: 'Location',
      instances: [
        { id: 'Room 1', text: 'Room 1' },
        { id: 'Room 2', text: 'Room 2' },
        { id: 'Room 3', text: 'Room 3' },
        { id: 'Room 4', text: 'Room 4' },
        { id: 'Room 5', text: 'Room 5' },
      ],
    },
    {
      fieldName: 'members',
      title: 'Members',
      allowMultiple: true,
      instances: [
        { id: 1, text: 'Andrew Glover' },
        { id: 2, text: 'Arnie Schwartz' },
        { id: 3, text: 'John Heart' },
        { id: 4, text: 'Taylor Riley' },
        { id: 5, text: 'Brad Farkus' },
      ],
    },
  ],
};

const SchedulerComp = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const commitChanges = ({ added, changed, deleted }) => {
    if (added) {
      dispatch({ type: 'commitAddedAlert', payload: { added } })
    }
    if (changed) {
      dispatch({ type: 'commitChangesToAlert', payload: { changed } })
    }
    if (deleted !== undefined) {
      dispatch({ type: 'deleteAlert', payload: { deleted } })
    }
  }

  const changeMainResource = (mainResourceName) => {
    dispatch({ type: 'changeMainResourceName', payload: { mainResourceName } })
  }

  const {
    currentDate, data, addedAppointment, appointmentChanges, editingAppointment, resources, mainResourceName
  } = state;
  return (
    <>
      <ResourceSwitcher
        resources={resources}
        mainResourceName={mainResourceName}
        onChange={changeMainResource}
      />
      <Paper>
        <Scheduler
          data={data}
          height={660}
        >
          <ViewState
            currentDate={currentDate}
          />
          <EditingState
            onCommitChanges={commitChanges}

            addedAppointment={addedAppointment}
            onAddedAppointmentChange={(addedAppointment) => dispatch({ type: 'addALert', addedAppointment })}

            appointmentChanges={appointmentChanges}
            onAppointmentChangesChange={(appointmentChanges) => dispatch({ type: 'changeAlert', appointmentChanges })}

            editingAppointment={editingAppointment}
            onEditingAppointmentChange={(editingAppointment) => dispatch({ type: 'selectEditedAlert', editingAppointment })}
          />
          <WeekView
            startDayHour={9}
            endDayHour={17}
          />
          <AllDayPanel />
          <EditRecurrenceMenu />
          <ConfirmationDialog />
          <Appointments />
          <AppointmentTooltip
            showOpenButton
            showDeleteButton
          />
          <AppointmentForm />
          <Resources
            data={resources}
            mainResourceName={mainResourceName}
          />
        </Scheduler>
      </Paper>
    </>
  );

}

export default SchedulerComp