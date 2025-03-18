package storage

type WorkoutDBInterface interface {
	CreateUserWorkout() error
	GetUserWorkout() error
	UpdateUserWorkout() error
	DeleteUserWorkout() error
}

// Implement a file system manager.
