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

- **User Management**: Create, read, update, and delete user profiles with username-based authentication
- **Exercise Catalog**: Comprehensive exercise database with filtering options
- **Workout Planning**: Custom workout plan creation and management
- **Progress Tracking**: Log and analyze fitness metrics over time
- **MongoDB Integration**: Robust data persistence using MongoDB
- **Authentication-based Access**: Users can only access their own data through authenticated endpoints

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

Authentication is implemented using HTTP Basic Authentication with username-based access control. The system extracts the username from the authentication credentials and uses it to ensure users can only access their own data.

To authenticate requests:

1. Encode your username and password in the format `username:password` using Base64
2. Add an Authorization header with the value `Basic {encoded-credentials}`

Example using curl:

```bash
# Regular user authentication - accessing your own profile
curl -X GET http://localhost:8080/users/me \
  -H "Authorization: Basic am9objpwYXNzd29yZDEyMw==" \
  -H "Content-Type: application/json"

# Admin authentication - managing exercises
curl -X POST http://localhost:8080/admin/exercises \
  -H "Authorization: Basic YWRtaW46YWRtaW5wYXNz" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Barbell Squat",
    "description": "A compound exercise for legs",
    "primary_muscle_groups": ["quadriceps", "glutes"],
    "supporting_muscle_groups": ["hamstrings"],
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

**Important**: Users can only access their own data. The API automatically determines which user is making the request based on the authenticated username and restricts access accordingly.

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

#### Get Your Profile

- **Endpoint**: `GET /users/me`
- **Description**: Retrieves your user profile details
- **Authentication**: Required (Basic Auth)
- **Response**: Your user profile data

#### Update Your Profile

- **Endpoint**: `PUT /users/me`
- **Description**: Updates your user profile
- **Authentication**: Required (Basic Auth)
- **Request Body**: Same as Create User but all fields are optional
- **Response**: Updated user profile

#### Delete Your Account

- **Endpoint**: `DELETE /users/me`
- **Description**: Deletes your user account
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
    "primary_muscle_groups": ["quadriceps", "glutes"],
    "supporting_muscle_groups": ["hamstrings"],
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
  - `primary_muscle_groups`: Filter by primary muscle groups (comma separated)
  - `supporting_muscle_groups`: Filter by supporting muscle groups (comma separated)
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
- **Description**: Creates a workout plan for the authenticated user
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

#### Get Your Workout Plan

- **Endpoint**: `GET /workout/me`
- **Description**: Retrieves your workout plan
- **Authentication**: Required (Basic Auth)
- **Response**: Your workout plan details with exercises

#### Update Your Workout Plan

- **Endpoint**: `PUT /workout/me`
- **Description**: Updates your workout plan
- **Authentication**: Required (Basic Auth)
- **Request Body**: Same as Create Workout Plan with all fields optional
- **Response**: Updated workout plan

#### Delete Your Workout Plan

- **Endpoint**: `DELETE /workout/me`
- **Description**: Deletes your workout plan
- **Authentication**: Required (Basic Auth)
- **Response**: 204 No Content

#### Get Daily Workout Volume

- **Endpoint**: `GET /workout/volume`
- **Description**: Retrieves daily workout volume data (total sets per day). Can fetch for all days or filter by a specific day.
- **Authentication**: Required (Basic Auth)
- **Query Parameters**:
  - `day`: Optional. Specific day (1-7) where 1=Monday, 7=Sunday. If not provided, returns all days.
- **Response**: Daily workout volume data

**Example Requests:**
```bash
# Get volume for all days
curl -H "Authorization: Basic dXNlcjE6dXNlcjE=" "http://localhost:8080/workout/volume"

# Get volume for Monday (day 1)
curl -H "Authorization: Basic dXNlcjE6dXNlcjE=" "http://localhost:8080/workout/volume?day=1"

# Get volume for Friday (day 5)
curl -H "Authorization: Basic dXNlcjE6dXNlcjE=" "http://localhost:8080/workout/volume?day=5"
```

**Response format:**
```json
{
  "user_id": "user123",
  "daily_volumes": [
    {
      "day": 1,
      "day_name": "Monday", 
      "total_sets": 5,
      "exercises": [
        {
          "exercise_id": "ex123",
          "exercise_name": "Bench Press",
          "total_sets": 3
        },
        {
          "exercise_id": "ex124", 
          "exercise_name": "Barbell Squat",
          "total_sets": 2
        }
      ]
    },
    {
      "day": 2,
      "day_name": "Tuesday",
      "total_sets": 0,
      "exercises": []
    }
  ],
  "total_weekly_volume": 15
}
```

### Exercise Search (Public)

#### Search Exercises

- **Endpoint**: `GET /exercises/search`
- **Description**: Public search for exercises by name (no authentication required). Searches for exercises containing the provided substring in their name. Returns top 5 matching results sorted alphabetically.
- **Authentication**: None (public endpoint)
- **Query Parameters**:
  - `query`: Search query (required, minimum 2 characters) - searches exercise names containing this substring
- **Response**: List of up to 5 matching exercises sorted by name

**Example:**
```bash
# Search for exercises containing "bench"
curl "http://localhost:8080/exercises/search?query=bench"

