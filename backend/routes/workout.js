const express = require('express');
const Workout = require('../models/workoutModel');
const router = express.Router();
const { createWorkout, getWorkouts, getWorkout , deleteWorkout , updateWorkout } = require('../controllers/workoutController');
const requireAuth = require('../middleware/requireAuth');
router.use(requireAuth);

/**
 * Route:  /api/workouts
 * Method: GET
 * Description: Get all workouts
 * Access: Public   
 * Parameters: None
 */

router.get('/', getWorkouts );

/**
 * Route:  /api/workouts/:id
 * Method: GET
 * Description: Get a single workout
 * Access: Public   
 * Parameters: id
 */

router.get('/:id', getWorkout);

/**
 * Route:  /api/workouts
 * Method: POST
 * Description: Create a new workout/Add a new workout
 * Access: Public   
 * Parameters: None
 */
router.post('/',createWorkout )

/**
 * Route:  /api/workouts/:id
 * Method: DELETE
 * Description: Delete a workout
 * Access: Public   
 * Parameters: id
 */
router.delete('/:id',deleteWorkout );

/**
 * Route:  /api/workouts/:id
 * Method: PATCH
 * Description: Update a workout
 * Access: Public   
 * Parameters: id
 */

router.patch('/:id', updateWorkout);

module.exports = router;