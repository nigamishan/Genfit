package models

import "time"

// Exercise represents a single exercise
type Exercise struct {
	ID             string   `json:"id"`
	Name           string   `json:"name"`
	Description    string   `json:"description,omitempty"`
	MuscleGroups   []string `json:"muscle_groups"`
	Equipment      []string `json:"equipment,omitempty"`
	Difficulty     string   `json:"difficulty"`    // beginner, intermediate, advanced
	ExerciseType   string   `json:"exercise_type"` // strength, cardio, flexibility, etc.
	DemoVideoURL   string   `json:"demo_video_url,omitempty"`
	DemoImageURL   string   `json:"demo_image_url,omitempty"`
	Instructions   []string `json:"instructions,omitempty"`
	RecommendedFor []string `json:"recommended_for,omitempty"` // weight loss, muscle gain, etc.
}

// ExerciseSearchRequest represents a search request for exercises
type ExerciseSearchRequest struct {
	Query        string   `json:"query" binding:"required,min=3"` // At least 3 characters for search
	MuscleGroups []string `json:"muscle_groups,omitempty"`
	Equipment    []string `json:"equipment,omitempty"`
	Difficulty   string   `json:"difficulty,omitempty"` // beginner, intermediate, advanced
	ExerciseType string   `json:"exercise_type,omitempty"`
	Limit        int      `json:"limit,omitempty"`
}

// ExerciseSearchResponse represents the response for exercise search
type ExerciseSearchResponse struct {
	Exercises []Exercise `json:"exercises"`
	Total     int        `json:"total"`
}

// SetDetails represents the details of a specific exercise set
type SetDetails struct {
	SetNumber    int     `json:"set_number"`
	Reps         int     `json:"reps,omitempty"`
	Weight       float64 `json:"weight,omitempty"`        // in kg
	RPE          int     `json:"rpe,omitempty"`           // Rate of Perceived Exertion (1-10)
	RestDuration int     `json:"rest_duration,omitempty"` // in seconds
	IsWarmUp     bool    `json:"is_warm_up,omitempty"`
	Notes        string  `json:"notes,omitempty"`
}

// Workout represents a single workout in a workout plan
type Workout struct {
	ID              string       `json:"id,omitempty"`
	Name            string       `json:"name" binding:"required"`
	ExerciseID      string       `json:"exercise_id" binding:"required"`
	Exercise        *Exercise    `json:"exercise,omitempty"` // Populated when responding
	MusclesTargeted []string     `json:"muscles_targeted" binding:"required"`
	Day             int          `json:"day" binding:"required,min=1,max=7"` // 1 = Monday, 7 = Sunday
	SetDetails      []SetDetails `json:"set_details" binding:"required"`
	AddedAt         *time.Time   `json:"added_at,omitempty"`
	Notes           string       `json:"notes,omitempty"`
	Order           int          `json:"order,omitempty"` // Order in the workout routine
}

// WorkoutPlan represents a complete workout plan
type WorkoutPlan struct {
	ID          string    `json:"id,omitempty"`
	UserID      string    `json:"user_id" binding:"required"`
	Name        string    `json:"name" binding:"required"`
	Description string    `json:"description,omitempty"`
	Workouts    []Workout `json:"workouts" binding:"required"`
	CreatedAt   time.Time `json:"created_at,omitempty"`
	UpdatedAt   time.Time `json:"updated_at,omitempty"`
}

// CreateWorkoutPlanRequest represents the request to create a workout plan
type CreateWorkoutPlanRequest struct {
	Name        string    `json:"name" binding:"required"`
	Description string    `json:"description,omitempty"`
	Workouts    []Workout `json:"workouts" binding:"required"`
}

// UpdateWorkoutPlanRequest represents the request to update a workout plan
type UpdateWorkoutPlanRequest struct {
	Name        *string   `json:"name,omitempty"`
	Description *string   `json:"description,omitempty"`
	Workouts    []Workout `json:"workouts,omitempty"`
}

// WorkoutPlanResponse represents the response for a workout plan
type WorkoutPlanResponse struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	Name        string    `json:"name"`
	Description string    `json:"description,omitempty"`
	Workouts    []Workout `json:"workouts"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// AddWorkoutRequest represents the request to add a workout to an existing plan
type AddWorkoutRequest struct {
	Workout Workout `json:"workout" binding:"required"`
}

// WorkoutDay represents a single day in a workout plan
type WorkoutDay struct {
	DayNumber int       `json:"day_number"` // 1 for Monday, 2 for Tuesday, etc.
	DayName   string    `json:"day_name"`   // Monday, Tuesday, etc.
	Workouts  []Workout `json:"workouts"`
	Notes     string    `json:"notes,omitempty"`
	RestDay   bool      `json:"rest_day"`
}

// WorkoutExercise represents an exercise in a workout day with specific parameters
type WorkoutExercise struct {
	Exercise     Exercise `json:"exercise"`
	Sets         int      `json:"sets,omitempty"`
	Reps         int      `json:"reps,omitempty"`
	Duration     int      `json:"duration,omitempty"`      // in seconds
	RestDuration int      `json:"rest_duration,omitempty"` // in seconds
	Weight       float64  `json:"weight,omitempty"`        // in kg
	RPE          int      `json:"rpe,omitempty"`           // Rate of Perceived Exertion (1-10)
	Notes        string   `json:"notes,omitempty"`
	SupersetWith *string  `json:"superset_with,omitempty"` // ID of another exercise to superset with
}
