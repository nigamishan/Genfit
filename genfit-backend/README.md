# Fitness Backend

A Go-based backend service for fitness workout planning and tracking.

## Project Structure

```
├── cmd/
│   └── api/
│       └── main.go
├── internal/
│   ├── api/
│   │   ├── handlers/
│   │   │   ├── workout.go
│   │   │   ├── user.go
│   │   ├── middleware/
│   │   │   ├── auth.go
│   │   │   └── logging.go
│   │   └── routes/
│   │       └── routes.go
│   └── services/
│       ├── workout.go
│       ├── user.go
│       └── leaderboard.go
├── pkg/
│   ├── logger/
│   ├── database/
│   └── utils/
├── configs/
│   └── config.yaml
├── migrations/
├── scripts/
├── docs/
├── test/
├── go.mod
└── README.md
```

## Features

- Workout plan generation using OpenAI
- User management
- CSV export functionality

## Setup

1. Clone the repository
2. Set up environment variables
3. Run migrations
4. Start the server

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `CSV_STORAGE_PATH`: Path for storing generated CSV files

## API Documentation

API documentation can be found in the `docs` directory.