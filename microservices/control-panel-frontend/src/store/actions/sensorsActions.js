
export const GET_SENSORS = 'GET_SENSORS';

export const getSensors = () => {
  return async (dispatch) => {
    const res = await fetch('/getSensors')
    const allSensors = await res.json()
    console.log(allSensors)
    dispatch({type: GET_SENSORS, payload: allSensors})
  }
}