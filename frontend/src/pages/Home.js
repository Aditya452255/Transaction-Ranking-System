import React, { useEffect  } from 'react'
import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from '../components/WorkoutForm';
import {useWorkoutContext}  from  '../hooks/useWorkoutContext';
import {useAuthContext}  from  '../hooks/useAuthContext';
import { getApiUrl } from '../utils/apiConfig';
const Home = () => {
    // const [workouts, setWorkouts] = useState(null);
    const {workouts , dispatch} = useWorkoutContext();
    const {user} = useAuthContext();
    useEffect(() => {
        const fetchWorkouts = async () => {
            const response = await fetch(`${getApiUrl()}/api/workouts`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();
            console.log(json);
            if (response.ok) {
                dispatch({type: 'SET_WORKOUTS', payload: json});

            }
        }
        if (user) {
            fetchWorkouts();
        }
    }, [dispatch , user]);

  return (
    <div className='home'>
        <div className="workouts">  
            {workouts && workouts.map((workout) => (
                // <p key={workout._id}> {workout.title}</p>
                <WorkoutDetails key={workout._id} workout={workout} />
            ))
            }
        </div> 
        <WorkoutForm />
    </div>
  )
}

export default Home