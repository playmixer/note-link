package database

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"smartnote/internal/logger"
)

const (
	TypeMysql  = "mysql"
	TypeSQLite = "sqlite"
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
	if c.Type == TypeMysql {
		dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			c.Username, c.Password, c.Host, c.Port, c.Name)
		dialector = mysql.Open(dsn)
	} else {
		//dialector = sqlite.Open("sqlite.db")
	}

	db, err := gorm.Open(dialector, &gorm.Config{})
	if err != nil {
		logger.Error(err)
	}
	return db
}
