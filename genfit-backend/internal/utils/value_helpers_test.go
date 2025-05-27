package utils

import (
	"testing"
)

func TestGetStringValue(t *testing.T) {
	defaultValue := "default"
	newValue := "new"

	// Test with non-nil value
	result := GetStringValue(&newValue, defaultValue)
	if result != newValue {
		t.Errorf("GetStringValue with non-nil value: expected %s, got %s", newValue, result)
	}

	// Test with nil value
	result = GetStringValue(nil, defaultValue)
	if result != defaultValue {
		t.Errorf("GetStringValue with nil value: expected %s, got %s", defaultValue, result)
	}
}

func TestGetIntValue(t *testing.T) {
	defaultValue := 1
	newValue := 2

	// Test with non-nil value
	result := GetIntValue(&newValue, defaultValue)
	if result != newValue {
		t.Errorf("GetIntValue with non-nil value: expected %d, got %d", newValue, result)
	}

	// Test with nil value
	result = GetIntValue(nil, defaultValue)
	if result != defaultValue {
		t.Errorf("GetIntValue with nil value: expected %d, got %d", defaultValue, result)
	}
}

func TestGetFloat64Value(t *testing.T) {
	defaultValue := 1.0
	newValue := 2.0

	// Test with non-nil value
	result := GetFloat64Value(&newValue, defaultValue)
	if result != newValue {
		t.Errorf("GetFloat64Value with non-nil value: expected %f, got %f", newValue, result)
	}

	// Test with nil value
	result = GetFloat64Value(nil, defaultValue)
	if result != defaultValue {
		t.Errorf("GetFloat64Value with nil value: expected %f, got %f", defaultValue, result)
	}
}

func TestGetBoolValue(t *testing.T) {
	defaultValue := false
	newValue := true

	// Test with non-nil value
	result := GetBoolValue(&newValue, defaultValue)
	if result != newValue {
		t.Errorf("GetBoolValue with non-nil value: expected %t, got %t", newValue, result)
	}

	// Test with nil value
	result = GetBoolValue(nil, defaultValue)
	if result != defaultValue {
		t.Errorf("GetBoolValue with nil value: expected %t, got %t", defaultValue, result)
	}
}
