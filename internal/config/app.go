package config

import (
	"encoding/json"
	"os"
	"smartnote/internal/logger"
)

type AppConfig struct {
	Database struct {
		Port     string `json:"port"`
		Host     string `json:"host"`
		Name     string `json:"name"`
		Username string `json:"username"`
		Password string `json:"password"`
		Type     string `json:"type"`
	} `json:"database"`
	Http struct {
		Port int `json:"port"`
	} `json:"http"`
}

func CreateConfig() (AppConfig, error) {
	buf, err := os.ReadFile("./config.json")
	if err != nil {
		logger.Error(err)
		return AppConfig{}, err
	}

	conf := AppConfig{}
	err = json.Unmarshal(buf, &conf)
	if err != nil {
		logger.Error(err)
		return conf, err
	}

	return conf, nil
}
