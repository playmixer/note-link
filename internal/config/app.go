package config

import (
	"os"
	"smartnote/internal/logger"
	"strconv"

	"github.com/joho/godotenv"
)

var (
	App AppConfig
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

func Init() {
	var err error
	godotenv.Load(".env")
	App = AppConfig{}
	App.Database.Host = os.Getenv("DB_HOST")
	App.Database.Port = os.Getenv("DB_PORT")
	App.Database.Name = os.Getenv("DB_NAME")
	App.Database.Username = os.Getenv("DB_USERNAME")
	App.Database.Password = os.Getenv("DB_PASSWORD")
	App.Http.Port, err = strconv.Atoi(os.Getenv("HTTP_PORT"))
	if err != nil {
		logger.Error(err)
		App.Http.Port = 8080
	}
}
