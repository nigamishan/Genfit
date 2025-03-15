package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware handles authentication for protected routes
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// TODO: Implement JWT token validation
		// For now, just checking if Authorization header exists
		token := c.GetHeader("Authorization")
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// TODO: Validate token and set user context
		c.Next()
	}
}