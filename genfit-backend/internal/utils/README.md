# Utils Package

This package provides utility functions used across the fitness backend application.

## Value Helpers

The `value_helpers.go` file contains utility functions for handling nil values in update operations:

- `GetStringValue`: Returns the new value if not nil, otherwise returns the default value for string types
- `GetIntValue`: Returns the new value if not nil, otherwise returns the default value for int types
- `GetFloat64Value`: Returns the new value if not nil, otherwise returns the default value for float64 types
- `GetBoolValue`: Returns the new value if not nil, otherwise returns the default value for boolean types

### Usage

```go
import (
    "github.com/fitness-backend/internal/utils"
)

// Example: Handling nil values in updates
updatedName := utils.GetStringValue(request.Name, existingUser.Name)
```

## Running Tests

Run the tests for this package with:

```bash
go test -v ./internal/utils
``` 