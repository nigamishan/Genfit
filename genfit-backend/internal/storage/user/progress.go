package storage

type ProgressDBInterface interface {
	CreateUserProgress() error
	GetUserProgress() error
	UpdateUserProgress() error
	DeleteUserProgress() error
}
