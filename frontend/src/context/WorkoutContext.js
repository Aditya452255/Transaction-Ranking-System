const { createContext, useReducer } = require("react");
export const WorkoutContext = createContext();

export const WorkoutContextValue = createContext();

const workoutReducer = (state , action) => {
    switch(action.type){
        case 'SET_WORKOUTS':
            return {workouts: action.payload};
        case 'CREATE_WORKOUT':
            return{workouts: [action.payload , ...state.workouts]};
        case 'DELETE_WORKOUT':
            return{workouts: state.workouts.filter((each) => each._id !== action.payload._id)};
        default:
            return state;
    }
}

export const WorkoutContextProvider = ({children}) => {
    const [state , dispatch] = useReducer(workoutReducer, {
        workouts: null,
        loading: false,
        error: null
    });
    return (
        <WorkoutContext.Provider value={{...state , dispatch}}>
            {children}
        </WorkoutContext.Provider>
    );
}