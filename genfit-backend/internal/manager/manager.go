package manager

import (
	"context"
	"errors"
	"fmt"
	"math"
	"time"

	"github.com/fitness-backend/internal/logger"
	"github.com/fitness-backend/internal/models"
	"github.com/fitness-backend/internal/storage/mongodb"
	"github.com/fitness-backend/internal/utils"
	"github.com/sirupsen/logrus"
)

// Manager handles business logic operations
type Manager struct {
	db  *mongodb.Repository
	log *logrus.Logger
}

// NewManager creates a new Manager instance
func NewManager(db *mongodb.Repository) *Manager {
	return &Manager{
		db:  db,
		log: logger.GetLogger(),
	}
}

// User related methods

// CreateUser creates a new user
func (m *Manager) CreateUser(ctx context.Context, request models.UserRegistrationRequest) (*models.UserResponse, error) {
	m.log.WithField("email", request.Email).Info("Creating new user")

	// Create the user model
	now := time.Now()
	user := mongodb.UserModel{
		Name:           request.Name,
		Email:          request.Email,
		Age:            request.Age,
		Sex:            request.Sex,
		Weight:         request.Weight,
		Height:         request.Height,
		CurrentFitness: request.CurrentFitness,
		Goals:          request.Goals,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	// Create the user in the database
	id, err := m.db.CreateUser(ctx, user)
	if err != nil {
		m.log.WithError(err).Error("Failed to create user")
		return nil, err
	}

	m.log.WithFields(logrus.Fields{
		"id":    id,
		"email": user.Email,
	}).Info("User created successfully")

	// Return the user response
	return &models.UserResponse{
		ID:             id,
		Name:           user.Name,
		Email:          user.Email,
		Age:            user.Age,
		Sex:            user.Sex,
		Weight:         user.Weight,
		Height:         user.Height,
		CurrentFitness: user.CurrentFitness,
		Goals:          user.Goals,
		CreatedAt:      now.Format(time.RFC3339),
		UpdatedAt:      now.Format(time.RFC3339),
	}, nil
}

// GetUser retrieves a user by ID
func (m *Manager) GetUser(ctx context.Context, userID string) (*models.UserResponse, error) {
	m.log.WithField("id", userID).Debug("Getting user by ID")

	// Retrieve the user from the database
	user, err := m.db.GetUserByID(ctx, userID)
	if err != nil {
		m.log.WithError(err).WithField("id", userID).Error("Failed to get user")
		return nil, err
	}

	// If user not found
	if user == nil {
		m.log.WithField("id", userID).Warn("User not found")
		return nil, nil
	}

	m.log.WithField("id", userID).Debug("User retrieved successfully")

	// Return the user response
	return &models.UserResponse{
		ID:             userID,
		Name:           user.Name,
		Email:          user.Email,
		Age:            user.Age,
		Sex:            user.Sex,
		Weight:         user.Weight,
		Height:         user.Height,
		CurrentFitness: user.CurrentFitness,
		Goals:          user.Goals,
		CreatedAt:      user.CreatedAt.Format(time.RFC3339),
		UpdatedAt:      user.UpdatedAt.Format(time.RFC3339),
	}, nil
}

// UpdateUser updates a user
func (m *Manager) UpdateUser(ctx context.Context, userID string, request models.UserUpdateRequest) (*models.UserResponse, error) {
	m.log.WithField("id", userID).Info("Updating user")

	// First, check if the user exists
	existingUser, err := m.db.GetUserByID(ctx, userID)
	if err != nil {
		m.log.WithError(err).WithField("id", userID).Error("Failed to check for existing user")
		return nil, err
	}

	if existingUser == nil {
		m.log.WithField("id", userID).Warn("User not found for update")
		return nil, nil
	}

	m.log.WithField("id", userID).Debug("Found user, processing update")

	// Instead of selectively updating fields, replace the entire user object
	// Create an updated user model with all fields from the request
	updatedUser := mongodb.UserModel{
		ID:        existingUser.ID, // Keep the same ID
		Name:      utils.GetStringValue(request.Name, existingUser.Name),
		Email:     utils.GetStringValue(request.Email, existingUser.Email),
		Age:       utils.GetIntValue(request.Age, existingUser.Age),
		Sex:       utils.GetStringValue(request.Sex, existingUser.Sex),
		Weight:    utils.GetFloat64Value(request.Weight, existingUser.Weight),
		Height:    utils.GetFloat64Value(request.Height, existingUser.Height),
		CreatedAt: existingUser.CreatedAt, // Keep the original creation time
		UpdatedAt: time.Now(),             // Update the modification time
	}

	// Handle the nested structs
	if request.CurrentFitness != nil {
		updatedUser.CurrentFitness = *request.CurrentFitness
	} else {
		updatedUser.CurrentFitness = existingUser.CurrentFitness
	}

	if request.Goals != nil {
		updatedUser.Goals = *request.Goals
	} else {
		updatedUser.Goals = existingUser.Goals
	}

	// Replace the entire user document in the database
	err = m.db.ReplaceUser(ctx, userID, updatedUser)
	if err != nil {
		m.log.WithError(err).WithField("id", userID).Error("Failed to update user")
		return nil, err
	}

	m.log.WithField("id", userID).Info("User updated successfully")

	// Return the updated user
	return m.GetUser(ctx, userID)
}

// DeleteUser deletes a user
func (m *Manager) DeleteUser(ctx context.Context, userID string) error {
	m.log.WithField("id", userID).Info("Deleting user")

	// Delete the user from the database
	err := m.db.DeleteUser(ctx, userID)
	if err != nil {
		m.log.WithError(err).WithField("id", userID).Error("Failed to delete user")
		return err
	}

	m.log.WithField("id", userID).Info("User deleted successfully")
	return nil
}

// Exercise related methods

// CreateExercise creates a new exercise
func (m *Manager) CreateExercise(ctx context.Context, request models.CreateExerciseRequest) (*models.Exercise, error) {
	m.log.WithField("name", request.Name).Info("Creating new exercise")

	// Convert request to Exercise model
	exercise := models.Exercise{
		Name:           request.Name,
		Description:    request.Description,
		MuscleGroups:   request.MuscleGroups,
		Equipment:      request.Equipment,
		Difficulty:     request.Difficulty,
		ExerciseType:   request.ExerciseType,
		DemoVideoURL:   request.DemoVideoURL,
		DemoImageURL:   request.DemoImageURL,
		Instructions:   request.Instructions,
		RecommendedFor: request.RecommendedFor,
	}

	// Check if an exercise with the same name already exists
	existingExercise, err := m.db.GetExerciseByName(ctx, exercise.Name)
	if err != nil {
		m.log.WithError(err).WithField("name", exercise.Name).Error("Error checking for existing exercise")
		return nil, err
	}
	if existingExercise != nil {
		errMsg := "exercise with this name already exists"
		m.log.WithField("name", exercise.Name).Warn(errMsg)
		return nil, fmt.Errorf(errMsg)
	}

	// Create the exercise
	id, err := m.db.CreateExercise(ctx, exercise)
	if err != nil {
		m.log.WithError(err).WithField("name", exercise.Name).Error("Failed to create exercise")
		return nil, err
	}

	m.log.WithFields(logrus.Fields{
		"id":   id,
		"name": exercise.Name,
	}).Info("Exercise created successfully")

	// Fetch the created exercise to return
	exercise.ID = id
	return &exercise, nil
}

// GetExerciseByID retrieves an exercise by ID
func (m *Manager) GetExerciseByID(ctx context.Context, id string) (*models.Exercise, error) {
	m.log.WithField("id", id).Debug("Getting exercise by ID")

	exercise, err := m.db.GetExerciseByID(ctx, id)
	if err != nil {
		m.log.WithError(err).WithField("id", id).Error("Failed to get exercise")
		return nil, err
	}
	if exercise == nil {
		errMsg := "exercise not found"
		m.log.WithField("id", id).Warn(errMsg)
		return nil, errors.New(errMsg)
	}

	m.log.WithField("id", id).Debug("Exercise retrieved successfully")
	return exercise, nil
}

// GetExerciseByName retrieves an exercise by name
func (m *Manager) GetExerciseByName(ctx context.Context, name string) (*models.Exercise, error) {
	exercise, err := m.db.GetExerciseByName(ctx, name)
	if err != nil {
		return nil, err
	}
	if exercise == nil {
		return nil, errors.New("exercise not found")
	}
	return exercise, nil
}

// ListExercises lists exercises with optional filters
func (m *Manager) ListExercises(ctx context.Context, filter models.ExerciseFilter) (*models.ExerciseListResponse, error) {
	// Apply any business logic or validation to filter here

	// Get exercises from repository
	exercises, err := m.db.ListExercises(ctx, &filter)
	if err != nil {
		return nil, err
	}

	// Calculate pagination values
	page := 0
	if filter.Skip > 0 && filter.Limit > 0 {
		page = filter.Skip / filter.Limit
	}

	// Build the response
	response := &models.ExerciseListResponse{
		Exercises: exercises,
		Total:     len(exercises), // In a real app, do a count query instead
		Page:      page + 1,       // Pages are 1-indexed in the response
		PageSize:  filter.Limit,
	}

	return response, nil
}

// UpdateExercise updates an exercise
func (m *Manager) UpdateExercise(ctx context.Context, id string, request models.UpdateExerciseRequest) (*models.Exercise, error) {
	// Check if the exercise exists
	existingExercise, err := m.db.GetExerciseByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if existingExercise == nil {
		return nil, errors.New("exercise not found")
	}

	// Check if the name is being changed and if so, if it conflicts with another exercise
	if request.Name != existingExercise.Name {
		exerciseWithName, err := m.db.GetExerciseByName(ctx, request.Name)
		if err != nil {
			return nil, err
		}
		if exerciseWithName != nil && exerciseWithName.ID != id {
			return nil, errors.New("another exercise with this name already exists")
		}
	}

	// Update the exercise
	updatedExercise := models.Exercise{
		ID:             id,
		Name:           request.Name,
		Description:    request.Description,
		MuscleGroups:   request.MuscleGroups,
		Equipment:      request.Equipment,
		Difficulty:     request.Difficulty,
		ExerciseType:   request.ExerciseType,
		DemoVideoURL:   request.DemoVideoURL,
		DemoImageURL:   request.DemoImageURL,
		Instructions:   request.Instructions,
		RecommendedFor: request.RecommendedFor,
	}

	err = m.db.UpdateExercise(ctx, id, updatedExercise)
	if err != nil {
		return nil, err
	}

	return &updatedExercise, nil
}

// DeleteExercise deletes an exercise
func (m *Manager) DeleteExercise(ctx context.Context, id string) error {
	// Check if the exercise exists
	existingExercise, err := m.db.GetExerciseByID(ctx, id)
	if err != nil {
		return err
	}
	if existingExercise == nil {
		return errors.New("exercise not found")
	}

	// Delete the exercise
	return m.db.DeleteExercise(ctx, id)
}

// Workout related methods

// SearchExercises searches for exercises based on search criteria
func (m *Manager) SearchExercises(ctx context.Context, request models.ExerciseSearchRequest) (*models.ExerciseSearchResponse, error) {
	// Create filter from search request
	filter := models.ExerciseFilter{
		Query:        request.Query,
		MuscleGroups: request.MuscleGroups,
		Equipment:    request.Equipment,
		Difficulty:   request.Difficulty,
		ExerciseType: request.ExerciseType,
		Limit:        request.Limit,
	}

	// Use ListExercises to get filtered exercises
	result, err := m.ListExercises(ctx, filter)
	if err != nil {
		return nil, err
	}

	// Convert to search response
	response := &models.ExerciseSearchResponse{
		Exercises: result.Exercises,
		Total:     result.Total,
	}

	return response, nil
}

// CreateWorkoutPlan creates a new workout plan
func (m *Manager) CreateWorkoutPlan(ctx context.Context, userID string, request models.CreateWorkoutPlanRequest) (*models.WorkoutPlanResponse, error) {
	m.log.WithFields(logrus.Fields{
		"user_id":   userID,
		"plan_name": request.Name,
	}).Info("Creating new workout plan")

	// Verify user exists
	user, err := m.db.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	// Create the workout plan in the database
	id, err := m.db.CreateWorkoutPlan(ctx, userID, request)
	if err != nil {
		m.log.WithError(err).Error("Failed to create workout plan")
		return nil, err
	}

	// Retrieve the created workout plan
	plan, err := m.db.GetWorkoutPlan(ctx, userID)
	if err != nil {
		m.log.WithError(err).Error("Failed to retrieve created workout plan")
		return nil, err
	}

	m.log.WithFields(logrus.Fields{
		"user_id": userID,
		"plan_id": id,
	}).Info("Workout plan created successfully")

	return plan, nil
}

// GetWorkoutPlan gets a workout plan by user ID
func (m *Manager) GetWorkoutPlan(ctx context.Context, userID string) (*models.WorkoutPlanResponse, error) {
	m.log.WithField("user_id", userID).Debug("Getting workout plan")

	// Verify user exists
	user, err := m.db.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	// Get the workout plan from the database
	plan, err := m.db.GetWorkoutPlan(ctx, userID)
	if err != nil {
		m.log.WithError(err).Error("Failed to get workout plan")
		return nil, err
	}

	// If plan not found
	if plan == nil {
		m.log.WithField("user_id", userID).Debug("No workout plan found")
		return nil, nil
	}

	m.log.WithField("user_id", userID).Debug("Workout plan retrieved successfully")
	return plan, nil
}

// UpdateWorkoutPlan updates a workout plan
func (m *Manager) UpdateWorkoutPlan(ctx context.Context, userID string, request models.UpdateWorkoutPlanRequest) (*models.WorkoutPlanResponse, error) {
	m.log.WithField("user_id", userID).Info("Updating workout plan")

	// Verify user exists
	user, err := m.db.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	// Update the workout plan
	err = m.db.UpdateWorkoutPlan(ctx, userID, request)
	if err != nil {
		m.log.WithError(err).Error("Failed to update workout plan")
		return nil, err
	}

	// Get the updated workout plan
	updatedPlan, err := m.db.GetWorkoutPlan(ctx, userID)
	if err != nil {
		m.log.WithError(err).Error("Failed to retrieve updated workout plan")
		return nil, err
	}

	m.log.WithField("user_id", userID).Info("Workout plan updated successfully")
	return updatedPlan, nil
}

// DeleteWorkoutPlan deletes a workout plan
func (m *Manager) DeleteWorkoutPlan(ctx context.Context, userID string) error {
	m.log.WithField("user_id", userID).Info("Deleting workout plan")

	// Verify user exists
	user, err := m.db.GetUserByID(ctx, userID)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("user not found")
	}

	// Delete the workout plan
	err = m.db.DeleteWorkoutPlan(ctx, userID)
	if err != nil {
		m.log.WithError(err).Error("Failed to delete workout plan")
		return err
	}

	m.log.WithField("user_id", userID).Info("Workout plan deleted successfully")
	return nil
}

