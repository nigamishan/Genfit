package config

import (
	"fmt"
	"os"
	"time"

	"gopkg.in/yaml.v3"
)

// Config is the root configuration structure
type Config struct {
	Server            ServerConfig      `yaml:"server"`
	Logger            LoggerConfig      `yaml:"logger"`
	Database          DatabaseConfig    `yaml:"database"`
	WhitelistedAdmins map[string]string `yaml:"whitelisted_admins"`
	WhitelistedUsers  map[string]string `yaml:"whitelisted_users"`
}

// ServerConfig contains server-specific settings
type ServerConfig struct {
	Port         string        `yaml:"port"`
	Timeout      time.Duration `yaml:"timeout"`
	ReadTimeout  time.Duration `yaml:"readTimeout"`
	WriteTimeout time.Duration `yaml:"writeTimeout"`
	Mode         string        `yaml:"mode"`
}

// LoggerConfig contains logging configuration
type LoggerConfig struct {
	Level  string `yaml:"level"`
	Format string `yaml:"format"`
	Output string `yaml:"output"`
}

// DatabaseConfig contains database configuration
type DatabaseConfig struct {
	MongoDB MongoDBConfig `yaml:"mongodb"`
}

// MongoDBConfig contains MongoDB-specific configuration
type MongoDBConfig struct {
	Name     string `yaml:"name"`
	Host     string `yaml:"host"`
	Port     string `yaml:"port"`
	User     string `yaml:"user"`
	Password string `yaml:"password"`
}

// LoadConfig reads the configuration file and returns a Config object
func LoadConfig(configPath string) (*Config, error) {
	// Set default config path if not provided
	if configPath == "" {
		configPath = "config/local.yaml"
	}

	// Read configuration file
	data, err := os.ReadFile(configPath)
	if err != nil {
		return nil, fmt.Errorf("error reading config file: %v", err)
	}

	// Parse YAML into Config struct
	var config Config
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, fmt.Errorf("error parsing config file: %v", err)
	}

	return &config, nil
}
