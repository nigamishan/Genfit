package mongodb

import (
	"context"
	"fmt"
	"time"

	"github.com/fitness-backend/internal/logger"
	"github.com/fitness-backend/internal/models"
	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Repository handles database operations for all entities
type Repository struct {
	db                 *Database
	userCollection     *mongo.Collection
	exerciseCollection *mongo.Collection
	workoutCollection  *mongo.Collection
	progressCollection *mongo.Collection
	log                *logrus.Logger
}

// NewRepository creates a new repository
func NewRepository(db *Database) *Repository {
	log := logger.GetLogger()
	log.Debug("Initializing repository with collections")

	return &Repository{
		db:                 db,
		userCollection:     db.GetCollection("users"),
		exerciseCollection: db.GetCollection("exercises"),
		workoutCollection:  db.GetCollection("workout_plans"),
		progressCollection: db.GetCollection("progress"),
		log:                log,
	}
}

// =================== USER OPERATIONS ===================

// CreateUser creates a new user in the database
func (r *Repository) CreateUser(ctx context.Context, user UserModel) (string, error) {
	r.log.WithField("email", user.Email).Debug("Creating user")

	result, err := r.userCollection.InsertOne(ctx, user)
	if err != nil {
		r.log.WithError(err).Error("Failed to create user")
		return "", err
	}

	id, ok := result.InsertedID.(primitive.ObjectID)
	if !ok {
		r.log.Error("Invalid ObjectID after user creation")
		return "", nil
	}

	r.log.WithField("id", id.Hex()).Debug("User created")
	return id.Hex(), nil
}

// GetUserByID retrieves a user by ID
func (r *Repository) GetUserByID(ctx context.Context, id string) (*UserModel, error) {
	r.log.WithField("id", id).Debug("Retrieving user by ID")

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		r.log.WithError(err).Error("Invalid user ID format")
		return nil, err
	}

	var user UserModel
	err = r.userCollection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			r.log.WithField("id", id).Debug("User not found")
			return nil, nil
		}
		r.log.WithError(err).Error("Error retrieving user")
		return nil, err
	}

	return &user, nil
}

// GetUserByID retrieves a user by Username
func (r *Repository) GetUserByUsername(ctx context.Context, username string) (*UserModel, error) {
	r.log.WithField("username", username).Debug("Retrieving user by Username")

	var user UserModel
	err := r.userCollection.FindOne(ctx, bson.M{"username": username}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			r.log.WithField("username", username).Debug("User not found")
			return nil, nil
		}
		r.log.WithError(err).Error("Error retrieving user")
		return nil, err
	}

	return &user, nil
}

// UpdateUser updates a user in the database
func (r *Repository) UpdateUser(ctx context.Context, id string, updates bson.M) error {
	r.log.WithField("id", id).Debug("Updating user")

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		r.log.WithError(err).Error("Invalid user ID format")
		return err
	}

	// Always update the UpdatedAt field
	updates["updated_at"] = time.Now()

	result, err := r.userCollection.UpdateOne(
		ctx,
		bson.M{"_id": objectID},
		bson.M{"$set": updates},
	)

	if err != nil {
		r.log.WithError(err).Error("Failed to update user")
		return err
	}

	r.log.WithFields(logrus.Fields{
		"id":           id,
		"matchedDocs":  result.MatchedCount,
		"modifiedDocs": result.ModifiedCount,
	}).Debug("User updated")

	return nil
}

// ReplaceUser replaces an entire user document in the database
func (r *Repository) ReplaceUser(ctx context.Context, id string, user UserModel) error {
	r.log.WithField("id", id).Debug("Replacing user document")

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		r.log.WithError(err).Error("Invalid user ID format")
		return err
	}

	// Ensure the correct ID is set
	if user.ID.IsZero() {
		user.ID = objectID
	}

	// Replace the entire document
	result, err := r.userCollection.ReplaceOne(
		ctx,
		bson.M{"_id": objectID},
		user,
	)

	if err != nil {
		r.log.WithError(err).Error("Failed to replace user document")
		return err
	}

	r.log.WithFields(logrus.Fields{
		"id":           id,
		"matchedDocs":  result.MatchedCount,
		"modifiedDocs": result.ModifiedCount,
	}).Debug("User document replaced")

	return nil
}

