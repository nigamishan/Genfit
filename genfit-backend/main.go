package main

import (
	"context"
	"fmt"
	"log" // Keep standard log for initial errors before logger is initialized
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/fitness-backend/internal/config"
	"github.com/fitness-backend/internal/logger"
	"github.com/fitness-backend/internal/manager"
	httpserver "github.com/fitness-backend/internal/server/http"
	"github.com/fitness-backend/internal/server/http/middlewares"
	"github.com/fitness-backend/internal/storage/mongodb"
	"github.com/sirupsen/logrus"
)

func main() {
	// Load configuration
	configPath := getEnv("CONFIG_PATH", "internal/config/local.yaml")
	cfg, err := config.LoadConfig(configPath)
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Set up logger based on config
	logger.Init(&cfg.Logger)
	log := logger.GetLogger()

	log.Info("Starting Genfit Backend Service")
	log.WithFields(logrus.Fields{
		"environment": cfg.Server.Mode,
		"version":     "1.0.0",
	}).Info("Application initialized")

	// Initialize whitelisted users and admins
	whitelistedUsers := cfg.WhitelistedUsers
	whitelistedAdmins := cfg.WhitelistedAdmins
	middlewares.InitWhitelistedAdmins(whitelistedAdmins)
	middlewares.InitWhitelistedUsers(whitelistedUsers)

	// Connect to MongoDB
	mongoURI := buildMongoURI(cfg.Database.MongoDB)
	log.WithField("uri", maskURI(mongoURI)).Info("Connecting to MongoDB")

	db, err := mongodb.New(mongoURI, cfg.Database.MongoDB.Name)
	if err != nil {
		log.WithError(err).Fatal("Failed to connect to MongoDB")
	}
	defer db.Close()
	log.Info("Connected to MongoDB successfully")

	// Initialize repository
	repo := mongodb.NewRepository(db)
	log.Debug("Repository initialized")

	// Initialize the manager
	appManager := manager.NewManager(repo)
	log.Debug("Business logic manager initialized")

	// Initialize the HTTP server
	server := httpserver.NewServer(cfg)
	log.Debug("HTTP server initialized")

	// Initialize the unified route handler
	routeHandler := httpserver.NewRoute(appManager)
	routeHandler.SetupRoutes(server.GetRouter())
	log.Info("Routes configured")

	// Handle graceful shutdown
	go func() {
		// Start the server
		log.WithField("port", cfg.Server.Port).Info("Starting server")
		if err := server.Start(); err != nil && err != http.ErrServerClosed {
			log.WithError(err).Fatal("Failed to start server")
		}
	}()

	// Wait for interrupt signal to gracefully shut down the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	sig := <-quit
	log.WithField("signal", sig.String()).Info("Shutting down server...")

	// Give the server 5 seconds to finish ongoing requests
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := server.Stop(ctx); err != nil {
		log.WithError(err).Fatal("Server forced to shutdown")
	}

	log.Info("Server exited")
}

// buildMongoURI constructs a MongoDB connection URI from configuration
func buildMongoURI(mongoConfig config.MongoDBConfig) string {
	if mongoConfig.User != "" && mongoConfig.Password != "" {
		// With authentication
		return fmt.Sprintf("mongodb://%s:%s@%s:%s",
			mongoConfig.User,
			mongoConfig.Password,
			mongoConfig.Host,
			mongoConfig.Port)
	}

	// Without authentication
	return fmt.Sprintf("mongodb://%s:%s",
		mongoConfig.Host,
		mongoConfig.Port)
}

// maskURI masks sensitive information in URIs for logging
func maskURI(uri string) string {
	// Simple implementation, in production you'd want to use regex
	if uri == "" {
		return ""
	}

	// Check if it's an authenticated connection
	if len(uri) > 10 && uri[:10] == "mongodb://" {
		if i := indexOf(uri, "@"); i > 0 {
			// This is an authenticated connection
			return "mongodb://[username]:[password]@" + uri[i+1:]
		}
	}
	return uri
}

// indexOf returns the index of a substring or -1 if not found
func indexOf(s string, substr string) int {
	for i := 0; i < len(s); i++ {
		if i+len(substr) <= len(s) && s[i:i+len(substr)] == substr {
			return i
		}
	}
	return -1
}

// configureLogger sets up the logger based on configuration
func configureLogger(logConfig config.LoggerConfig) {
	// This function is no longer needed as we're using the logger package
	// Kept for backward compatibility
}

// getEnv gets an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
