package middleware

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

// LoggingMiddleware handles request logging
func LoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Start timer
		start := time.Now()

		// Process request
		c.Next()

		// Calculate latency
		latency := time.Since(start)

		// Log request details
		fmt.Printf("%s | %s | %s | %d | %s\n",
			c.Request.Method,
			c.Request.URL.Path,
			c.ClientIP(),
			c.Writer.Status(),
			latency,
		)
	}
}