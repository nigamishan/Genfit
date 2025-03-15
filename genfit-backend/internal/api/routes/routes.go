package routes

import (
	"github.com/fitness-backend/internal/api/handlers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// API v1 group
	v1 := r.Group("/api/v1")

	// Workout routes
	workout := v1.Group("/workouts")
	{
		workout.POST("/generate", handlers.GenerateWorkout)
	}

	// TODO: Add user routes
	// TODO: Add authentication middleware
	// TODO: Add other API endpoints
}