package logger

import (
	"io"
	"os"
	"path/filepath"

	"github.com/fitness-backend/internal/config"
	"github.com/sirupsen/logrus"
)

var (
	// Log is the default logger
	Log *logrus.Logger
)

// Init initializes the logger based on configuration
func Init(cfg *config.LoggerConfig) {
	if Log == nil {
		Log = logrus.New()
	}

	// Set log level
	level, err := logrus.ParseLevel(cfg.Level)
	if err != nil {
		// Default to info level if invalid
		level = logrus.InfoLevel
	}
	Log.SetLevel(level)

	// Set formatter based on config
	if cfg.Format == "json" {
		Log.SetFormatter(&logrus.JSONFormatter{
			TimestampFormat: "2006-01-02T15:04:05.000Z07:00",
		})
	} else {
		// Default to text formatter
		Log.SetFormatter(&logrus.TextFormatter{
			FullTimestamp:   true,
			TimestampFormat: "2006-01-02T15:04:05.000Z07:00",
		})
	}

	// Set output based on config
	if cfg.Output == "file" {
		// Ensure logs directory exists
		err := os.MkdirAll("logs", os.ModePerm)
		if err != nil {
			Log.Errorf("Failed to create logs directory: %v", err)
		}

		// Create log file with current date
		logFile := filepath.Join("logs", "fitness-api.log")
		file, err := os.OpenFile(logFile, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
		if err == nil {
			// Write to both console and file
			mw := io.MultiWriter(os.Stdout, file)
			Log.SetOutput(mw)
		} else {
			// Fall back to stdout if file creation fails
			Log.Errorf("Failed to log to file, using default stderr: %v", err)
		}
	}

	// Add file and line number fields
	Log.SetReportCaller(true)

	Log.Info("Logger initialized")
}

// GetLogger returns the global logger
func GetLogger() *logrus.Logger {
	// If logger is not initialized, create a default one
	if Log == nil {
		Log = logrus.New()
		Log.SetLevel(logrus.InfoLevel)
		Log.SetFormatter(&logrus.TextFormatter{
			FullTimestamp: true,
		})
		Log.SetReportCaller(true)
	}

	return Log
}

// Field creates a logrus field for structured logging
func Field(key string, value interface{}) logrus.Fields {
	return logrus.Fields{key: value}
}

// Fields creates multiple logrus fields for structured logging
func Fields(fields map[string]interface{}) logrus.Fields {
	return logrus.Fields(fields)
}
