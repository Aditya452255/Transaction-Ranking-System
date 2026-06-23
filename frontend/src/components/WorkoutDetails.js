import React from 'react'
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { useAuthContext } from '../hooks/useAuthContext';
import { getApiUrl } from '../utils/apiConfig';
const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();
  const handleClick = async () => {

    if (!user) {
      return;
    }
    const response = await fetch(`${getApiUrl()}/api/workouts/${workout._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const json = await response.json();
    if (response.ok) {
      dispatch({type: 'DELETE_WORKOUT', payload: json});
    }
  }
  return (
    <div className='workout-details'>
        <h4>{workout.title}</h4>
        <p><strong>Load:(in kgs): </strong>{workout.load}</p>
        <p><strong>Reps: </strong>{workout.reps}</p>
        <p><strong>Created At: </strong>{new Date(workout.createdAt).toLocaleString()}</p>
        <span  onClick={handleClick}>delete</span>
        
    </div>
  )
}

export default WorkoutDetails