// DeleteUser deletes a user from the database
func (r *Repository) DeleteUser(ctx context.Context, id string) error {
	r.log.WithField("id", id).Info("Deleting user")

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		r.log.WithError(err).Error("Invalid user ID format")
		return err
	}

	result, err := r.userCollection.DeleteOne(ctx, bson.M{"_id": objectID})
	if err != nil {
		r.log.WithError(err).Error("Failed to delete user")
		return err
	}

	r.log.WithFields(logrus.Fields{
		"id":           id,
		"deletedCount": result.DeletedCount,
	}).Info("User deleted")

	return nil
}

// ReplaceUserByUsername replaces an entire user document in the database by username
func (r *Repository) ReplaceUserByUsername(ctx context.Context, username string, user UserModel) error {
	r.log.WithField("username", username).Debug("Replacing user document by username")

	// Find the user first to get the ObjectID
	existingUser, err := r.GetUserByUsername(ctx, username)
	if err != nil {
		return err
	}
	if existingUser == nil {
		return fmt.Errorf("user with username %s not found", username)
	}

	// Ensure the correct ID is set
	user.ID = existingUser.ID
	user.Username = username // Ensure username doesn't change

	// Replace the entire document
	result, err := r.userCollection.ReplaceOne(
		ctx,
		bson.M{"username": username},
		user,
	)

	if err != nil {
		r.log.WithError(err).Error("Failed to replace user document by username")
		return err
	}

	r.log.WithFields(logrus.Fields{
		"username":     username,
		"matchedDocs":  result.MatchedCount,
		"modifiedDocs": result.ModifiedCount,
	}).Debug("User document replaced by username")

	return nil
}

// DeleteUserByUsername deletes a user from the database by username
func (r *Repository) DeleteUserByUsername(ctx context.Context, username string) error {
	r.log.WithField("username", username).Info("Deleting user by username")

	result, err := r.userCollection.DeleteOne(ctx, bson.M{"username": username})
	if err != nil {
		r.log.WithError(err).Error("Failed to delete user by username")
		return err
	}

	r.log.WithFields(logrus.Fields{
		"username":     username,
		"deletedCount": result.DeletedCount,
	}).Info("User deleted by username")

	return nil
}

// =================== EXERCISE OPERATIONS ===================

// CreateExercise creates a new exercise in the database
func (r *Repository) CreateExercise(ctx context.Context, exercise models.Exercise) (string, error) {
	r.log.WithField("name", exercise.Name).Debug("Creating exercise")

	exerciseModel := FromExercise(exercise)

	result, err := r.exerciseCollection.InsertOne(ctx, exerciseModel)
	if err != nil {
		r.log.WithError(err).Error("Failed to create exercise")
		return "", err
	}

	id, ok := result.InsertedID.(primitive.ObjectID)
	if !ok {
		r.log.Error("Invalid ObjectID after exercise creation")
		return "", nil
	}

	r.log.WithFields(logrus.Fields{
		"id":   id.Hex(),
		"name": exercise.Name,
	}).Debug("Exercise created")

	return id.Hex(), nil
}

// GetExerciseByID retrieves an exercise by ID
func (r *Repository) GetExerciseByID(ctx context.Context, id string) (*models.Exercise, error) {
	r.log.WithField("id", id).Debug("Retrieving exercise by ID")

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		r.log.WithError(err).Error("Invalid exercise ID format")
		return nil, err
	}

	var exerciseModel ExerciseModel
	err = r.exerciseCollection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&exerciseModel)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			r.log.WithField("id", id).Debug("Exercise not found")
			return nil, nil
		}
		r.log.WithError(err).Error("Error retrieving exercise")
		return nil, err
	}

	exercise := exerciseModel.ToExercise()
	return &exercise, nil
}

