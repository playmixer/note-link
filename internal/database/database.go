package database

import (
	"fmt"
	"smartnote/internal/logger"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Config struct {
	Username string
	Password string
	Host     string
	Port     string
	Name     string
	Type     string
}

func Create(c Config) *gorm.DB {
	var err error

	var dialector gorm.Dialector
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		c.Username, c.Password, c.Host, c.Port, c.Name)
	logger.Info("database dsn " + dsn)
	dialector = mysql.Open(dsn)

	db, err := gorm.Open(dialector, &gorm.Config{})
	if err != nil {
		logger.Error(err)
	}
	return db
}
