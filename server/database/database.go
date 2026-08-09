package database

import (
	"log"
	"os"

	"github.com/saepudinasep/blog-go-react/server/model"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DBConn *gorm.DB

func ConnectDB() {

	user := os.Getenv("db_user")
	password := os.Getenv("db_password")
	dbName := os.Getenv("db_name")

	dsn := user + ":" + password + "@tcp(localhost:3306)/" + dbName + "?charset=utf8mb4&parseTime=True&loc=Local"

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Error),
	})

	if err != nil {
		panic("Failed to connect to database!")
	}

	log.Println("Database connection established.")

	db.AutoMigrate(new(model.Blog))

	DBConn = db
}