// GetExerciseByName retrieves an exercise by name (case-insensitive)
func (r *Repository) GetExerciseByName(ctx context.Context, name string) (*models.Exercise, error) {
	r.log.WithField("name", name).Debug("Retrieving exercise by name")

	var exerciseModel ExerciseModel

	// Case-insensitive search
	filter := bson.M{"name": bson.M{"$regex": primitive.Regex{Pattern: "^" + name + "$", Options: "i"}}}

	err := r.exerciseCollection.FindOne(ctx, filter).Decode(&exerciseModel)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			r.log.WithField("name", name).Debug("Exercise not found")
			return nil, nil
		}
		r.log.WithError(err).WithField("name", name).Error("Error retrieving exercise")
		return nil, err
	}

	exercise := exerciseModel.ToExercise()
	return &exercise, nil
}

// ListExercises lists exercises with optional filters
func (r *Repository) ListExercises(ctx context.Context, filter *models.ExerciseFilter) ([]models.Exercise, error) {
	logFields := logrus.Fields{}
	if filter.Query != "" {
		logFields["query"] = filter.Query
	}
	if filter.Limit > 0 {
		logFields["limit"] = filter.Limit
	}
	if len(filter.PrimaryMuscleGroups) > 0 {
		logFields["primary_muscle_groups"] = filter.PrimaryMuscleGroups
	}
	if len(filter.SupportingMuscleGroups) > 0 {
		logFields["supporting_muscle_groups"] = filter.SupportingMuscleGroups
	}

	r.log.WithFields(logFields).Debug("Listing exercises with filters")

	findOptions := options.Find()

	// Set limit if provided
	if filter.Limit > 0 {
		findOptions.SetLimit(int64(filter.Limit))
	}

	// Set skip if provided
	if filter.Skip > 0 {
		findOptions.SetSkip(int64(filter.Skip))
	}

	// Set sorting
	sortBy := "name"
	if filter.SortBy != "" {
		sortBy = filter.SortBy
	}
	sortOrder := 1 // ascending
	if filter.SortOrder == "desc" {
		sortOrder = -1
	}
	findOptions.SetSort(bson.D{{Key: sortBy, Value: sortOrder}})

	// Build filter criteria
	filterBson := bson.M{}

	// Name search if query is provided - case insensitive substring match
	if filter.Query != "" {
		filterBson["name"] = bson.M{
			"$regex":   filter.Query,
			"$options": "i", // case insensitive
		}
	}

	// Primary muscle groups filter
	if len(filter.PrimaryMuscleGroups) > 0 {
		filterBson["primary_muscle_groups"] = bson.M{
			"$in": filter.PrimaryMuscleGroups,
		}
	}

	// Supporting muscle groups filter
	if len(filter.SupportingMuscleGroups) > 0 {
		filterBson["supporting_muscle_groups"] = bson.M{
			"$in": filter.SupportingMuscleGroups,
		}
	}

	// Equipment filter
	if len(filter.Equipment) > 0 {
		filterBson["equipment"] = bson.M{
			"$in": filter.Equipment,
		}
	}

	// Difficulty filter
	if filter.Difficulty != "" {
		filterBson["difficulty"] = filter.Difficulty
	}

	// Exercise type filter
	if filter.ExerciseType != "" {
		filterBson["exercise_type"] = filter.ExerciseType
	}

	// Execute the query
	cursor, err := r.exerciseCollection.Find(ctx, filterBson, findOptions)
	if err != nil {
		r.log.WithError(err).Error("Failed to query exercises")
		return nil, err
	}
	defer cursor.Close(ctx)

	// Decode the results
	var exerciseModels []ExerciseModel
	if err = cursor.All(ctx, &exerciseModels); err != nil {
		r.log.WithError(err).Error("Failed to decode exercise results")
		return nil, err
	}

	// Convert to Exercise models
	exercises := make([]models.Exercise, 0, len(exerciseModels))
	for _, model := range exerciseModels {
		exercises = append(exercises, model.ToExercise())
	}

	r.log.WithField("count", len(exercises)).Debug("Exercise list retrieved")

	return exercises, nil
}

