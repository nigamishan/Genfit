package models

// PersonalRecords represents strength training PRs
type PersonalRecords struct {
	Deadlift float64 `json:"deadlift,omitempty"` // in kg
	Squat    float64 `json:"squat,omitempty"`    // in kg
	Bench    float64 `json:"bench,omitempty"`    // in kg
}

// CurrentFitness represents a user's current fitness metrics
type CurrentFitness struct {
	FitnessLevel      string          `json:"fitness_level" binding:"required,oneof=beginner intermediate advanced"`
	TrainingFrequency int             `json:"training_frequency" binding:"required,min=1,max=7"` // days per week
	BodyFatPercentage float64         `json:"body_fat_percentage,omitempty"`                     // in percentage
	PersonalRecords   PersonalRecords `json:"personal_records,omitempty"`
}

// FitnessGoals represents a user's fitness goals
type FitnessGoals struct {
	GoalTypes     []string        `json:"goal_types" binding:"required"`     // e.g. ["weight loss", "muscle gain", "endurance"]
	TargetWeight  *float64        `json:"target_weight,omitempty"`           // in kg
	TargetBodyFat *float64        `json:"target_body_fat,omitempty"`         // in percentage
	TargetRecords PersonalRecords `json:"target_personal_records,omitempty"` // Target PRs
}

// UserRegistrationRequest represents the request body for user registration
type UserRegistrationRequest struct {
	// Basic user information
	Name  string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required,email"`
	Age   int    `json:"age" binding:"required,min=13"`
	Sex   string `json:"sex" binding:"required,oneof=male female other"`

	// Physical measurements
	Weight float64 `json:"weight" binding:"required"` // in kg
	Height float64 `json:"height" binding:"required"` // in cm

	// Current fitness and goals as separate structures
	CurrentFitness CurrentFitness `json:"current_fitness" binding:"required"`
	Goals          FitnessGoals   `json:"goals" binding:"required"`
}

// UserResponse represents the response for user data
type UserResponse struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	Email     string  `json:"email"`
	Age       int     `json:"age"`
	Sex       string  `json:"sex"`
	Weight    float64 `json:"weight"`
	Height    float64 `json:"height"`
	CreatedAt string  `json:"created_at"`
	UpdatedAt string  `json:"updated_at"`

	// Current fitness and goals as separate structures
	CurrentFitness CurrentFitness `json:"current_fitness"`
	Goals          FitnessGoals   `json:"goals"`
}

// UserUpdateRequest represents the request body for updating user data
type UserUpdateRequest struct {
	// Basic user information (all fields optional for partial updates)
	Name  *string `json:"name,omitempty"`
	Email *string `json:"email,omitempty" binding:"omitempty,email"`
	Age   *int    `json:"age,omitempty" binding:"omitempty,min=13"`
	Sex   *string `json:"sex,omitempty" binding:"omitempty,oneof=male female other"`

	// Physical measurements (optional)
	Weight *float64 `json:"weight,omitempty"`
	Height *float64 `json:"height,omitempty"`

	// Current fitness and goals as separate structures (optional)
	CurrentFitness *CurrentFitness `json:"current_fitness,omitempty"`
	Goals          *FitnessGoals   `json:"goals,omitempty"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
	Code    int    `json:"code,omitempty"`
}
