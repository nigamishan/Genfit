package http

import (
	"net/http"
	"strconv"
	"time"

	"github.com/fitness-backend/internal/manager"
	"github.com/fitness-backend/internal/models"
	"github.com/fitness-backend/internal/server/http/middlewares"
	"github.com/gin-gonic/gin"
)

type Route struct {
	manager *manager.Manager
}

func NewRoute(manager *manager.Manager) *Route {
	return &Route{
		manager: manager,
	}
}

const (
	UserPath     = "/users"
	WorkoutPath  = "/workout"
	ProgressPath = "/progress"
	AuthPath     = "/auth"
	AdminPath    = "/admin"
	ExercisePath = "/exercises"
)

func (r *Route) SetupRoutes(engine *gin.Engine) {
	// Initialize route groups
	user := engine.Group(UserPath)
	workout := engine.Group(WorkoutPath)
	progress := engine.Group(ProgressPath)
	exercises := engine.Group(ExercisePath)
	// auth := engine.Group(AuthPath) // Uncomment when implementing auth routes

	// Public routes (no authentication required)
	exercises.GET("/search", r.UserSearchExercises) // Public search for exercises

	// Protected user routes - using username from context instead of path parameter
	authenticatedUser := user.Group("")
	authenticatedUser.Use(middlewares.AuthMiddleware())  // Apply user authentication middleware
	authenticatedUser.POST("", r.CreateUser)             // Create new user profile
	authenticatedUser.GET("/me", r.GetUserProfile)       // Get current user's profile
	authenticatedUser.PUT("/me", r.UpdateUserProfile)    // Update current user's profile
	authenticatedUser.DELETE("/me", r.DeleteUserProfile) // Delete current user's profile

	// Protected workout routes - using username from context
	workout.Use(middlewares.AuthMiddleware()) // Apply user authentication middleware
	workout.POST("/manual", r.CreateManualWorkout)
	workout.GET("/me", r.GetWorkoutPlan)       // Get current user's workout plan
	workout.PUT("/me", r.UpdateWorkoutPlan)    // Update current user's workout plan
	workout.DELETE("/me", r.DeleteWorkoutPlan) // Delete current user's workout plan
	workout.POST("/exercises/search", r.SearchExercises)

	// Protected progress routes - using username from context
	progress.Use(middlewares.AuthMiddleware()) // Apply user authentication middleware
	progress.POST("", r.LogProgress)
	progress.GET("/me", r.GetProgress)                // Get current user's progress
	progress.GET("/me/summary", r.GetProgressSummary) // Get current user's progress summary
	progress.GET("/me/trend", r.GetProgressTrend)     // Get current user's progress trend
	progress.DELETE("", r.DeleteProgress)

	// Protected exercise details route
	authenticatedExercise := exercises.Group("")
	authenticatedExercise.Use(middlewares.AuthMiddleware())
	authenticatedExercise.GET("/:id", r.GetExerciseDetails)

	// Admin routes with admin authentication
	admin := engine.Group(AdminPath)
	admin.Use(middlewares.AdminAuthMiddleware()) // Apply admin authentication middleware

	// Admin exercise management routes
	adminExercises := admin.Group("/exercises")
	adminExercises.POST("", r.CreateExercise)
	adminExercises.GET("", r.ListExercises)
	adminExercises.GET("/:id", r.GetExerciseByID)
	adminExercises.GET("/name/:name", r.GetExerciseByName)
	adminExercises.PUT("/:id", r.UpdateExercise)
	adminExercises.DELETE("/:id", r.DeleteExercise)

	// Auth routes - To be implemented later if needed
	/*
		auth := engine.Group(AuthPath)
		auth.POST("/register", r.Register) // Register new user
		auth.POST("/login", r.Login)       // Login
	*/
}

// User handlers
func (r *Route) CreateUser(c *gin.Context) {
	var request models.UserRegistrationRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: err.Error(),
		})
		return
	}

	user, err := r.manager.CreateUser(c, request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to create user",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, user)
}

