import React from 'react'
import { Backdrop, makeStyles, Modal, Fade, Paper, Box, Typography, Grid, Select, MenuItem, TextField, FormControl } from '@material-ui/core'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalPaper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        width: "410px",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: "borderRadius"
    },
}))

const initialState = props => ({
    sensorId: props.id
})

function AlertsModal(props) {

    const classes = useStyles()
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={props.in}
            onClose={props.onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={props.in}>
                <Paper className={classes.modalPaper}>

                    <Box display="flex" flexDirection="row">

                        <Typography id="transition-modal-title" variant="h5">Alerts </Typography><NotificationsActiveIcon />
                    </Box>
								if temperture is
						<Box justifyContent='space-between' display="flex" flexDirection="row" borderColor="text.primary" borderRadius="borderRadius" border={1} width={1}>
                        <Typography component="div">
                            <Grid component="label" container alignItems="center" spacing={1}>
                                <Select
                                    labelId="zone-label"
                                    id="zone"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="eq">Room 1</MenuItem>
                                    <MenuItem value="gt">Room 2</MenuItem>
                                    <MenuItem value="lt">Room 3</MenuItem>
                                    <MenuItem value="neq">Room 3</MenuItem>
                                </Select>
                            </Grid>
                        </Typography>
                        <FormControl className={classes.formControl}>

                            <TextField
                                id="filled-multiline-static"
                                label="Multiline"
                                defaultValue=""
                                variant="outlined"
                            />

                        </FormControl>
                    </Box>
                    <p id="transition-modal-description">react-transition-group animates me.</p>
                </Paper>
            </Fade>
        </Modal>
    )
}

export default AlertsModal
