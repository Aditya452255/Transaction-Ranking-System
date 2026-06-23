const Workout = require('../models/workoutModel');
const mongoose = require('mongoose');
// Get all workouts
exports.getWorkouts = async (req, res) => {
    const user_id = req.user._id;
    try {
        const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 });
        res.status(200).json(workouts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get a single workout
exports.getWorkout = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid workout ID' });
        }
        const workout = await Workout.findById(id);
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }
        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Create a new workout
exports.createWorkout = async (req, res) => {

    const { title, load, reps } = req.body;
    let empltyFields = [];

    if (!title) {
        empltyFields.push('title');
    }else if (!load) {
        empltyFields.push('load');
    }else if (!reps) {
        empltyFields.push('reps');
    }
    if (empltyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all fields', emptyFields: empltyFields });
    }
    try {
        const user_id = req.user._id;
        const workout = await Workout.create({ title, load, reps , user_id });
        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Delete a workout
exports.deleteWorkout = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid workout ID' });
        }
        const workout = await Workout.findOneAndDelete({ _id: id });
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }
        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Update a workout
exports.updateWorkout = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid workout ID' });
        }
        const workout = await Workout.findOneAndUpdate({ _id: id }, updates, { new: true });
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }
        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}