package http

import (
	"context"
	"net/http"

	"github.com/fitness-backend/internal/config"
	"github.com/gin-gonic/gin"
)

// Server represents the HTTP server
type Server struct {
	router     *gin.Engine
	httpServer *http.Server
}

// NewServer creates and configures a server instance based on the provided configuration
func NewServer(cfg *config.Config) *Server {
	// Initialize Gin router
	router := gin.Default()

	// Create HTTP server with configured timeouts
	httpServer := &http.Server{
		Addr:    ":" + cfg.Server.Port,
		Handler: router,
	}

	return &Server{
		router:     router,
		httpServer: httpServer,
	}
}

// GetRouter returns the Gin engine for route configuration
func (s *Server) GetRouter() *gin.Engine {
	return s.router
}

// Start begins listening for requests
func (s *Server) Start() error {
	return s.httpServer.ListenAndServe()
}

// Stop gracefully shuts down the server
func (s *Server) Stop(ctx context.Context) error {
	return s.httpServer.Shutdown(ctx)
}