func (r *Route) GetUserProfile(c *gin.Context) {
	// Get username from context set by middleware
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "Unauthorized",
			Message: "Username not found in context",
		})
		return
	}

	user, err := r.manager.GetUserByUsername(c, username.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to get user",
			Message: err.Error(),
		})
		return
	}

	if user == nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{
			Error:   "User not found",
			Message: "No user found with the specified username",
		})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (r *Route) UpdateUserProfile(c *gin.Context) {
	// Get username from context set by middleware
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "Unauthorized",
			Message: "Username not found in context",
		})
		return
	}

	var request models.UserUpdateRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: err.Error(),
		})
		return
	}

	// Note: This will replace the entire user object, not just update specific fields
	user, err := r.manager.UpdateUserByUsername(c, username.(string), request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to update user",
			Message: err.Error(),
		})
		return
	}

	if user == nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{
			Error:   "User not found",
			Message: "No user found with the specified username",
		})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (r *Route) DeleteUserProfile(c *gin.Context) {
	// Get username from context set by middleware
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "Unauthorized",
			Message: "Username not found in context",
		})
		return
	}

	err := r.manager.DeleteUserByUsername(c, username.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to delete user",
			Message: err.Error(),
		})
		return
	}

	c.Status(http.StatusNoContent)
}

// Workout handlers
/* AI workout generation to be implemented later
func (r *Route) GenerateAIWorkout(c *gin.Context) {
	// TODO: Parse and validate request body
	// TODO: Call manager to generate AI workout
}
*/

func (r *Route) CreateManualWorkout(c *gin.Context) {
	var request models.CreateWorkoutPlanRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: err.Error(),
		})
		return
	}

	// Get username from context set by middleware
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "Unauthorized",
			Message: "Username not found in context",
		})
		return
	}

	// Create the workout plan
	response, err := r.manager.CreateWorkoutPlanByUsername(c, username.(string), request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to create workout plan",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, response)
}

func (r *Route) GetWorkoutPlan(c *gin.Context) {
	// Get username from context set by middleware
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "Unauthorized",
			Message: "Username not found in context",
		})
		return
	}

	// Get the workout plan
	response, err := r.manager.GetWorkoutPlanByUsername(c, username.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to get workout plan",
			Message: err.Error(),
		})
		return
	}

	if response == nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{
			Error:   "Workout plan not found",
			Message: "No workout plan found for the specified user",
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

func (r *Route) UpdateWorkoutPlan(c *gin.Context) {
	// Get username from context set by middleware
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "Unauthorized",
			Message: "Username not found in context",
		})
		return
	}

	// Parse request body
	var request models.UpdateWorkoutPlanRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: err.Error(),
		})
		return
	}

	// Update the workout plan
	response, err := r.manager.UpdateWorkoutPlanByUsername(c, username.(string), request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to update workout plan",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

func (r *Route) DeleteWorkoutPlan(c *gin.Context) {
	// Get username from context set by middleware
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "Unauthorized",
			Message: "Username not found in context",
		})
		return
	}

	// Delete the workout plan
	err := r.manager.DeleteWorkoutPlanByUsername(c, username.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to delete workout plan",
			Message: err.Error(),
		})
		return
	}

	c.Status(http.StatusNoContent)
}

// Progress handlers
func (r *Route) LogProgress(c *gin.Context) {
	// Get username from context set by middleware
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "Unauthorized",
			Message: "Username not found in context",
		})
		return
	}

	// Parse and validate request body
	var request models.LogProgressRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: err.Error(),
		})
		return
	}

	// Log the progress
	response, err := r.manager.LogProgressByUsername(c, username.(string), request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to log progress",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, response)
}

