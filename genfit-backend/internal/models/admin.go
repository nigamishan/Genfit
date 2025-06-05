package models

// ExerciseFilter contains filters for listing exercises
type ExerciseFilter struct {
	Query                  string   `json:"query,omitempty"`
	PrimaryMuscleGroups    []string `json:"primary_muscle_groups,omitempty"`
	SupportingMuscleGroups []string `json:"supporting_muscle_groups,omitempty"`
	Equipment              []string `json:"equipment,omitempty"`
	Difficulty             string   `json:"difficulty,omitempty"` // beginner, intermediate, advanced
	ExerciseType           string   `json:"exercise_type,omitempty"`
	Skip                   int      `json:"skip,omitempty"`
	Limit                  int      `json:"limit,omitempty"`
	SortBy                 string   `json:"sort_by,omitempty"`    // name, difficulty, etc.
	SortOrder              string   `json:"sort_order,omitempty"` // asc or desc, default is asc
}

// CreateExerciseRequest is used to create a new exercise
type CreateExerciseRequest struct {
	Name                   string   `json:"name" binding:"required"`
	Description            string   `json:"description,omitempty"`
	PrimaryMuscleGroups    []string `json:"primary_muscle_groups" binding:"required"`
	SupportingMuscleGroups []string `json:"supporting_muscle_groups,omitempty"`
	Equipment              []string `json:"equipment,omitempty"`
	Difficulty             string   `json:"difficulty" binding:"required,oneof=beginner intermediate advanced"`
	ExerciseType           string   `json:"exercise_type" binding:"required"` // strength, cardio, flexibility, etc.
	DemoVideoURL           string   `json:"demo_video_url,omitempty"`
	DemoImageURL           string   `json:"demo_image_url,omitempty"`
	Instructions           []string `json:"instructions,omitempty"`
	RecommendedFor         []string `json:"recommended_for,omitempty"`
}

// UpdateExerciseRequest is used to update an existing exercise
type UpdateExerciseRequest struct {
	Name                   string   `json:"name" binding:"required"`
	Description            string   `json:"description,omitempty"`
	PrimaryMuscleGroups    []string `json:"primary_muscle_groups" binding:"required"`
	SupportingMuscleGroups []string `json:"supporting_muscle_groups,omitempty"`
	Equipment              []string `json:"equipment,omitempty"`
	Difficulty             string   `json:"difficulty" binding:"required,oneof=beginner intermediate advanced"`
	ExerciseType           string   `json:"exercise_type" binding:"required"` // strength, cardio, flexibility, etc.
	DemoVideoURL           string   `json:"demo_video_url,omitempty"`
	DemoImageURL           string   `json:"demo_image_url,omitempty"`
	Instructions           []string `json:"instructions,omitempty"`
	RecommendedFor         []string `json:"recommended_for,omitempty"`
}

// ExerciseListResponse is returned when listing exercises
type ExerciseListResponse struct {
	Exercises []Exercise `json:"exercises"`
	Total     int        `json:"total"`
	Page      int        `json:"page"`
	PageSize  int        `json:"page_size"`
}