// UpdateExercise updates an exercise
func (r *Repository) UpdateExercise(ctx context.Context, id string, exercise models.Exercise) error {
	r.log.WithFields(logrus.Fields{
		"id":   id,
		"name": exercise.Name,
	}).Debug("Updating exercise")

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		r.log.WithError(err).Error("Invalid exercise ID format")
		return err
	}

	// Convert to ExerciseModel
	exerciseModel := FromExercise(exercise)
	exerciseModel.ID = objectID          // Ensure ID is preserved
	exerciseModel.UpdatedAt = time.Now() // Update the timestamp

	// Replace the document
	result, err := r.exerciseCollection.ReplaceOne(ctx, bson.M{"_id": objectID}, exerciseModel)
	if err != nil {
		r.log.WithError(err).Error("Failed to update exercise")
		return err
	}

	r.log.WithFields(logrus.Fields{
		"id":           id,
		"matchedDocs":  result.MatchedCount,
		"modifiedDocs": result.ModifiedCount,
	}).Debug("Exercise updated")

	return nil
}

// DeleteExercise deletes an exercise
func (r *Repository) DeleteExercise(ctx context.Context, id string) error {
	r.log.WithField("id", id).Info("Deleting exercise")

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		r.log.WithError(err).Error("Invalid exercise ID format")
		return err
	}

	result, err := r.exerciseCollection.DeleteOne(ctx, bson.M{"_id": objectID})
	if err != nil {
		r.log.WithError(err).Error("Failed to delete exercise")
		return err
	}

	r.log.WithFields(logrus.Fields{
		"id":           id,
		"deletedCount": result.DeletedCount,
	}).Info("Exercise deleted")

	return nil
}

// =================== WORKOUT PLAN OPERATIONS ===================

// CreateWorkoutPlan creates a workout plan for a user
func (r *Repository) CreateWorkoutPlan(ctx context.Context, userID string, plan models.CreateWorkoutPlanRequest) (string, error) {
	r.log.WithFields(logrus.Fields{
		"user_id": userID,
		"name":    plan.Name,
	}).Debug("Creating workout plan")

	// Convert workouts to WorkoutModel
	workouts := make([]WorkoutModel, 0, len(plan.Workouts))
	for _, workout := range plan.Workouts {
		workouts = append(workouts, FromWorkout(workout))
	}

	// Create the workout plan model
	now := time.Now()
	workoutPlan := WorkoutPlanModel{
		ID:          primitive.NewObjectID(),
		UserID:      userID,
		Name:        plan.Name,
		Description: plan.Description,
		Workouts:    workouts,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	// Insert the workout plan
	result, err := r.workoutCollection.InsertOne(ctx, workoutPlan)
	if err != nil {
		r.log.WithError(err).Error("Failed to create workout plan")
		return "", err
	}

	id, ok := result.InsertedID.(primitive.ObjectID)
	if !ok {
		r.log.Error("Invalid ObjectID after workout plan creation")
		return "", nil
	}

	r.log.WithFields(logrus.Fields{
		"id":      id.Hex(),
		"user_id": userID,
	}).Debug("Workout plan created")

	return id.Hex(), nil
}

// GetWorkoutPlan retrieves a workout plan by user ID
func (r *Repository) GetWorkoutPlan(ctx context.Context, userID string) (*models.WorkoutPlanResponse, error) {
	r.log.WithField("user_id", userID).Debug("Retrieving workout plan")

	// Find the workout plan by user ID
	var workoutPlan WorkoutPlanModel
	err := r.workoutCollection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&workoutPlan)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			r.log.WithField("user_id", userID).Debug("Workout plan not found")
			return nil, nil
		}
		r.log.WithError(err).Error("Error retrieving workout plan")
		return nil, err
	}

	// Convert to response model
	response := workoutPlan.ToWorkoutPlanResponse()

	// Fetch exercise details for each workout
	for i, workout := range response.Workouts {
		if workout.ExerciseID != "" {
			exercise, err := r.GetExerciseByID(ctx, workout.ExerciseID)
			if err == nil && exercise != nil {
				response.Workouts[i].Exercise = exercise
			}
		}
	}

	r.log.WithFields(logrus.Fields{
		"id":      response.ID,
		"user_id": userID,
	}).Debug("Workout plan retrieved")

	return &response, nil
}

