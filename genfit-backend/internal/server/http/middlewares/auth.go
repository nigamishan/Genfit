package middlewares

import (
	"encoding/base64"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// WhitelistedUsers and WhitelistedAdmins store the username:password pairs for authentication
var WhitelistedUsers map[string]string
var WhitelistedAdmins map[string]string

// InitWhitelistedUsers initializes the whitelist of users
func InitWhitelistedUsers(users map[string]string) {
	WhitelistedUsers = users
}

// InitWhitelistedAdmins initializes the whitelist of admins
func InitWhitelistedAdmins(admins map[string]string) {
	WhitelistedAdmins = admins
}

// extractBasicAuth extracts username and password from a Basic Auth header
func extractBasicAuth(authHeader string) (username, password string, ok bool) {
	if !strings.HasPrefix(authHeader, "Basic ") {
		return "", "", false
	}

	// Get the base64 encoded credentials (remove "Basic " prefix)
	encoded := authHeader[6:]

	// Decode the credentials
	decoded, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return "", "", false
	}

	// Split into username and password
	credentials := strings.SplitN(string(decoded), ":", 2)
	if len(credentials) != 2 {
		return "", "", false
	}

	return credentials[0], credentials[1], true
}

// AuthMiddleware handles authentication for protected routes
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// Extract username and password from the Authorization header
		username, password, ok := extractBasicAuth(authHeader)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization header format"})
			c.Abort()
			return
		}

		// Check if the user exists in the whitelist
		expectedPassword, exists := WhitelistedUsers[username]
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			c.Abort()
			return
		}

		// Verify password
		if expectedPassword != password {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
			c.Abort()
			return
		}

		// Set user info in the context for later use
		c.Set("username", username)
		c.Set("is_admin", false)

		c.Next()
	}
}

// AdminAuthMiddleware handles authentication for admin routes
func AdminAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// Extract username and password from the Authorization header
		username, password, ok := extractBasicAuth(authHeader)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization header format"})
			c.Abort()
			return
		}

		// Check if the admin exists in the whitelist
		expectedPassword, exists := WhitelistedAdmins[username]
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Admin not found"})
			c.Abort()
			return
		}

		// Verify password
		if expectedPassword != password {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
			c.Abort()
			return
		}

		// Set admin info in the context for later use
		c.Set("username", username)
		c.Set("is_admin", true)

		c.Next()
	}
}