// Progress related methods

// LogProgress logs a new progress entry
func (m *Manager) LogProgress(ctx context.Context, userID string, request models.LogProgressRequest) (*models.LogProgressResponse, error) {
	m.log.WithFields(logrus.Fields{
		"user_id":     userID,
		"metric_type": request.MetricType,
	}).Info("Logging progress")

	// Verify user exists
	user, err := m.db.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	// Log progress in the database
	id, err := m.db.LogProgress(ctx, userID, request)
	if err != nil {
		m.log.WithError(err).Error("Failed to log progress")
		return nil, err
	}

	// Set default recorded time to now if not provided
	recordedAt := time.Now()
	if request.RecordedAt != nil {
		recordedAt = *request.RecordedAt
	}

	// Create response
	response := &models.LogProgressResponse{
		ID:          id,
		UserID:      userID,
		MetricType:  request.MetricType,
		Value:       request.Value,
		Unit:        request.Unit,
		RecordedAt:  recordedAt,
		Notes:       request.Notes,
		Location:    request.Location,
		MeasureArea: request.MeasureArea,
		CreatedAt:   time.Now(),
	}

	m.log.WithFields(logrus.Fields{
		"user_id":     userID,
		"progress_id": id,
		"metric_type": request.MetricType,
	}).Info("Progress logged successfully")

	return response, nil
}