# Search for exercises containing "press"  
curl "http://localhost:8080/exercises/search?query=press"
```

**Response format:**
```json
{
  "exercises": [
    {
      "id": "ex123",
      "name": "Bench Press",
      "description": "...",
      "primary_muscle_groups": ["chest"],
      "supporting_muscle_groups": ["shoulders", "triceps"],
      "difficulty": "intermediate",
      "exercise_type": "strength"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 5
}
```

### Progress Tracking

#### Log Progress

- **Endpoint**: `POST /progress`
- **Description**: Logs a new progress entry for the authenticated user
- **Authentication**: Required (Basic Auth)
- **Request Body**:
  ```json
  {
    "metric_type": "weight",
    "value": 80.5,
    "unit": "kg",
    "recorded_at": "2023-05-15T08:30:00Z",
    "notes": "Morning measurement",
    "location": "Home"
  }
  ```
- **Response**: Created progress entry with ID

#### Get Your Progress

- **Endpoint**: `GET /progress/me`
- **Description**: Retrieves your progress entries with optional filters
- **Authentication**: Required (Basic Auth)
- **Query Parameters**:
  - `metric_types[]`: Optional. Filter by specific metric types (array parameter)
  - `start_date`: Filter by start date (RFC3339 format)
  - `end_date`: Filter by end date (RFC3339 format)
  - `limit`: Maximum number of entries to return
  - `sort_order`: "asc" or "desc" (default: "desc")
- **Response**: List of your progress entries

**Example requests:**
```bash
# Get all progress entries (newest first)
curl -H "Authorization: Basic dXNlcjE6dXNlcjE=" "http://localhost:8080/progress/me"

# Get weight tracking entries only
curl -H "Authorization: Basic dXNlcjE6dXNlcjE=" "http://localhost:8080/progress/me?metric_types[]=weight"

# Get recent 10 entries for multiple metrics
curl -H "Authorization: Basic dXNlcjE6dXNlcjE=" "http://localhost:8080/progress/me?metric_types[]=weight&metric_types[]=body_fat&limit=10"

# Get entries from a specific date range
curl -H "Authorization: Basic dXNlcjE6dXNlcjE=" "http://localhost:8080/progress/me?start_date=2023-01-01T00:00:00Z&end_date=2023-12-31T23:59:59Z"
```

#### Get Your Progress Summary

- **Endpoint**: `GET /progress/me/summary`
- **Description**: Retrieves summary of your progress metrics
- **Authentication**: Required (Basic Auth)
- **Query Parameters**:
  - `metric_types[]`: Optional. Filter by specific metric types (array parameter)
- **Response**: Summary statistics for each of your metric types

**Available metric types:**
- `weight`: Body weight tracking
- `body_fat`: Body fat percentage
- `deadlift_pr`: Deadlift personal records
- `squat_pr`: Squat personal records  
- `bench_pr`: Bench press personal records
- `body_measure`: Body measurements (with measure_area)
- `custom`: Custom metrics

**Example requests:**
```bash
# Get summary for all metric types
curl -H "Authorization: Basic dXNlcjE6dXNlcjE=" "http://localhost:8080/progress/me/summary"

# Get summary for weight and body fat only
curl -H "Authorization: Basic dXNlcjE6dXNlcjE=" "http://localhost:8080/progress/me/summary?metric_types[]=weight&metric_types[]=body_fat"

# Get summary for PR metrics only
curl -H "Authorization: Basic dXNlcjE6dXNlcjE=" "http://localhost:8080/progress/me/summary?metric_types[]=deadlift_pr&metric_types[]=squat_pr&metric_types[]=bench_pr"
```

#### Get Your Progress Trend

- **Endpoint**: `GET /progress/me/trend`
- **Description**: Retrieves trend information for your metrics
- **Authentication**: Required (Basic Auth)
- **Query Parameters**:
  - `metric_types[]`: Optional. Filter by specific metric types (array parameter). If not provided, analyzes all available metric types.
- **Response**: Trend analysis for each of your metric types

**Example requests:**
```bash
# Get trends for all available metric types
curl -H "Authorization: Basic dXNlcjE6dXNlcjE=" "http://localhost:8080/progress/me/trend"

# Get trends for weight tracking only
curl -H "Authorization: Basic dXNlcjE6dXNlcjE=" "http://localhost:8080/progress/me/trend?metric_types[]=weight"

# Get trends for strength metrics
curl -H "Authorization: Basic dXNlcjE6dXNlcjE=" "http://localhost:8080/progress/me/trend?metric_types[]=deadlift_pr&metric_types[]=squat_pr&metric_types[]=bench_pr"
```

#### Delete Progress Entry

- **Endpoint**: `DELETE /progress`
- **Description**: Deletes one of your progress entries
- **Authentication**: Required (Basic Auth)
- **Query Parameters**:
  - `entryId`: ID of the progress entry to delete
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