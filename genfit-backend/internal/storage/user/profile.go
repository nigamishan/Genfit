package storage

type ProfileDBInterface interface {
	CreateUserProfile() error
	GetUserProfile() error
	UpdateUserProfile() error
	DeleteUserProfile() error
}