// GetProgress retrieves progress entries for a user with optional filters
func (m *Manager) GetProgress(ctx context.Context, userID string, request models.GetProgressRequest) (*models.GetProgressResponse, error) {
	logFields := logrus.Fields{"user_id": userID}
	if len(request.MetricTypes) > 0 {
		logFields["metric_types"] = request.MetricTypes
	}
	m.log.WithFields(logFields).Debug("Getting progress")

	// Verify user exists
	user, err := m.db.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	// Get progress entries from the database
	entries, err := m.db.GetProgress(ctx, userID, request)
	if err != nil {
		m.log.WithError(err).Error("Failed to get progress entries")
		return nil, err
	}

	// Create response
	response := &models.GetProgressResponse{
		Entries: entries,
		Total:   len(entries),
	}

	m.log.WithFields(logrus.Fields{
		"user_id": userID,
		"count":   len(entries),
	}).Debug("Progress entries retrieved successfully")

	return response, nil
}

// GetProgressSummary retrieves a summary of progress for a user
func (m *Manager) GetProgressSummary(ctx context.Context, userID string) (*models.GetProgressSummaryResponse, error) {
	m.log.WithField("user_id", userID).Debug("Getting progress summary")

	// Verify user exists
	user, err := m.db.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	// First get all progress data
	allProgress, err := m.GetProgress(ctx, userID, models.GetProgressRequest{})
	if err != nil {
		return nil, err
	}

	// Group by metric type
	metricMap := make(map[models.ProgressMetricType][]models.ProgressEntry)
	for _, entry := range allProgress.Entries {
		metricMap[entry.MetricType] = append(metricMap[entry.MetricType], entry)
	}

	// Create summaries
	summaries := []models.ProgressSummary{}

	for metricType, entries := range metricMap {
		if len(entries) == 0 {
			continue
		}

		// Sort entries by date (in a real implementation we already get them sorted)
		// entries are already sorted with newest first

		currentValue := entries[0].Value

		var previousValue float64
		if len(entries) > 1 {
			previousValue = entries[1].Value
		} else {
			previousValue = currentValue
		}

		change := currentValue - previousValue
		var percentChange float64
		if previousValue != 0 {
			percentChange = (change / previousValue) * 100
		}

		firstMeasurement := entries[len(entries)-1].RecordedAt

		summary := models.ProgressSummary{
			MetricType:        metricType,
			CurrentValue:      currentValue,
			PreviousValue:     previousValue,
			Change:            change,
			PercentageChange:  percentChange,
			Unit:              entries[0].Unit,
			LastMeasuredAt:    entries[0].RecordedAt,
			MeasurementsSince: firstMeasurement,
			TotalMeasurements: len(entries),
		}

		summaries = append(summaries, summary)
	}

	response := &models.GetProgressSummaryResponse{
		Summaries: summaries,
		UserID:    userID,
	}

	m.log.WithFields(logrus.Fields{
		"user_id":       userID,
		"summary_count": len(summaries),
	}).Debug("Progress summary retrieved successfully")

	return response, nil
}