// UpdateWorkoutPlan updates a workout plan
func (r *Repository) UpdateWorkoutPlan(ctx context.Context, userID string, updates models.UpdateWorkoutPlanRequest) error {
	r.log.WithField("user_id", userID).Debug("Updating workout plan")

	// First, get the current workout plan
	var workoutPlan WorkoutPlanModel
	err := r.workoutCollection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&workoutPlan)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			r.log.WithField("user_id", userID).Debug("Workout plan not found for update")
			return err
		}
		r.log.WithError(err).Error("Error retrieving workout plan for update")
		return err
	}

	// Apply updates
	if updates.Name != nil {
		workoutPlan.Name = *updates.Name
	}

	if updates.Description != nil {
		workoutPlan.Description = *updates.Description
	}

	if updates.Workouts != nil {
		// Convert workouts to WorkoutModel
		workouts := make([]WorkoutModel, 0, len(updates.Workouts))
		for _, workout := range updates.Workouts {
			workouts = append(workouts, FromWorkout(workout))
		}
		workoutPlan.Workouts = workouts
	}

	workoutPlan.UpdatedAt = time.Now()

	// Update the document
	result, err := r.workoutCollection.ReplaceOne(ctx, bson.M{"_id": workoutPlan.ID}, workoutPlan)
	if err != nil {
		r.log.WithError(err).Error("Failed to update workout plan")
		return err
	}

	r.log.WithFields(logrus.Fields{
		"id":           workoutPlan.ID.Hex(),
		"user_id":      userID,
		"matchedDocs":  result.MatchedCount,
		"modifiedDocs": result.ModifiedCount,
	}).Debug("Workout plan updated")

	return nil
}

// DeleteWorkoutPlan deletes a workout plan
func (r *Repository) DeleteWorkoutPlan(ctx context.Context, userID string) error {
	r.log.WithField("user_id", userID).Info("Deleting workout plan")

	// Delete the workout plan
	result, err := r.workoutCollection.DeleteOne(ctx, bson.M{"user_id": userID})
	if err != nil {
		r.log.WithError(err).Error("Failed to delete workout plan")
		return err
	}

	r.log.WithFields(logrus.Fields{
		"user_id":      userID,
		"deletedCount": result.DeletedCount,
	}).Info("Workout plan deleted")

	return nil
}

// =================== PROGRESS TRACKING OPERATIONS ===================

// LogProgress creates a new progress entry
func (r *Repository) LogProgress(ctx context.Context, userID string, progress models.LogProgressRequest) (string, error) {
	r.log.WithFields(logrus.Fields{
		"user_id":     userID,
		"metric_type": progress.MetricType,
	}).Debug("Logging progress")

	// Create progress entry
	recordedAt := time.Now()
	if progress.RecordedAt != nil {
		recordedAt = *progress.RecordedAt
	}

	progressEntry := models.ProgressEntry{
		UserID:      userID,
		MetricType:  progress.MetricType,
		Value:       progress.Value,
		Unit:        progress.Unit,
		RecordedAt:  recordedAt,
		Notes:       progress.Notes,
		Location:    progress.Location,
		MeasureArea: progress.MeasureArea,
	}

	// Convert to MongoDB model
	progressModel := FromProgressEntry(progressEntry)

	// Insert into database
	result, err := r.progressCollection.InsertOne(ctx, progressModel)
	if err != nil {
		r.log.WithError(err).Error("Failed to create progress entry")
		return "", err
	}

	id, ok := result.InsertedID.(primitive.ObjectID)
	if !ok {
		r.log.Error("Invalid ObjectID after progress entry creation")
		return "", nil
	}

	r.log.WithFields(logrus.Fields{
		"id":          id.Hex(),
		"user_id":     userID,
		"metric_type": progress.MetricType,
	}).Debug("Progress entry created")

	return id.Hex(), nil
}

