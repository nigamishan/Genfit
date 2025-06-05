package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

// Exercise represents the structure of an exercise
type Exercise struct {
	Name                   string   `json:"name"`
	Description            string   `json:"description"`
	PrimaryMuscleGroups    []string `json:"primary_muscle_groups"`
	SupportingMuscleGroups []string `json:"supporting_muscle_groups"`
	Equipment              []string `json:"equipment"`
	Difficulty             string   `json:"difficulty"`
	ExerciseType           string   `json:"exercise_type"`
	Instructions           []string `json:"instructions"`
}

// ExerciseData represents the structure of the JSON file
type ExerciseData struct {
	Data []Exercise `json:"data"`
}

const (
	// API endpoint
	apiURL = "http://localhost:8080/admin/exercises"
	// Basic auth header (admin1:admin1 base64 encoded)
	authHeader = "Basic YWRtaW4xOmFkbWluMQ=="
	// Content type
	contentType = "application/json"
)

func main() {
	// Read the exercises.json file
	jsonFile, err := os.Open("../exercises.json")
	if err != nil {
		log.Fatalf("Failed to open exercises.json: %v", err)
	}
	defer jsonFile.Close()

	// Read file contents
	byteValue, err := io.ReadAll(jsonFile)
	if err != nil {
		log.Fatalf("Failed to read exercises.json: %v", err)
	}

	// Parse JSON
	var exerciseData ExerciseData
	err = json.Unmarshal(byteValue, &exerciseData)
	if err != nil {
		log.Fatalf("Failed to parse JSON: %v", err)
	}

	fmt.Printf("Found %d exercises to upload\n", len(exerciseData.Data))

	// Create HTTP client with timeout
	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	successCount := 0
	failureCount := 0

	// Iterate over each exercise and make HTTP request
	for i, exercise := range exerciseData.Data {
		fmt.Printf("\n[%d/%d] Uploading exercise: %s\n", i+1, len(exerciseData.Data), exercise.Name)

		// Convert exercise to JSON
		exerciseJSON, err := json.Marshal(exercise)
		if err != nil {
			log.Printf("Failed to marshal exercise %s: %v", exercise.Name, err)
			failureCount++
			continue
		}

		// Create HTTP request
		req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(exerciseJSON))
		if err != nil {
			log.Printf("Failed to create request for exercise %s: %v", exercise.Name, err)
			failureCount++
			continue
		}

		// Set headers
		req.Header.Set("Authorization", authHeader)
		req.Header.Set("Content-Type", contentType)

		// Make the request
		resp, err := client.Do(req)
		if err != nil {
			log.Printf("Failed to send request for exercise %s: %v", exercise.Name, err)
			failureCount++
			continue
		}

		// Read response body
		respBody, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Printf("Failed to read response for exercise %s: %v", exercise.Name, err)
			resp.Body.Close()
			failureCount++
			continue
		}
		resp.Body.Close()

		// Check response status
		if resp.StatusCode >= 200 && resp.StatusCode < 300 {
			fmt.Printf("✓ Successfully created exercise: %s (Status: %d)\n", exercise.Name, resp.StatusCode)
			successCount++
		} else {
			fmt.Printf("✗ Failed to create exercise: %s (Status: %d)\n", exercise.Name, resp.StatusCode)
			fmt.Printf("Response: %s\n", string(respBody))
			failureCount++
		}

		// Add a small delay between requests to avoid overwhelming the server
		time.Sleep(100 * time.Millisecond)
	}

	// Print summary
	fmt.Printf("\n=== Upload Summary ===\n")
	fmt.Printf("Total exercises: %d\n", len(exerciseData.Data))
	fmt.Printf("Successful uploads: %d\n", successCount)
	fmt.Printf("Failed uploads: %d\n", failureCount)

	if failureCount > 0 {
		fmt.Printf("\nSome exercises failed to upload. Please check the server logs and try again.\n")
		os.Exit(1)
	} else {
		fmt.Printf("\nAll exercises uploaded successfully! 🎉\n")
	}
}
