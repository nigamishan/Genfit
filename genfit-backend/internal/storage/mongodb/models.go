package mongodb

import (
	"time"

	"github.com/fitness-backend/internal/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// UserModel represents a user in the database
type UserModel struct {
	ID             primitive.ObjectID    `bson:"_id,omitempty"`
	Username       string                `bson:"username"`
	Name           string                `bson:"name"`
	Email          string                `bson:"email"`
	Age            int                   `bson:"age"`
	Sex            string                `bson:"sex"`
	Weight         float64               `bson:"weight"`
	Height         float64               `bson:"height"`
	CurrentFitness models.CurrentFitness `bson:"current_fitness"`
	Goals          models.FitnessGoals   `bson:"goals"`
	CreatedAt      time.Time             `bson:"created_at"`
	UpdatedAt      time.Time             `bson:"updated_at"`
}

// ExerciseModel represents an exercise in the database
type ExerciseModel struct {
	ID                     primitive.ObjectID `bson:"_id,omitempty"`
	Name                   string             `bson:"name"`
	Description            string             `bson:"description,omitempty"`
	PrimaryMuscleGroups    []string           `bson:"primary_muscle_groups"`
	SupportingMuscleGroups []string           `bson:"supporting_muscle_groups,omitempty"`
	Equipment              []string           `bson:"equipment,omitempty"`
	Difficulty             string             `bson:"difficulty"` // beginner, intermediate, advanced
	ExerciseType           string             `bson:"exercise_type"`
	DemoVideoURL           string             `bson:"demo_video_url,omitempty"`
	DemoImageURL           string             `bson:"demo_image_url,omitempty"`
	Instructions           []string           `bson:"instructions,omitempty"`
	RecommendedFor         []string           `bson:"recommended_for,omitempty"`
	CreatedAt              time.Time          `bson:"created_at"`
	UpdatedAt              time.Time          `bson:"updated_at"`
}

// SetDetailsModel represents the details of a specific exercise set in MongoDB
type SetDetailsModel struct {
	SetNumber    int     `bson:"set_number"`
	Reps         int     `bson:"reps,omitempty"`
	Weight       float64 `bson:"weight,omitempty"`
	RPE          int     `bson:"rpe,omitempty"`
	RestDuration int     `bson:"rest_duration,omitempty"`
	IsWarmUp     bool    `bson:"is_warm_up,omitempty"`
	Notes        string  `bson:"notes,omitempty"`
}

// WorkoutModel represents a single workout in a workout plan in MongoDB
type WorkoutModel struct {
	Name            string            `bson:"name"`
	ExerciseID      string            `bson:"exercise_id"`
	MusclesTargeted []string          `bson:"muscles_targeted"`
	Day             int               `bson:"day"`
	SetDetails      []SetDetailsModel `bson:"set_details"`
	AddedAt         time.Time         `bson:"added_at"`
	Notes           string            `bson:"notes,omitempty"`
	Order           int               `bson:"order,omitempty"`
}

// WorkoutPlanModel represents a complete workout plan in MongoDB
type WorkoutPlanModel struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	UserID      string             `bson:"user_id"`
	Name        string             `bson:"name"`
	Description string             `bson:"description,omitempty"`
	Workouts    []WorkoutModel     `bson:"workouts"`
	CreatedAt   time.Time          `bson:"created_at"`
	UpdatedAt   time.Time          `bson:"updated_at"`
}

// ProgressEntryModel represents a single progress data point in MongoDB
type ProgressEntryModel struct {
	ID          primitive.ObjectID        `bson:"_id,omitempty"`
	UserID      string                    `bson:"user_id"`
	MetricType  models.ProgressMetricType `bson:"metric_type"`
	Value       float64                   `bson:"value"`
	Unit        string                    `bson:"unit"`
	RecordedAt  time.Time                 `bson:"recorded_at"`
	Notes       string                    `bson:"notes,omitempty"`
	Location    string                    `bson:"location,omitempty"`
	MeasureArea string                    `bson:"measure_area,omitempty"`
	CreatedAt   time.Time                 `bson:"created_at"`
}

// ToExercise converts an ExerciseModel to a models.Exercise
func (m *ExerciseModel) ToExercise() models.Exercise {
	return models.Exercise{
		ID:                     m.ID.Hex(),
		Name:                   m.Name,
		Description:            m.Description,
		PrimaryMuscleGroups:    m.PrimaryMuscleGroups,
		SupportingMuscleGroups: m.SupportingMuscleGroups,
		Equipment:              m.Equipment,
		Difficulty:             m.Difficulty,
		ExerciseType:           m.ExerciseType,
		DemoVideoURL:           m.DemoVideoURL,
		DemoImageURL:           m.DemoImageURL,
		Instructions:           m.Instructions,
		RecommendedFor:         m.RecommendedFor,
	}
}