// GetProgressTrend retrieves trend information for specified metrics
func (m *Manager) GetProgressTrend(ctx context.Context, userID string, metricTypes []models.ProgressMetricType) (*models.GetProgressTrendResponse, error) {
	m.log.WithFields(logrus.Fields{
		"user_id":      userID,
		"metric_types": metricTypes,
	}).Debug("Getting progress trends")

	// Verify user exists
	user, err := m.db.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	// First get all progress data
	allProgress, err := m.GetProgress(ctx, userID, models.GetProgressRequest{
		MetricTypes: metricTypes,
		SortOrder:   "desc", // newest first
	})
	if err != nil {
		return nil, err
	}

	// Group by metric type
	metricMap := make(map[models.ProgressMetricType][]models.ProgressEntry)
	for _, entry := range allProgress.Entries {
		metricMap[entry.MetricType] = append(metricMap[entry.MetricType], entry)
	}

	// Calculate trends
	trends := []models.ProgressTrend{}

	for metricType, entries := range metricMap {
		if len(entries) < 2 {
			// Need at least 2 data points for a trend
			continue
		}

		// Sort entries by date (in a real implementation)
		// For our case, assume oldest is last and newest is first (sorted desc)

		newestEntry := entries[0]
		oldestEntry := entries[len(entries)-1]

		startValue := oldestEntry.Value
		currentValue := newestEntry.Value
		totalChange := currentValue - startValue

		var percentChange float64
		if startValue != 0 {
			percentChange = (totalChange / startValue) * 100
		}

		// Calculate time difference
		timeDiff := newestEntry.RecordedAt.Sub(oldestEntry.RecordedAt)
		weeksDiff := float64(timeDiff.Hours()) / (24 * 7)
		monthsDiff := float64(timeDiff.Hours()) / (24 * 30)

		// Avoid division by zero
		weeklyRate := 0.0
		monthlyRate := 0.0

		if weeksDiff > 0 {
			weeklyRate = totalChange / weeksDiff
		}

		if monthsDiff > 0 {
			monthlyRate = totalChange / monthsDiff
		}

		trend := models.ProgressTrend{
			MetricType:    metricType,
			StartValue:    startValue,
			CurrentValue:  currentValue,
			StartDate:     oldestEntry.RecordedAt,
			EndDate:       newestEntry.RecordedAt,
			TotalChange:   totalChange,
			PercentChange: percentChange,
			WeeklyRate:    math.Round(weeklyRate*100) / 100, // Round to 2 decimal places
			MonthlyRate:   math.Round(monthlyRate*100) / 100,
			Unit:          newestEntry.Unit,
			DataPoints:    len(entries),
		}

		trends = append(trends, trend)
	}

	response := &models.GetProgressTrendResponse{
		Trends: trends,
		UserID: userID,
	}

	m.log.WithFields(logrus.Fields{
		"user_id":     userID,
		"trend_count": len(trends),
	}).Debug("Progress trends retrieved successfully")

	return response, nil
}

// DeleteProgress deletes a progress entry
func (m *Manager) DeleteProgress(ctx context.Context, userID string, entryID string) error {
	m.log.WithFields(logrus.Fields{
		"user_id":     userID,
		"progress_id": entryID,
	}).Info("Deleting progress entry")

	// Verify user exists
	user, err := m.db.GetUserByID(ctx, userID)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("user not found")
	}

	// Delete progress entry
	err = m.db.DeleteProgress(ctx, userID, entryID)
	if err != nil {
		m.log.WithError(err).Error("Failed to delete progress entry")
		return err
	}

	m.log.WithFields(logrus.Fields{
		"user_id":     userID,
		"progress_id": entryID,
	}).Info("Progress entry deleted successfully")

	return nil
}
