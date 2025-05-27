package mongodb

import (
	"context"
	"time"

	"github.com/fitness-backend/internal/logger"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Database represents the MongoDB database connection
type Database struct {
	Client *mongo.Client
	DB     *mongo.Database
}

// New creates a new MongoDB database connection
func New(connectionURI, dbName string) (*Database, error) {
	log := logger.GetLogger()
	log.WithFields(map[string]interface{}{
		"database": dbName,
		"timeout":  "10s",
	}).Debug("Establishing MongoDB connection")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().
		ApplyURI(connectionURI).
		SetConnectTimeout(10 * time.Second).
		SetServerSelectionTimeout(5 * time.Second)

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.WithError(err).Error("Failed to create MongoDB client")
		return nil, err
	}

	// Check the connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.WithError(err).Error("Failed to ping MongoDB server")
		return nil, err
	}

	log.WithField("database", dbName).Info("Connected to MongoDB")

	db := client.Database(dbName)

	return &Database{
		Client: client,
		DB:     db,
	}, nil
}

// Close closes the MongoDB connection
func (d *Database) Close() error {
	log := logger.GetLogger()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	log.Debug("Closing MongoDB connection")
	if err := d.Client.Disconnect(ctx); err != nil {
		log.WithError(err).Error("Error disconnecting from MongoDB")
		return err
	}

	log.Debug("MongoDB connection closed successfully")
	return nil
}

// GetCollection returns a collection from the database
func (d *Database) GetCollection(name string) *mongo.Collection {
	logger.GetLogger().WithField("collection", name).Debug("Accessing collection")
	return d.DB.Collection(name)
}