// GetProgress retrieves progress entries for a user with filters
func (r *Repository) GetProgress(ctx context.Context, userID string, request models.GetProgressRequest) ([]models.ProgressEntry, error) {
	logFields := logrus.Fields{"user_id": userID}
	if len(request.MetricTypes) > 0 {
		logFields["metric_types"] = request.MetricTypes
	}
	r.log.WithFields(logFields).Debug("Retrieving progress entries")

	// Build filters
	filter := bson.M{"user_id": userID}

	// Add metric type filter if provided
	if len(request.MetricTypes) > 0 {
		filter["metric_type"] = bson.M{"$in": request.MetricTypes}
	}

	// Add date range filters if provided
	if request.StartDate != nil || request.EndDate != nil {
		dateFilter := bson.M{}
		if request.StartDate != nil {
			dateFilter["$gte"] = *request.StartDate
		}
		if request.EndDate != nil {
			dateFilter["$lte"] = *request.EndDate
		}
		filter["recorded_at"] = dateFilter
	}

	// Set up options for sorting and pagination
	findOptions := options.Find()

	// Sort by recorded date, defaulting to newest first
	sortDirection := -1 // DESC
	if request.SortOrder == "asc" {
		sortDirection = 1 // ASC
	}
	findOptions.SetSort(bson.D{{Key: "recorded_at", Value: sortDirection}})

	// Apply limit if provided
	if request.Limit > 0 {
		findOptions.SetLimit(int64(request.Limit))
	}

	// Execute query
	cursor, err := r.progressCollection.Find(ctx, filter, findOptions)
	if err != nil {
		r.log.WithError(err).Error("Failed to query progress entries")
		return nil, err
	}
	defer cursor.Close(ctx)

	// Decode results
	var progressModels []ProgressEntryModel
	if err = cursor.All(ctx, &progressModels); err != nil {
		r.log.WithError(err).Error("Failed to decode progress results")
		return nil, err
	}

	// Convert to ProgressEntry models
	entries := make([]models.ProgressEntry, 0, len(progressModels))
	for _, model := range progressModels {
		entries = append(entries, model.ToProgressEntry())
	}

	r.log.WithFields(logrus.Fields{
		"user_id": userID,
		"count":   len(entries),
	}).Debug("Progress entries retrieved")

	return entries, nil
}

// CountProgress counts progress entries for metrics
func (r *Repository) CountProgress(ctx context.Context, userID string, metricType models.ProgressMetricType) (int, error) {
	r.log.WithFields(logrus.Fields{
		"user_id":     userID,
		"metric_type": metricType,
	}).Debug("Counting progress entries")

	// Build filter
	filter := bson.M{
		"user_id":     userID,
		"metric_type": metricType,
	}

	// Count documents
	count, err := r.progressCollection.CountDocuments(ctx, filter)
	if err != nil {
		r.log.WithError(err).Error("Failed to count progress entries")
		return 0, err
	}

	return int(count), nil
}

// DeleteProgress deletes a progress entry
func (r *Repository) DeleteProgress(ctx context.Context, userID string, entryID string) error {
	r.log.WithFields(logrus.Fields{
		"user_id":     userID,
		"progress_id": entryID,
	}).Info("Deleting progress entry")

	// Convert ID to ObjectID
	objectID, err := primitive.ObjectIDFromHex(entryID)
	if err != nil {
		r.log.WithError(err).Error("Invalid progress entry ID format")
		return err
	}

	// Delete with both user ID and entry ID for security
	filter := bson.M{
		"_id":     objectID,
		"user_id": userID,
	}

	result, err := r.progressCollection.DeleteOne(ctx, filter)
	if err != nil {
		r.log.WithError(err).Error("Failed to delete progress entry")
		return err
	}

	r.log.WithFields(logrus.Fields{
		"user_id":      userID,
		"progress_id":  entryID,
		"deletedCount": result.DeletedCount,
	}).Info("Progress entry deleted")

	return nil
}
