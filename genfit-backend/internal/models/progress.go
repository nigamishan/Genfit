package models

import "time"

// ProgressMetricType defines the type of progress metric being tracked
type ProgressMetricType string

// Constants for different progress metric types
const (
	MetricWeight      ProgressMetricType = "weight"       // Body weight in kg
	MetricBodyFat     ProgressMetricType = "body_fat"     // Body fat percentage
	MetricDeadliftPR  ProgressMetricType = "deadlift_pr"  // Personal record for deadlift in kg
	MetricSquatPR     ProgressMetricType = "squat_pr"     // Personal record for squat in kg
	MetricBenchPR     ProgressMetricType = "bench_pr"     // Personal record for bench press in kg
	MetricBodyMeasure ProgressMetricType = "body_measure" // Body measurements (arm, chest, waist, etc.) in cm
	MetricCustom      ProgressMetricType = "custom"       // Custom metrics defined by the user
)

// TrendType defines the type of trend for a metric
type TrendType string

// Constants for different trend types
const (
	TrendIncreasing TrendType = "increasing" // Values are trending upward
	TrendDecreasing TrendType = "decreasing" // Values are trending downward
	TrendStable     TrendType = "stable"     // Values are relatively stable
)

// ProgressEntry represents a single progress data point
type ProgressEntry struct {
	ID          string             `json:"id,omitempty"`
	UserID      string             `json:"user_id" binding:"required"`
	MetricType  ProgressMetricType `json:"metric_type" binding:"required"`
	Value       float64            `json:"value" binding:"required"` // Numeric value of the metric
	Unit        string             `json:"unit" binding:"required"`  // Unit of measurement (kg, cm, %, etc.)
	RecordedAt  time.Time          `json:"recorded_at"`              // When the measurement was taken
	Notes       string             `json:"notes,omitempty"`          // Optional notes
	Location    string             `json:"location,omitempty"`       // Where the measurement was taken (e.g., gym name, home)
	MeasureArea string             `json:"measure_area,omitempty"`   // For body measurements: chest, bicep, waist, etc.
}

// LogProgressRequest represents a request to log a new progress entry
type LogProgressRequest struct {
	MetricType  ProgressMetricType `json:"metric_type" binding:"required"`
	Value       float64            `json:"value" binding:"required"`
	Unit        string             `json:"unit" binding:"required"`
	RecordedAt  *time.Time         `json:"recorded_at,omitempty"` // Optional, defaults to current time if not provided
	Notes       string             `json:"notes,omitempty"`
	Location    string             `json:"location,omitempty"`
	MeasureArea string             `json:"measure_area,omitempty"`
}

// LogProgressResponse represents the response to logging a new progress entry
type LogProgressResponse struct {
	ID          string             `json:"id"`
	UserID      string             `json:"user_id"`
	MetricType  ProgressMetricType `json:"metric_type"`
	Value       float64            `json:"value"`
	Unit        string             `json:"unit"`
	RecordedAt  time.Time          `json:"recorded_at"`
	Notes       string             `json:"notes,omitempty"`
	Location    string             `json:"location,omitempty"`
	MeasureArea string             `json:"measure_area,omitempty"`
	CreatedAt   time.Time          `json:"created_at"`
}

// GetProgressRequest represents a request to retrieve progress entries with filters
type GetProgressRequest struct {
	MetricTypes []ProgressMetricType `json:"metric_types,omitempty"` // Filter by specific metric types
	StartDate   *time.Time           `json:"start_date,omitempty"`   // Filter by date range
	EndDate     *time.Time           `json:"end_date,omitempty"`
	Limit       int                  `json:"limit,omitempty"`      // Maximum number of entries to return
	SortOrder   string               `json:"sort_order,omitempty"` // asc or desc, defaults to desc (newest first)
}

// GetProgressResponse represents the response to retrieving progress entries
type GetProgressResponse struct {
	Entries []ProgressEntry `json:"entries"`
	Total   int             `json:"total"` // Total number of entries matching the filters
}

// ProgressSummary represents a summary of progress metrics for quick display
type ProgressSummary struct {
	MetricType        ProgressMetricType `json:"metric_type"`
	CurrentValue      float64            `json:"current_value"`     // Most recent value
	PreviousValue     float64            `json:"previous_value"`    // Previous value
	Change            float64            `json:"change"`            // Absolute change
	PercentageChange  float64            `json:"percentage_change"` // Percentage change
	Unit              string             `json:"unit"`
	LastMeasuredAt    time.Time          `json:"last_measured_at"`
	MeasurementsSince time.Time          `json:"measurements_since"` // First measurement date
	TotalMeasurements int                `json:"total_measurements"`
}

// GetProgressSummaryResponse represents a summary of all tracked metrics
type GetProgressSummaryResponse struct {
	Summaries []ProgressSummary `json:"summaries"`
	UserID    string            `json:"user_id"`
}

// ProgressTrend calculates the trend for a specific metric
type ProgressTrend struct {
	MetricType    ProgressMetricType `json:"metric_type"`
	TrendType     TrendType          `json:"trend_type"`  // Type of trend (increasing, decreasing, stable)
	Strength      float64            `json:"strength"`    // Strength of the trend (0-100)
	Description   string             `json:"description"` // Human readable description of the trend
	StartValue    float64            `json:"start_value"`
	EndValue      float64            `json:"end_value"`     // Most recent value
	CurrentValue  float64            `json:"current_value"` // Alias for EndValue for backward compatibility
	StartDate     time.Time          `json:"start_date"`
	EndDate       time.Time          `json:"end_date"`
	TotalChange   float64            `json:"total_change"`
	PercentChange float64            `json:"percent_change"`
	WeeklyRate    float64            `json:"weekly_rate"`  // Average change per week
	MonthlyRate   float64            `json:"monthly_rate"` // Average change per month
	Unit          string             `json:"unit"`
	DataPoints    int                `json:"data_points"` // Number of measurements in the period
}

// GetProgressTrendResponse represents trends for specified metrics
type GetProgressTrendResponse struct {
	Trends []ProgressTrend `json:"trends"`
	UserID string          `json:"user_id"`
}

// DeleteProgressRequest represents a request to delete a progress entry
type DeleteProgressRequest struct {
	EntryID string `json:"entry_id" binding:"required"`
}