func (r *Route) GetProgress(c *gin.Context) {
	// Get username from context set by middleware
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "Unauthorized",
			Message: "Username not found in context",
		})
		return
	}

	// Parse query parameters for filtering
	request := models.GetProgressRequest{}

	// Parse metric types
	metricTypesParam := c.QueryArray("metric_types[]")
	if len(metricTypesParam) > 0 {
		metricTypes := make([]models.ProgressMetricType, 0, len(metricTypesParam))
		for _, mt := range metricTypesParam {
			metricTypes = append(metricTypes, models.ProgressMetricType(mt))
		}
		request.MetricTypes = metricTypes
	}

	// Parse date range
	startDateStr := c.Query("start_date")
	if startDateStr != "" {
		startDate, err := time.Parse(time.RFC3339, startDateStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{
				Error:   "Invalid request",
				Message: "Invalid start_date format. Use RFC3339 format.",
			})
			return
		}
		request.StartDate = &startDate
	}

	endDateStr := c.Query("end_date")
	if endDateStr != "" {
		endDate, err := time.Parse(time.RFC3339, endDateStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{
				Error:   "Invalid request",
				Message: "Invalid end_date format. Use RFC3339 format.",
			})
			return
		}
		request.EndDate = &endDate
	}

	// Parse limit
	limitStr := c.Query("limit")
	if limitStr != "" {
		limit, err := strconv.Atoi(limitStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{
				Error:   "Invalid request",
				Message: "Invalid limit format. Must be an integer.",
			})
			return
		}
		request.Limit = limit
	}

	// Parse sort order
	request.SortOrder = c.DefaultQuery("sort_order", "desc")
	if request.SortOrder != "asc" && request.SortOrder != "desc" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: "Sort order must be 'asc' or 'desc'.",
		})
		return
	}

	// Get the progress data
	response, err := r.manager.GetProgressByUsername(c, username.(string), request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to get progress data",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

// GetProgressSummary returns a summary of progress metrics for a user
func (r *Route) GetProgressSummary(c *gin.Context) {
	// Get username from context set by middleware
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "Unauthorized",
			Message: "Username not found in context",
		})
		return
	}

	// Get the progress summary
	response, err := r.manager.GetProgressSummaryByUsername(c, username.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to get progress summary",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

// GetProgressTrend returns trend analysis for specific metrics
func (r *Route) GetProgressTrend(c *gin.Context) {
	// Get username from context set by middleware
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "Unauthorized",
			Message: "Username not found in context",
		})
		return
	}

	// Parse metric types
	metricTypesParam := c.QueryArray("metric_types[]")
	if len(metricTypesParam) == 0 {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: "At least one metric_type is required",
		})
		return
	}

	metricTypes := make([]models.ProgressMetricType, 0, len(metricTypesParam))
	for _, mt := range metricTypesParam {
		metricTypes = append(metricTypes, models.ProgressMetricType(mt))
	}

	// Get the progress trends
	response, err := r.manager.GetProgressTrendByUsername(c, username.(string), metricTypes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to get progress trends",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

// DeleteProgress deletes a progress entry
func (r *Route) DeleteProgress(c *gin.Context) {
	// Get username from context set by middleware
	username, exists := c.Get("username")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "Unauthorized",
			Message: "Username not found in context",
		})
		return
	}

	entryID := c.Query("entryId")
	if entryID == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: "Entry ID is required",
		})
		return
	}

	// Delete the progress entry
	err := r.manager.DeleteProgressByUsername(c, username.(string), entryID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to delete progress entry",
			Message: err.Error(),
		})
		return
	}

	c.Status(http.StatusNoContent)
}

// Auth handlers - To be implemented later
/*
func (r *Route) Register(c *gin.Context) {
	// TODO: Parse and validate request body
	// TODO: Call manager to register user
}

func (r *Route) Login(c *gin.Context) {
	// TODO: Parse and validate request body
	// TODO: Call manager to login user
}
*/

// SearchExercises handles exercise search requests for workout planning
func (r *Route) SearchExercises(c *gin.Context) {
	var request models.ExerciseSearchRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: err.Error(),
		})
		return
	}

	// Validate minimum query length
	if len(request.Query) < 3 {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: "Search query must be at least 3 characters long",
		})
		return
	}

	// Set default limit if not provided
	if request.Limit <= 0 {
		request.Limit = 20 // Default to 20 results
	}

	// Call manager to search exercises
	response, err := r.manager.SearchExercises(c, request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to search exercises",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

// Exercise management handlers for admin
// CreateExercise handles creation of a new exercise
func (r *Route) CreateExercise(c *gin.Context) {
	var request models.CreateExerciseRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: err.Error(),
		})
		return
	}

	exercise, err := r.manager.CreateExercise(c, request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to create exercise",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, exercise)
}

// GetExerciseByID retrieves an exercise by its ID
func (r *Route) GetExerciseByID(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: "Exercise ID is required",
		})
		return
	}

	exercise, err := r.manager.GetExerciseByID(c, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to get exercise",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, exercise)
}

