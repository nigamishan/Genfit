# Genfit - Fitness Backend API

A robust Go-based backend service for fitness tracking and workout management. This API provides endpoints for user management, exercise catalog management, workout planning, and progress tracking.

## Repository Structure

```
├── main.go                 # Application entry point
├── go.mod                  # Go module dependencies
├── go.sum                  # Dependency checksums
├── docker-compose.yml      # Docker Compose configuration
├── internal/               # Internal application code
│   ├── config/             # Configuration handling
│   ├── logger/             # Structured logging
│   ├── manager/            # Business logic layer
│   ├── models/             # Data structures
│   │   ├── admin.go        # Admin-specific models
│   │   ├── user.go         # User models
│   │   ├── progress.go     # Progress tracking models
│   │   ├── workout.go      # Workout plan models
│   │   └── input_form.go   # Forms and input validation
│   ├── server/             # Server implementation
│   │   └── http/           # HTTP server
│   │       ├── init.go     # Server initialization
│   │       ├── routes.go   # Route definitions and handlers
│   │       └── middlewares/# Request middleware
│   ├── storage/            # Data persistence layer
│   │   └── mongodb/        # MongoDB implementation
│   │       ├── database.go # Database connection
│   │       ├── models.go   # Database models
│   │       └── repository.go# Data access operations
│   └── utils/              # Utility functions
└── README.md               # Project documentation
```

## Features

- **User Management**: Create, read, update, and delete user profiles
- **Exercise Catalog**: Comprehensive exercise database with filtering options
- **Workout Planning**: Custom workout plan creation and management
- **Progress Tracking**: Log and analyze fitness metrics over time
- **MongoDB Integration**: Robust data persistence using MongoDB

## Setup

### Prerequisites

- Go 1.16+
- MongoDB
- Docker and Docker Compose (optional)

### Running with Docker Compose

1. Clone the repository
2. Navigate to the project root directory
3. Start the services:
   ```
   docker-compose up -d
   ```

### Running Locally

1. Clone the repository
2. Navigate to the project root directory
3. Install dependencies:
   ```
   go mod download
   ```
4. Set up environment variables or create a config/local.yaml file
5. Start the server:
   ```
   go run main.go
   ```

## Configuration

Configuration is handled via YAML files in the `config` directory. You can override settings using environment variables.

Example configuration:

```yaml
server:
  port: "8080"
  timeout: 30s
  readTimeout: 15s
  writeTimeout: 15s
  mode: "development"

logger:
  level: "debug"
  format: "text"
  output: "console"

database:
  mongodb:
    name: "fitness"
    host: "localhost"
    port: "27017"
    user: ""
    password: ""

# Whitelisted users for Basic Authentication
whitelisted_users:
  john: "password123"
  sarah: "securepass"

# Whitelisted admins for Basic Authentication
whitelisted_admins:
  admin: "adminpass"
  superuser: "superpass"
```

## API Documentation

### Authentication

Authentication is implemented using HTTP Basic Authentication. To authenticate requests:

1. Encode your username and password in the format `username:password` using Base64
2. Add an Authorization header with the value `Basic {encoded-credentials}`

Example using curl:

```bash
# Regular user authentication
curl -X GET http://localhost:8080/users/123 \
  -H "Authorization: Basic am9objpwYXNzd29yZDEyMw==" \
  -H "Content-Type: application/json"

# Admin authentication
curl -X POST http://localhost:8080/admin/exercises \
  -H "Authorization: Basic YWRtaW46YWRtaW5wYXNz" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Barbell Squat",
    "description": "A compound exercise for legs",
    "muscle_groups": ["quadriceps", "hamstrings", "glutes"],
    "difficulty": "intermediate",
    "exercise_type": "strength"
  }'
```

In the examples above:
- `am9objpwYXNzd29yZDEyMw==` is the Base64 encoding of `john:password123`
- `YWRtaW46YWRtaW5wYXNz` is the Base64 encoding of `admin:adminpass`

You can generate these values using command line utilities:

```bash
echo -n "username:password" | base64
```

### User Management

#### Create User

