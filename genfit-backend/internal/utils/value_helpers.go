package utils

// GetStringValue returns the new value if not nil, otherwise returns the default value
// Used for handling optional string parameters in update operations
func GetStringValue(newValue *string, defaultValue string) string {
	if newValue != nil {
		return *newValue
	}
	return defaultValue
}

// GetIntValue returns the new value if not nil, otherwise returns the default value
// Used for handling optional int parameters in update operations
func GetIntValue(newValue *int, defaultValue int) int {
	if newValue != nil {
		return *newValue
	}
	return defaultValue
}

// GetFloat64Value returns the new value if not nil, otherwise returns the default value
// Used for handling optional float64 parameters in update operations
func GetFloat64Value(newValue *float64, defaultValue float64) float64 {
	if newValue != nil {
		return *newValue
	}
	return defaultValue
}

// GetBoolValue returns the new value if not nil, otherwise returns the default value
// Used for handling optional bool parameters in update operations
func GetBoolValue(newValue *bool, defaultValue bool) bool {
	if newValue != nil {
		return *newValue
	}
	return defaultValue
}
