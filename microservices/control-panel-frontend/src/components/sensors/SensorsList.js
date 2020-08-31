import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSensors } from '../../store/actions/sensorsActions';
import { useEffect } from 'react';

export default function SensorsList() {
  const sensors = useSelector(state => state.sensors)
  const dispatch = useDispatch()
  
  const fetchSensors = async () => {
    dispatch(getSensors())

  }

  useEffect(() => {
    fetchSensors()
  }, [dispatch])
  return (
    <div>
      
    </div>
  )
}