- **Endpoint**: `POST /users`
- **Description**: Creates a new user profile
- **Authentication**: None (public endpoint)
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "sex": "male",
    "weight": 80.5,
    "height": 180.0,
    "current_fitness": {
      "activity_level": "moderate",
      "experience_level": "intermediate"
    },
    "goals": {
      "primary_goal": "muscle_gain",
      "target_weight": 85.0,
      "weekly_workouts": 4
    }
  }
  ```
- **Response**: Created user with ID

#### Get User

- **Endpoint**: `GET /users/{userId}`
- **Description**: Retrieves user details
- **Authentication**: Required (Basic Auth)
- **Response**: User profile data

#### Update User

- **Endpoint**: `PUT /users/{userId}`
- **Description**: Updates user profile
- **Authentication**: Required (Basic Auth)
- **Request Body**: Same as Create User but all fields are optional
- **Response**: Updated user profile

#### Delete User

- **Endpoint**: `DELETE /users/{userId}`
- **Description**: Deletes a user account
- **Authentication**: Required (Basic Auth)
- **Response**: 204 No Content

### Exercise Management (Admin)

#### Create Exercise

- **Endpoint**: `POST /admin/exercises`
- **Description**: Creates a new exercise in the database
- **Authentication**: Required (Admin Basic Auth)
- **Request Body**:
  ```json
  {
    "name": "Barbell Squat",
    "description": "A compound exercise that targets the quadriceps, hamstrings, and glutes",
    "muscle_groups": ["quadriceps", "hamstrings", "glutes"],
    "equipment": ["barbell", "squat rack"],
    "difficulty": "intermediate",
    "exercise_type": "strength",
    "demo_video_url": "https://example.com/squat.mp4",
    "demo_image_url": "https://example.com/squat.jpg",
    "instructions": [
      "Stand with feet shoulder-width apart",
      "Place the barbell on your upper back",
      "Bend knees and lower body until thighs are parallel to floor",
      "Push through heels to return to starting position"
    ]
  }
  ```
- **Response**: Created exercise with ID

#### List Exercises

- **Endpoint**: `GET /admin/exercises`
- **Description**: Lists all exercises with optional filters
- **Authentication**: Required (Admin Basic Auth)
- **Query Parameters**:
  - `limit`: Maximum number of results (default: 20)
  - `skip`: Number of records to skip (for pagination)
  - `muscle_groups`: Filter by muscle groups (comma separated)
  - `difficulty`: Filter by difficulty level
  - `exercise_type`: Filter by exercise type
- **Response**: List of exercises

#### Get Exercise by ID

- **Endpoint**: `GET /admin/exercises/{id}`
- **Description**: Gets exercise details by ID
- **Authentication**: Required (Admin Basic Auth)
- **Response**: Exercise details

#### Update Exercise

- **Endpoint**: `PUT /admin/exercises/{id}`
- **Description**: Updates an exercise
- **Authentication**: Required (Admin Basic Auth)
- **Request Body**: Same as Create Exercise
- **Response**: Updated exercise details

#### Delete Exercise

- **Endpoint**: `DELETE /admin/exercises/{id}`
- **Description**: Deletes an exercise
- **Authentication**: Required (Admin Basic Auth)
- **Response**: 204 No Content

### Workout Plan Management

#### Create Workout Plan

- **Endpoint**: `POST /workout/manual`
- **Description**: Creates a workout plan for a user
- **Authentication**: Required (Basic Auth)
- **Request Body**:
  ```json
  {
    "name": "Full Body Strength Plan",
    "description": "A 3-day full body strength training program",
    "workouts": [
      {
        "name": "Bench Press",
        "exercise_id": "ex123",
        "muscles_targeted": ["chest", "shoulders", "triceps"],
        "day": 1,
        "set_details": [
          {
            "set_number": 1,
            "reps": 12,
            "weight": 50.0,
            "rpe": 7,
            "rest_duration": 90,
            "is_warm_up": true
          },
          {
            "set_number": 2,
            "reps": 10,
            "weight": 60.0,
            "rpe": 8,
            "rest_duration": 120
          }
        ]
      }
    ]
  }
  ```
- **Response**: Created workout plan with ID

#### Get Workout Plan

- **Endpoint**: `GET /workout/{userId}`
- **Description**: Retrieves a user's workout plan
- **Authentication**: Required (Basic Auth)
- **Response**: Workout plan details with exercises

#### Update Workout Plan

- **Endpoint**: `PUT /workout/{userId}`
- **Description**: Updates a workout plan
- **Authentication**: Required (Basic Auth)
- **Request Body**: Same as Create Workout Plan with all fields optional
- **Response**: Updated workout plan

#### Delete Workout Plan

- **Endpoint**: `DELETE /workout/{userId}`
- **Description**: Deletes a workout plan
- **Authentication**: Required (Basic Auth)
- **Response**: 204 No Content

#### Search Exercises

- **Endpoint**: `POST /workout/exercises/search`
- **Description**: Searches exercises for workout planning
- **Authentication**: Required (Basic Auth)
- **Request Body**:
  ```json
  {
    "query": "squat",
    "muscle_groups": ["legs", "glutes"],
    "difficulty": "beginner",
    "limit": 10
  }
  ```
- **Response**: List of matching exercises

### Progress Tracking

#### Log Progress

- **Endpoint**: `POST /progress`
- **Description**: Logs a new progress entry
- **Authentication**: Required (Basic Auth)
- **Request Body**:
  ```json
  {
    "user_id": "user123",
    "metric_type": "weight",
    "value": 80.5,
    "unit": "kg",
    "recorded_at": "2023-05-15T08:30:00Z",
    "notes": "Morning measurement",
    "location": "Home"
  }
  ```
- **Response**: Created progress entry with ID

#### Get Progress

- **Endpoint**: `GET /progress/{userId}`
- **Description**: Retrieves progress entries with optional filters
- **Authentication**: Required (Basic Auth)
- **Query Parameters**:
  - `metric_types`: Types of metrics to retrieve (comma separated)
  - `start_date`: Filter by start date
  - `end_date`: Filter by end date
  - `limit`: Maximum number of entries to return
  - `sort_order`: "asc" or "desc" (default: "desc")
- **Response**: List of progress entries

#### Get Progress Summary

- **Endpoint**: `GET /progress/{userId}/summary`
- **Description**: Retrieves summary of progress metrics
- **Authentication**: Required (Basic Auth)
- **Response**: Summary statistics for each metric type

#### Get Progress Trend

- **Endpoint**: `GET /progress/{userId}/trend`
- **Description**: Retrieves trend information for metrics
- **Authentication**: Required (Basic Auth)
- **Query Parameters**:
  - `metric_types`: Types of metrics to analyze (comma separated)
- **Response**: Trend analysis for each metric type

#### Delete Progress

- **Endpoint**: `DELETE /progress`
- **Description**: Deletes a progress entry
- **Authentication**: Required (Basic Auth)
- **Request Body**:
  ```json
  {
    "user_id": "user123",
    "entry_id": "entry456"
  }
  ```
- **Response**: 204 No Content

## Database Schema

The application uses MongoDB with the following collections:

- `users`: User profiles and preferences
- `exercises`: Exercise catalog
- `workout_plans`: Workout plans linked to users
- `progress`: Progress tracking entries

## Error Handling

Errors are returned as JSON with the following format:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.