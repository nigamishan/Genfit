package manager

import (
	"github.com/fitness-backend/internal/models"
	"github.com/sashabaranov/go-openai"
)

func GenerateWorkoutPlan(client *openai.Client, workout models.ClientInputData) ([]models.Exercise, error) {
	// Prepare prompt for OpenA
	return []models.Exercise{}, nil
}