// FromExercise creates an ExerciseModel from models.Exercise
func FromExercise(exercise models.Exercise) ExerciseModel {
	var id primitive.ObjectID
	if exercise.ID != "" {
		var err error
		id, err = primitive.ObjectIDFromHex(exercise.ID)
		if err != nil {
			// If ID is invalid, create a new ObjectID
			id = primitive.NewObjectID()
		}
	} else {
		id = primitive.NewObjectID()
	}

	now := time.Now()
	return ExerciseModel{
		ID:                     id,
		Name:                   exercise.Name,
		Description:            exercise.Description,
		PrimaryMuscleGroups:    exercise.PrimaryMuscleGroups,
		SupportingMuscleGroups: exercise.SupportingMuscleGroups,
		Equipment:              exercise.Equipment,
		Difficulty:             exercise.Difficulty,
		ExerciseType:           exercise.ExerciseType,
		DemoVideoURL:           exercise.DemoVideoURL,
		DemoImageURL:           exercise.DemoImageURL,
		Instructions:           exercise.Instructions,
		RecommendedFor:         exercise.RecommendedFor,
		CreatedAt:              now,
		UpdatedAt:              now,
	}
}

// ToWorkoutPlanResponse converts a WorkoutPlanModel to a models.WorkoutPlanResponse
func (m *WorkoutPlanModel) ToWorkoutPlanResponse() models.WorkoutPlanResponse {
	workouts := make([]models.Workout, len(m.Workouts))
	for i, workout := range m.Workouts {
		workouts[i] = workout.ToWorkout()
	}

	return models.WorkoutPlanResponse{
		ID:          m.ID.Hex(),
		UserID:      m.UserID,
		Name:        m.Name,
		Description: m.Description,
		Workouts:    workouts,
		CreatedAt:   m.CreatedAt,
		UpdatedAt:   m.UpdatedAt,
	}
}

// ToWorkout converts a WorkoutModel to a models.Workout
func (m *WorkoutModel) ToWorkout() models.Workout {
	setDetails := make([]models.SetDetails, len(m.SetDetails))
	for i, set := range m.SetDetails {
		setDetails[i] = models.SetDetails{
			SetNumber:    set.SetNumber,
			Reps:         set.Reps,
			Weight:       set.Weight,
			RPE:          set.RPE,
			RestDuration: set.RestDuration,
			IsWarmUp:     set.IsWarmUp,
			Notes:        set.Notes,
		}
	}

	return models.Workout{
		Name:            m.Name,
		ExerciseID:      m.ExerciseID,
		MusclesTargeted: m.MusclesTargeted,
		Day:             m.Day,
		SetDetails:      setDetails,
		AddedAt:         &m.AddedAt,
		Notes:           m.Notes,
		Order:           m.Order,
	}
}

// FromWorkout creates a WorkoutModel from models.Workout
func FromWorkout(workout models.Workout) WorkoutModel {
	setDetails := make([]SetDetailsModel, len(workout.SetDetails))
	for i, set := range workout.SetDetails {
		setDetails[i] = SetDetailsModel{
			SetNumber:    set.SetNumber,
			Reps:         set.Reps,
			Weight:       set.Weight,
			RPE:          set.RPE,
			RestDuration: set.RestDuration,
			IsWarmUp:     set.IsWarmUp,
			Notes:        set.Notes,
		}
	}

	addedAt := time.Now()
	if workout.AddedAt != nil {
		addedAt = *workout.AddedAt
	}

	return WorkoutModel{
		Name:            workout.Name,
		ExerciseID:      workout.ExerciseID,
		MusclesTargeted: workout.MusclesTargeted,
		Day:             workout.Day,
		SetDetails:      setDetails,
		AddedAt:         addedAt,
		Notes:           workout.Notes,
		Order:           workout.Order,
	}
}

// ToProgressEntry converts a ProgressEntryModel to a models.ProgressEntry
func (m *ProgressEntryModel) ToProgressEntry() models.ProgressEntry {
	return models.ProgressEntry{
		ID:          m.ID.Hex(),
		UserID:      m.UserID,
		MetricType:  m.MetricType,
		Value:       m.Value,
		Unit:        m.Unit,
		RecordedAt:  m.RecordedAt,
		Notes:       m.Notes,
		Location:    m.Location,
		MeasureArea: m.MeasureArea,
	}
}

// FromProgressEntry creates a ProgressEntryModel from models.ProgressEntry
func FromProgressEntry(entry models.ProgressEntry) ProgressEntryModel {
	var id primitive.ObjectID
	if entry.ID != "" {
		var err error
		id, err = primitive.ObjectIDFromHex(entry.ID)
		if err != nil {
			// If ID is invalid, create a new ObjectID
			id = primitive.NewObjectID()
		}
	} else {
		id = primitive.NewObjectID()
	}

	return ProgressEntryModel{
		ID:          id,
		UserID:      entry.UserID,
		MetricType:  entry.MetricType,
		Value:       entry.Value,
		Unit:        entry.Unit,
		RecordedAt:  entry.RecordedAt,
		Notes:       entry.Notes,
		Location:    entry.Location,
		MeasureArea: entry.MeasureArea,
		CreatedAt:   time.Now(),
	}
}
