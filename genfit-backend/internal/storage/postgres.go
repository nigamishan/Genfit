package storage

import (
	"database/sql"
	"errors"
)

type PostgresInterface interface {
}

type Postgres struct {
	Client *sql.DB
}

func NewPostgresClient() (*sql.DB, error) {
	connString := "user=myuser dbname=mydb password=mypassword sslmode=disable"
	client, err := sql.Open("postgres", connString)
	if err != nil {
		return nil, err
	}
	if err := client.Ping(); err != nil {
		return nil, errors.New("postgres ping test failed")
	}
	return client, err
}