// GetExerciseByName retrieves an exercise by its name
func (r *Route) GetExerciseByName(c *gin.Context) {
	name := c.Param("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: "Exercise name is required",
		})
		return
	}

	exercise, err := r.manager.GetExerciseByName(c, name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to get exercise",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, exercise)
}

// ListExercises lists exercises with optional filters
func (r *Route) ListExercises(c *gin.Context) {
	// Parse query parameters for filters
	filter := models.ExerciseFilter{}

	filter.Query = c.Query("query")

	// Parse muscle groups
	if muscleGroups := c.QueryArray("muscle_groups[]"); len(muscleGroups) > 0 {
		filter.MuscleGroups = muscleGroups
	}

	// Parse equipment
	if equipment := c.QueryArray("equipment[]"); len(equipment) > 0 {
		filter.Equipment = equipment
	}

	filter.Difficulty = c.Query("difficulty")
	filter.ExerciseType = c.Query("exercise_type")

	// Parse pagination
	if limitStr := c.Query("limit"); limitStr != "" {
		limit, err := strconv.Atoi(limitStr)
		if err == nil && limit > 0 {
			filter.Limit = limit
		}
	} else {
		filter.Limit = 20 // Default limit
	}

	if skipStr := c.Query("skip"); skipStr != "" {
		skip, err := strconv.Atoi(skipStr)
		if err == nil && skip >= 0 {
			filter.Skip = skip
		}
	}

	// Parse sorting
	filter.SortBy = c.DefaultQuery("sort_by", "name")
	filter.SortOrder = c.DefaultQuery("sort_order", "asc")

	// Get exercises
	response, err := r.manager.ListExercises(c, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to list exercises",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

// UpdateExercise updates an exercise
func (r *Route) UpdateExercise(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: "Exercise ID is required",
		})
		return
	}

	var request models.UpdateExerciseRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: err.Error(),
		})
		return
	}

	exercise, err := r.manager.UpdateExercise(c, id, request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to update exercise",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, exercise)
}

// DeleteExercise deletes an exercise
func (r *Route) DeleteExercise(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: "Exercise ID is required",
		})
		return
	}

	err := r.manager.DeleteExercise(c, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to delete exercise",
			Message: err.Error(),
		})
		return
	}

	c.Status(http.StatusNoContent)
}

// Exercise handlers for users
// UserSearchExercises allows users to search for exercises
func (r *Route) UserSearchExercises(c *gin.Context) {
	// Parse query parameters for filters
	filter := models.ExerciseFilter{}

	// Parse query - required parameter for user search
	filter.Query = c.Query("query")
	if filter.Query == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: "Query parameter is required for search",
		})
		return
	}

	// Parse muscle groups
	if muscleGroups := c.QueryArray("muscle_groups[]"); len(muscleGroups) > 0 {
		filter.MuscleGroups = muscleGroups
	}

	// Parse equipment
	if equipment := c.QueryArray("equipment[]"); len(equipment) > 0 {
		filter.Equipment = equipment
	}

	filter.Difficulty = c.Query("difficulty")
	filter.ExerciseType = c.Query("exercise_type")

	// Parse pagination
	if limitStr := c.Query("limit"); limitStr != "" {
		limit, err := strconv.Atoi(limitStr)
		if err == nil && limit > 0 {
			filter.Limit = limit
		}
	} else {
		filter.Limit = 20 // Default limit
	}

	if skipStr := c.Query("skip"); skipStr != "" {
		skip, err := strconv.Atoi(skipStr)
		if err == nil && skip >= 0 {
			filter.Skip = skip
		}
	}

	// Parse sorting
	filter.SortBy = c.DefaultQuery("sort_by", "name")
	filter.SortOrder = c.DefaultQuery("sort_order", "asc")

	// Get exercises
	response, err := r.manager.ListExercises(c, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to search exercises",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

// GetExerciseDetails gets detailed information about a specific exercise
func (r *Route) GetExerciseDetails(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "Invalid request",
			Message: "Exercise ID is required",
		})
		return
	}

	exercise, err := r.manager.GetExerciseByID(c, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "Failed to get exercise details",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, exercise)
}
